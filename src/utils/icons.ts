import {
  IconArchive,
  IconBook,
  IconDatabaseCog,
  IconDatabaseEdit,
  IconDatabaseStar,
  IconDeviceAnalytics,
  IconFileInvoice,
  IconLabel,
  IconMessage2Ai,
  IconNotebook,
  IconPigMoney,
  IconRobot,
  IconStack2,
  IconTool,
  IconVocabulary,
  IconWorldWww,
} from "@tabler/icons-astro";

// Icon names as used in the frontmatter of src/content/work
const ICONS = {
  archive: IconArchive,
  book: IconBook,
  "database-cog": IconDatabaseCog,
  "database-edit": IconDatabaseEdit,
  "database-star": IconDatabaseStar,
  "device-analytics": IconDeviceAnalytics,
  "file-invoice": IconFileInvoice,
  label: IconLabel,
  "message-2-ai": IconMessage2Ai,
  "note-book": IconNotebook,
  "pig-money": IconPigMoney,
  robot: IconRobot,
  "stack-2": IconStack2,
  tool: IconTool,
  vocabulary: IconVocabulary,
  "world-www": IconWorldWww,
};

export type IconComponent = (typeof ICONS)[keyof typeof ICONS];

export function getIcon(name: string): IconComponent {
  const icon = (ICONS as Record<string, IconComponent>)[name];
  if (!icon) throw new Error(`Icon for ${name} is not mapped`);
  return icon;
}
