import type { TemplateConfig } from "./types"

export const CALENDAR_TEMPLATES: TemplateConfig[] = [
  {
    id: "monthly",
    name: "Monthly Grid",
    description: "Traditional month view with all days in a grid",
    icon: "grid",
  },
  {
    id: "weekly",
    name: "Weekly View",
    description: "See 7 days in a detailed week layout",
    icon: "calendar",
  },
  {
    id: "agenda",
    name: "Agenda List",
    description: "Chronological list of upcoming events",
    icon: "list",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Visual timeline of events throughout the day",
    icon: "clock",
  },
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Events organized by date categories",
    icon: "layout-grid",
  },
]
