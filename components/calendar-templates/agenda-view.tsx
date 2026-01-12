"use client"

import type { CalendarEvent, MonthSettings } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AgendaViewProps {
  currentDate: Date
  events: CalendarEvent[]
  monthSettings: MonthSettings
  onEventClick: (event: CalendarEvent) => void
}

export function AgendaView({ currentDate, events, monthSettings, onEventClick }: AgendaViewProps) {
  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime()
    if (dateCompare !== 0) return dateCompare
    return (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
  })

  // Group by date
  const groupedEvents = sortedEvents.reduce(
    (acc, event) => {
      const key = event.date.toLocaleDateString()
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      return acc
    },
    {} as Record<string, CalendarEvent[]>,
  )

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
      <div className="divide-y divide-border/50">
        {Object.entries(groupedEvents).length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No events scheduled</div>
        ) : (
          Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
            <div key={dateKey} className="p-4 border-b border-border/50 last:border-b-0">
              <div className="font-semibold mb-3 text-sm opacity-75">{dateKey}</div>
              <div className="space-y-2">
                {dateEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="p-3 rounded border border-border/50 cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                          <div className="font-semibold text-sm">{event.title}</div>
                        </div>
                        {event.startTime && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </div>
                        )}
                        {event.description && (
                          <div className="text-xs text-muted-foreground mt-1">{event.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
