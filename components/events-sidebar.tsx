"use client"
import type { CalendarEvent } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"

interface EventsSidebarProps {
  events: CalendarEvent[]
  maxEvents?: number
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function EventsSidebar({ events, maxEvents = 10, onEdit, onDelete }: EventsSidebarProps) {
  const displayEvents = events.slice(0, maxEvents)

  return (
    <div className="w-full md:w-80 bg-card border-l border-border/50 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border/50 bg-muted/50">
        <h3 className="font-semibold text-lg">Our Events</h3>
        <p className="text-sm text-muted-foreground">
          {events.length} event{events.length !== 1 ? "s" : ""} this month
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayEvents.length > 0 ? (
          <div className="divide-y divide-border/50">
            {displayEvents.map((event) => (
              <div key={event.id} className="p-3 hover:bg-muted/50 transition-colors group">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                      <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                    </div>
                    {event.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.date.toLocaleDateString()}
                      {event.startTime && ` at ${event.startTime}`}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(event)} className="h-7 w-7 p-0">
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(event.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">No events this month</p>
          </div>
        )}
      </div>

      {events.length > maxEvents && (
        <div className="p-3 border-t border-border/50 bg-muted/30 text-center text-xs text-muted-foreground">
          +{events.length - maxEvents} more event{events.length - maxEvents !== 1 ? "s" : ""} not shown
        </div>
      )}
    </div>
  )
}
