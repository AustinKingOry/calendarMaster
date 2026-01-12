"use client"

import type { CalendarEvent, MonthSettings } from "@/lib/types"
import { getEventsForDate } from "@/lib/calendar-utils"
import { cn } from "@/lib/utils"

interface WeeklyViewProps {
  currentDate: Date
  events: CalendarEvent[]
  monthSettings: MonthSettings
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export function WeeklyView({
  currentDate,
  events,
  monthSettings,
  selectedDate,
  onDateSelect,
  onEventClick,
}: WeeklyViewProps) {
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate)
  const day = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - day)

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + i)
    return date
  })

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
      {/* Week Header */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 border-b border-border/50">
        <div className="p-3 text-center font-semibold text-xs bg-muted"></div>
        {weekDates.map((date, i) => (
          <div
            key={i}
            className="p-3 text-center border-r border-border/50 last:border-r-0 cursor-pointer hover:bg-accent/20"
            onClick={() => onDateSelect(date)}
          >
            <div className="font-semibold text-sm">{weekDays[date.getDay()]}</div>
            <div className="text-xs text-muted-foreground">{date.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="max-h-96 overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 border-b border-border/30 min-h-12">
            <div className="p-2 text-xs font-semibold text-muted-foreground text-center border-r border-border/50">
              {hour}:00
            </div>
            {weekDates.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(events, date)
              const hourEvents = dayEvents.filter((e) => {
                if (!e.startTime) return false
                const [h] = e.startTime.split(":").map(Number)
                return h === hour
              })

              return (
                <div key={`${dayIndex}-${hour}`} className="border-r border-border/30 last:border-r-0 p-1 space-y-1">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: event.color, color: "white" }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
