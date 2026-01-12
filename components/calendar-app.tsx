"use client"

import { useState, useEffect } from "react"
import type { CalendarEvent, LayoutMode, MonthSettings, CalendarTemplate } from "@/lib/types"
import { getMonthYear } from "@/lib/calendar-utils"
import { exportCalendarAsImage, exportCalendarAsPDF } from "@/lib/export-utils"
import { MonthlyView } from "./calendar-templates/monthly-view"
import { WeeklyView } from "./calendar-templates/weekly-view"
import { AgendaView } from "./calendar-templates/agenda-view"
import { TimelineView } from "./calendar-templates/timeline-view"
import { KanbanView } from "./calendar-templates/kanban-view"
import { EventsSidebar } from "./events-sidebar"
import { EventDialog } from "./event-dialog"
import { ThemeSelector } from "./theme-selector"
import { TemplateSelector } from "./template-selector"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus, Download, ImageIcon, LayoutGrid, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const defaultMonthSettings: MonthSettings = {
  theme: "light",
  backgroundOpacity: 0.95,
}

export function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [monthSettings, setMonthSettings] = useState<Record<string, MonthSettings>>({})
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("landscape")
  const [calendarTemplate, setCalendarTemplate] = useState<CalendarTemplate>("monthly")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent>()
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events")
    const savedSettings = localStorage.getItem("calendar-settings")
    const savedLayout = localStorage.getItem("calendar-layout")
    const savedTemplate = localStorage.getItem("calendar-template")
    const hasSeenApp = localStorage.getItem("calendar-app-initialized")

    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents)
      setEvents(
        parsedEvents.map((e: any) => ({
          ...e,
          date: new Date(e.date),
        })),
      )
    }

    if (savedSettings) setMonthSettings(JSON.parse(savedSettings))
    if (savedLayout) setLayoutMode(JSON.parse(savedLayout))
    if (savedTemplate) setCalendarTemplate(JSON.parse(savedTemplate))

    if (!hasSeenApp) {
      setShowTemplateSelector(true)
      localStorage.setItem("calendar-app-initialized", "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem("calendar-settings", JSON.stringify(monthSettings))
  }, [monthSettings])

  useEffect(() => {
    localStorage.setItem("calendar-layout", JSON.stringify(layoutMode))
  }, [layoutMode])

  useEffect(() => {
    localStorage.setItem("calendar-template", JSON.stringify(calendarTemplate))
  }, [calendarTemplate])

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`
  const currentMonthSettings = monthSettings[monthKey] || defaultMonthSettings
  const monthEvents = events.filter(
    (event) =>
      event.date.getMonth() === currentDate.getMonth() && event.date.getFullYear() === currentDate.getFullYear(),
  )

  const handleAddEvent = () => {
    setEditingEvent(undefined)
    setSelectedDate(undefined)
    setDialogOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setDialogOpen(true)
  }

  const handleSaveEvent = (event: CalendarEvent) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)))
    } else {
      setEvents([...events, event])
    }
    setEditingEvent(undefined)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId))
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleExportImage = async () => {
    await exportCalendarAsImage("calendar-export")
  }

  const handleExportPDF = async () => {
    await exportCalendarAsPDF("calendar-export")
  }

  const handleSelectTemplate = (templateId: CalendarTemplate) => {
    setCalendarTemplate(templateId)
    setShowTemplateSelector(false)
  }

  const renderCalendarView = () => {
    const commonProps = {
      currentDate,
      events: monthEvents,
      monthSettings: currentMonthSettings,
      onEventClick: handleEditEvent,
    }

    switch (calendarTemplate) {
      case "weekly":
        return <WeeklyView {...commonProps} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      case "agenda":
        return <AgendaView {...commonProps} />
      case "timeline":
        return <TimelineView {...commonProps} />
      case "kanban":
        return <KanbanView {...commonProps} />
      case "monthly":
      default:
        return <MonthlyView {...commonProps} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{getMonthYear(currentDate)}</h1>
              <p className="text-sm text-muted-foreground">Manage your events and schedule</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-border/50" />

              <Button onClick={handleAddEvent}>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setLayoutMode(layoutMode === "landscape" ? "portrait" : "landscape")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowTemplateSelector(true)}
                title="Change calendar layout template"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Calendar Settings</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ThemeSelector
                      settings={currentMonthSettings}
                      onSettingsChange={(newSettings) => {
                        setMonthSettings({
                          ...monthSettings,
                          [monthKey]: newSettings,
                        })
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Export Calendar</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-3">
                    <Button onClick={handleExportImage} className="w-full">
                      Export as PNG
                    </Button>
                    <Button onClick={handleExportPDF} variant="outline" className="w-full bg-transparent">
                      Export as PDF
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          id="calendar-export"
          className={cn(
            "grid gap-6",
            calendarTemplate === "monthly" && layoutMode === "landscape" ? "md:grid-cols-[1fr_320px]" : "grid-cols-1",
          )}
        >
          {/* Calendar View */}
          <Card className="overflow-hidden">{renderCalendarView()}</Card>

          {/* Events Sidebar - Only show for monthly view in landscape mode */}
          {calendarTemplate === "monthly" && layoutMode === "landscape" && (
            <EventsSidebar events={monthEvents} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
          )}
        </div>

        {/* Portrait Layout - Events Bar */}
        {calendarTemplate === "monthly" && layoutMode === "portrait" && (
          <Card className="mt-6 overflow-hidden">
            <EventsSidebar events={monthEvents} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
          </Card>
        )}
      </div>

      {/* Event Dialog */}
      <EventDialog
        open={dialogOpen}
        event={editingEvent}
        selectedDate={selectedDate}
        onClose={() => {
          setDialogOpen(false)
          setEditingEvent(undefined)
        }}
        onSave={handleSaveEvent}
      />

      {/* Template Selector Sheet */}
      <Sheet open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Select Calendar Template</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <TemplateSelector onSelect={handleSelectTemplate} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
