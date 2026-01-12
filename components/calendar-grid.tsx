"use client"
import type { CalendarEvent, MonthSettings } from "@/lib/types"
import { getDaysInMonth, getFirstDayOfMonth, getEventsForDate } from "@/lib/calendar-utils"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  currentDate: Date
  events: CalendarEvent[]
  monthSettings: MonthSettings
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export function CalendarGrid({
  currentDate,
  events,
  monthSettings,
  selectedDate,
  onDateSelect,
  onEventClick,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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
      style={
        monthSettings.backgroundImage
          ? {
              backgroundImage: `url(${monthSettings.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: monthSettings.backgroundOpacity || 1,
            }
          : {}
      }
    >
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-0 border-b border-border/50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-4 text-center font-semibold text-sm border-r border-border/50 last:border-r-0 bg-opacity-90 backdrop-blur-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Empty cells */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="border-r border-b border-border/50 last:border-r-0" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const dayEvents = getEventsForDate(events, date)
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={day}
              onClick={() => onDateSelect(date)}
              className={cn(
                "min-h-32 border-r border-b border-border/50 last:border-r-0 p-2 cursor-pointer transition-colors hover:bg-accent/20",
                isSelected && "bg-primary/10",
                isToday && "bg-accent/30 font-bold",
              )}
            >
              <div className="text-sm font-semibold mb-1">{day}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: event.color, color: "white" }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
