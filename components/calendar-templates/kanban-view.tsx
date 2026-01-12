"use client"

import type { CalendarEvent, MonthSettings } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KanbanViewProps {
  currentDate: Date
  events: CalendarEvent[]
  monthSettings: MonthSettings
  onEventClick: (event: CalendarEvent) => void
}

export function KanbanView({ currentDate, events, monthSettings, onEventClick }: KanbanViewProps) {
  const categories = [
    { label: "Past", isAfter: (d: Date) => d < new Date() && d.toDateString() !== new Date().toDateString() },
    { label: "Today", isAfter: (d: Date) => d.toDateString() === new Date().toDateString() },
    {
      label: "This Week",
      isAfter: (d: Date) => {
        const today = new Date()
        const weekEnd = new Date(today)
        weekEnd.setDate(weekEnd.getDate() + (6 - today.getDay()))
        return d > today && d <= weekEnd
      },
    },
    {
      label: "Later",
      isAfter: (d: Date) =>
        d > new Date() &&
        d >
          (() => {
            const today = new Date()
            const weekEnd = new Date(today)
            weekEnd.setDate(weekEnd.getDate() + (6 - today.getDay()))
            return weekEnd
          })(),
    },
  ]

  const themeClasses: Record<string, string> = {
    light: "bg-white text-gray-900",
    dark: "bg-slate-900 text-white",
    ocean: "bg-blue-50 text-blue-900",
    forest: "bg-green-50 text-green-900",
    sunset: "bg-orange-50 text-orange-900",
  }

  return (
    <div
      className={cn("rounded-lg border border-border/50 overflow-hidden shadow-sm", themeClasses[monthSettings.theme])}
    >
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 gap-4 p-6 min-w-max">
          {categories.map((category) => {
            const categoryEvents = events.filter((e) => category.isAfter(e.date))
            return (
              <div key={category.label} className="w-80 flex flex-col">
                <div className="font-semibold text-sm mb-4 pb-2 border-b border-border/50">
                  {category.label} ({categoryEvents.length})
                </div>
                <div className="flex-1 space-y-3 min-h-96">
                  {categoryEvents.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-8">No events</div>
                  ) : (
                    categoryEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="p-3 rounded border border-border/50 cursor-pointer hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: event.color, borderLeftWidth: "4px" }}
                      >
                        <div className="font-semibold text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{event.date.toLocaleDateString()}</div>
                        {event.startTime && (
                          <div className="text-xs text-muted-foreground">
                            {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
