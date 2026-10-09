---
title: Realtime chat application with Deno and React
date: "2023-09-11"
tags: [Deno, React, WebSocket]
codeFolderLink: https://github.com/lmxrd/blog-code/tree/main/code/deno_rtc
summary: "Building a chat app with WebSockets, using Deno for the backend and React on the frontend."
---

# Realtime chat application with Deno and React

> This post is related to my course ['Build and Deploy a REST API with Deno' on Newline.co](https://www.newline.co/courses/build-and-deploy-a-rest-api-with-deno). Take a look if you are interested in learning more!

In this post, we will take a look at how to create a chat application by using Deno as our build tool for the frontend and backend. For our frontend, we will use the same setup with React as in the [previous blogpost](/posts/deno-react-csr), while the backend will be vanilla Deno.

For the chat functionality, we will be using WebSockets and also storing the chat on the server to provide a historical chat log. To keep the application simple, we will not require a login, and we will also skip validation and sanitization of messages.

## Shared Types (part 1)

To make it easier for us down the line, we want to have shared interfaces between our frontend and backend, so let's start by defining a message structure. When receiving or sending a message, we want to know who it originates from. We also want to know when it was sent, and lastly, we need to have the content of the message. Create a `shared.ts` file and add the following.

```ts
export type Message = {
  from: string;
  body: string;
  timestamp: string;
};
```

Now that we have a shared interface ready, we can move on to the backend.

## The Server (part 1)

As we know from the Deno docs, the simplest way of creating a server is by
using the higher-level helper that is built in. Create a `server.ts` file and
add this to it.

```ts
Deno.serve({ port: 8000 }, (req) => {});
```

Now that the server is ready, we can add the WebSocket server integration. To do this, we use the built-in [upgradeWebSocket](https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket) to initiate the socket and create a response. Change the server to the following.

```ts
Deno.serve({ port: 8000 }, (req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  return response;
});
```

Voilà! The WebSocket server is initiated! Ok, but we won't be able to do much with only this. For the socket connection to be properly configured, we need to handle a couple of different events (you can see details for the events [here](https://developer.mozilla.org/docs/Web/API/WebSocket#events)):

- [open](https://developer.mozilla.org/docs/Web/API/WebSocket/open_event): Is fired when the connection between a client and a server is opened.
- [message](https://developer.mozilla.org/docs/Web/API/WebSocket/message_event): Is fired when the client or server sends a message.
- [close](https://developer.mozilla.org/docs/Web/API/WebSocket/close_event): Is fired when the connection is closed.
- [error](https://developer.mozilla.org/docs/Web/API/WebSocket/error_event): Is fired when the connection is closed due to an error.

> To add the event handlers, you can either use the `socket.addEventListener` function, or use the property `on[messageType]`. We will go for the second option.

In addition, to add the event handlers, we also need to track the participants and messages. For this purpose, we can either use an `Array` or a `Map`. I prefer a `Map` for participants and `Array` for the messages, so alter our `server.ts` file as follows.

```ts
import { Message } from "./shared.ts";

const messages: Message[] = [];
const participants = new Map<number, WebSocket>();
let participantId = 1;

Deno.serve({ port: 8000 }, (req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  const socketId = participantId++;

  socket.onopen = () => {
    participants.set(socketId, socket);
    console.log(`Participant ${socketId} has entered. Current participants: ${participants.size}`);
  };

  socket.onmessage = (e) => {
    console.log(`Message received from participant ${socketId}:`, e.data);
  };

  socket.onclose = () => {
    participants.delete(socketId);
    console.log(`Participant ${socketId} has left. Current participants: ${participants.size}`);
  };

  socket.onerror = (e) => {
    participants.delete(socketId);
    console.error("WebSocket error:", e);
  };

  return response;
});
```

## The Client (part 1)

Now that we have a basic setup for our server, we can move on to the client. For this, it is going to be a pretty straightforward React application.

Since we need to bundle for the web, start by adding a Deno config file `deno.client.jsonc`. This will ensure that Deno will use the correct typings when transpiling TSX.

```json
{
  "compilerOptions": {
    "lib": ["dom", "esnext"]
  }
}
```

Let's move on to the actual code. As always, start with this minimal codebase for our `index.html`.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="app"></div>
    <script type="module" src="client.js"></script>
  </body>
</html>
```

We can then create a `client.tsx` file and add the following. This is a minimal setup for connecting to a WebSocket server.

```tsx
import React, { useState, useEffect, FC } from "https://esm.sh/react@17";
import ReactDOM from "https://esm.sh/react-dom@17";
import { Message } from "./shared.ts";

const App: FC = () => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000");
    socket.current.onopen = () => {
      console.log("Open");
    };
    socket.current.onmessage = (m) => {
      console.log("Message:", m.data);
    };
    socket.current.onclose = () => {
      console.log("Disconnected");
    };
    socket.current.onerror = (e) => {
      console.error("Error:", e);
    };

    const currentSocket = socket.current;

    return () => {
      currentSocket.close();
    };
  }, []);

  return <></>;
};

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
```

Exciting, no? Now lastly before we try it out, we can add the following to a `Makefile`.

```makefile
serve_server:
    deno run --watch --allow-net server.ts
watch_client:
    deno bundle --watch --config deno.client.jsonc client.tsx client.js
bundle_client:
    deno bundle --config deno.client.jsonc client.tsx client.js
serve_client:
    deno run --allow-net --allow-read https://jsr.io/@std/http/file-server .
dev:
    make -j 3 serve_server serve_client watch_client
```

Run everything with `make dev`, and access the website on [http://localhost:4507](http://localhost:4507). If you now look into the console logs on both the server and the client-side, you should see something like this.

```text
# Server
HTTP server listening on http://localhost:4507/
Participant 1 has entered. Current participants: 1

# Client
Open
```

## Shared Types (part 2)

Once you have confirmed that the server and client both work and that the connection is established, we can move on to establishing an interface for the WebSocket messages. We can have two types of WS messages in our application:

- `backlog`: A message which should be sent from the server to the client as an initial message when the connection has been established. This message should contain the chat history.
- `message`: A message which is sent from a client to the rest of the chatroom.

In your `shared.ts` file, add a new interface to symbolize the above messages.

```ts
export type WsMessage =
  | {
      type: "backlog";
      messages: Message[];
    }
  | {
      type: "message";
      message: Message;
    };
```

## The Server (part 2)

Now that we have established a communication interface for the socket, we can start implementing the final parts of the server code. The only things we essentially have to adjust are the `open` and `message` handlers.

The `open` handler should send a message to the client with the chat history.

```ts
socket.onopen = () => {
  participants.set(socketId, socket);
  console.log(`Participant ${socketId} has entered. Current participants: ${participants.size}`);
  socket.send(JSON.stringify(<WsMessage>{ type: "backlog", messages }));
};
```

The `onmessage` handler should be altered to handle incoming messages, and as the server should never receive any other message, it makes it pretty straightforward.

```ts
socket.onmessage = (e) => {
  console.log(`Message received from participant ${socketId}:`, e.data);
  const msg: WsMessage = JSON.parse(e.data);
  if (msg.type === "message") {
    messages.push(msg.message);
    participants.delete(socketId);
    participants.forEach((ws) => {
      ws.send(e.data);
    });
  }
};
```

## The Client (part 2)

The changes to our client are somewhat larger than for our server, so let's dive into it. Firstly, we need to add a couple of helper functions:

- `appendMessages`: Should append a message to an array of messages.
- `sendMessage`: Should create and send a message to the server and also add the message to the local array of messages.

In addition to the helper methods, we also need to add a couple of `useState`s to house the data for the message.

```tsx
...

const App: FC = () => {
  const socket = useRef<WebSocket | null>(null);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const appendMessages = (msg: Message) => {
    setMessages((old) => [...old, msg]);
  };

  const sendMessage = () => {
    const msg: Message = {
      from: name,
      body: newMessage,
      timestamp: new Date().toISOString(),
    };
    setNewMessage("");
    appendMessages(msg);
    if (socket.current) {
      socket.current.send(JSON.stringify({ type: "message", message: msg }));
    }
  };

...
```

Our next step is to change the `onmessage` handler to deal with the two types of messages we can receive. For the `backlog`, we can simply overwrite the `messages` array, while for `message` we want to append it to the array.

```tsx
socket.current.onmessage = (m) => {
  console.log("Message:", m.data);
  const msg: WsMessage = JSON.parse(m.data);
  switch (msg.type) {
    case "backlog":
      setMessages(msg.messages);
      break;
    case "message":
      appendMessages(msg.message);
      break;
  }
};
```

Lastly, we need to update the HTML to allow for input. We need a name field, a message field, and finally also a chat log list. For this post, we won't focus on the visuals, but feel free to go on a UI rampage. In the end, your `client.tsx` file should look like this.

```tsx
import React, { useState, useEffect, useRef, FC } from "https://esm.sh/react@17";
import ReactDOM from "https://esm.sh/react-dom@17";
import { Message, WsMessage } from "./shared.ts";

const App: FC = () => {
  const socket = useRef<WebSocket | null>(null);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const appendMessages = (msg: Message) => {
    setMessages((old) => [...old, msg]);
  };

  const sendMessage = () => {
    const msg: Message = {
      from: name,
      body: newMessage,
      timestamp: new Date().toISOString(),
    };
    setNewMessage("");
    appendMessages(msg);
    if (socket.current) {
      socket.current.send(JSON.stringify({ type: "message", message: msg }));
    }
  };

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000");
    socket.current.onopen = () => {
      console.log("Open");
    };
    socket.current.onmessage = (m) => {
      console.log("Message:", m.data);
      const msg: WsMessage = JSON.parse(m.data);
      switch (msg.type) {
        case "backlog":
          setMessages(msg.messages);
          break;
        case "message":
          appendMessages(msg.message);
          break;
      }
    };
    socket.current.onclose = () => {
      console.log("Disconnected");
    };
    socket.current.onerror = (e) => {
      console.error("Error:", e);
    };

    const currentSocket = socket.current;

    return () => {
      currentSocket.close();
    };
  }, []);

  return (
    <>
      <p>Name</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <hr />
      <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={() => sendMessage()}>Send</button>
      <div>
        {messages.map((msg) => (
          <p>
            <small>
              {msg.timestamp} / <b>{msg.from}</b>
            </small>
            : {msg.body}
          </p>
        ))}
      </div>
    </>
  );
};

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
```

If you now run `make dev` again, you should be able to open two tabs and send messages between the tabs. Try it out for yourself!

Congratulations on completing this post, and thank you for tagging along! I'll see you around!
