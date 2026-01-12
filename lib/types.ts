export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  color: string
  startTime?: string
  endTime?: string
}

export interface MonthSettings {
  backgroundImage?: string
  backgroundOpacity?: number
  theme: "light" | "dark" | "ocean" | "forest" | "sunset"
}

export type LayoutMode = "landscape" | "portrait"

export type CalendarTemplate = "monthly" | "weekly" | "agenda" | "timeline" | "kanban"

export interface TemplateConfig {
  id: CalendarTemplate
  name: string
  description: string
  icon: string
}
