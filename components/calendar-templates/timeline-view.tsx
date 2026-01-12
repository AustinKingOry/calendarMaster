"use client"

import type { CalendarEvent, MonthSettings } from "@/lib/types"
import { getEventsForDate } from "@/lib/calendar-utils"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  currentDate: Date
  events: CalendarEvent[]
  monthSettings: MonthSettings
  onEventClick: (event: CalendarEvent) => void
}

export function TimelineView({ currentDate, events, monthSettings, onEventClick }: TimelineViewProps) {
  const monthEvents = events.filter(
    (e) => e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear(),
  )

  // Get unique dates with events
  const datesWithEvents = Array.from(new Set(monthEvents.map((e) => e.date.toLocaleDateString())))
    .map((dateStr) => {
      const [month, day, year] = dateStr.split("/")
      return new Date(Number(year), Number(month) - 1, Number(day))
    })
    .sort((a, b) => a.getTime() - b.getTime())

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
      <div className="p-6">
        <div className="space-y-8">
          {datesWithEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No events this month</div>
          ) : (
            datesWithEvents.map((date, idx) => {
              const dateEvents = getEventsForDate(monthEvents, date)
              return (
                <div key={date.toISOString()} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-background" />
                    {idx !== datesWithEvents.length - 1 && (
                      <div className="w-1 bg-border/30 flex-1 my-2" style={{ height: "60px" }} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-semibold mb-2">
                      {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </div>
                    <div className="space-y-2">
                      {dateEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className="p-3 rounded border-l-4 bg-card/50 cursor-pointer hover:bg-accent/50 transition-colors"
                          style={{ borderLeftColor: event.color }}
                        >
                          <div className="font-semibold text-sm">{event.title}</div>
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
                      ))}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
