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

    const browser = await getBrowser()

    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 })

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

    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
    })

    await browser.close()

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=calendar.pdf",
      },
    })
  } catch (error) {
    console.error("PDF export error:", error)
    return NextResponse.json({ error: "Failed to export PDF" }, { status: 500 })
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
