import { type NextRequest, NextResponse } from "next/server"
import * as chromium from "@sparticuz/chromium"
import puppeteer from "puppeteer-core"
import { getBrowser } from "@/lib/browser"

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json()

    if (!html) {
      return NextResponse.json({ error: "HTML content is required" }, { status: 400 })
    }

    // Configure puppeteer with sparticuz chromium
    const browser = await getBrowser()

    const page = await browser.newPage()

    // Set viewport for landscape calendar
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 })

    // Create a complete HTML document with styles
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: white; }
            ${getCalendarStyles()}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `

    await page.setContent(fullHtml, { waitUntil: "networkidle0" })
    const screenshot = await page.screenshot({ type: "png", fullPage: true })

    await browser.close()

    return new NextResponse(screenshot, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=calendar.png",
      },
    })
  } catch (error) {
    console.error("Image export error:", error)
    return NextResponse.json({ error: "Failed to export image" }, { status: 500 })
  }
}

function getCalendarStyles(): string {
  return `
    .card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px; border: 1px solid #e5e7eb; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    .event { padding: 8px; margin: 4px 0; border-radius: 4px; font-size: 12px; }
  `
}
