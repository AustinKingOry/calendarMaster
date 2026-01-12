"use client"

import type React from "react"
import type { MonthSettings } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface ThemeSelectorProps {
  settings: MonthSettings
  onSettingsChange: (settings: MonthSettings) => void
}

const themes = [
  { id: "light", name: "Light", description: "Clean light background" },
  { id: "dark", name: "Dark", description: "Dark mode theme" },
  { id: "ocean", name: "Ocean", description: "Blue ocean theme" },
  { id: "forest", name: "Forest", description: "Green forest theme" },
  { id: "sunset", name: "Sunset", description: "Orange sunset theme" },
]

export function ThemeSelector({ settings, onSettingsChange }: ThemeSelectorProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      onSettingsChange({
        ...settings,
        backgroundImage: imageUrl,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Calendar Theme</Label>
        <Select
          value={settings.theme}
          onValueChange={(value) =>
            onSettingsChange({
              ...settings,
              theme: value as MonthSettings["theme"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {themes.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                <div>
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-xs text-muted-foreground">{theme.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Background Image</Label>
        <div className="relative">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" id="image-upload" />
          <label htmlFor="image-upload" asChild>
            <Button variant="outline" className="w-full cursor-pointer bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Upload Background
            </Button>
          </label>
        </div>
      </div>

      {settings.backgroundImage && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onSettingsChange({
              ...settings,
              backgroundImage: undefined,
            })
          }
        >
          Remove Background
        </Button>
      )}
    </div>
  )
}
