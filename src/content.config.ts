import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    summary: z.string().optional(),
    codeFolderLink: z.string().optional(),
    disabled: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    url: z.string().optional(),
    description: z.string(),
    icon: z.string(),
    iconColor: z.string().optional(),
    featured: z.boolean().default(false),
    githubStars: z.boolean().default(false),
    disabled: z.boolean().default(false),
  }),
});

export const collections = { blog, work };
