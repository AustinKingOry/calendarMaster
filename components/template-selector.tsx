"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CalendarTemplate } from "@/lib/types"
import { Grid3x3, Calendar, List, Clock, LayoutGrid } from "lucide-react"

interface TemplateSelectorProps {
  onSelect: (templateId: CalendarTemplate) => void
}

const TEMPLATES: Array<{
  id: CalendarTemplate
  name: string
  description: string
  icon: React.ReactNode
}> = [
  {
    id: "monthly",
    name: "Monthly Grid",
    description: "Traditional month view with all days in a grid layout",
    icon: <Grid3x3 className="w-8 h-8" />,
  },
  {
    id: "weekly",
    name: "Weekly View",
    description: "Detailed week layout with hourly time slots",
    icon: <Calendar className="w-8 h-8" />,
  },
  {
    id: "agenda",
    name: "Agenda List",
    description: "Chronological list of all upcoming events",
    icon: <List className="w-8 h-8" />,
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Visual timeline of events throughout the month",
    icon: <Clock className="w-8 h-8" />,
  },
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Events organized by date categories",
    icon: <LayoutGrid className="w-8 h-8" />,
  },
]

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose a Calendar Template</h2>
        <p className="text-muted-foreground">Select a design theme for your calendar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-xs">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col">
              <div className="flex-1 flex items-center justify-center p-6 bg-muted rounded-md text-muted-foreground">
                {template.icon}
              </div>
              <Button onClick={() => onSelect(template.id)} className="w-full">
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
