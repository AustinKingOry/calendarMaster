export async function exportCalendarAsImage(elementId: string): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) return

  const html = element.outerHTML

  try {
    const response = await fetch("/api/export/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html }),
    })

    if (!response.ok) throw new Error("Export failed")

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `calendar-${new Date().toISOString().split("T")[0]}.png`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Image export error:", error)
    alert("Failed to export calendar as image")
  }
}

export async function exportCalendarAsPDF(elementId: string): Promise<void> {
  const serverless_url =  process.env.NEXT_PUBLIC_PUPPETEER_SERVERLESS_URL ? `${process.env.NEXT_PUBLIC_PUPPETEER_SERVERLESS_URL}/api/builder` : "/api/export/pdf";
  console.log("Serverless URL:",serverless_url);
  const element = document.getElementById(elementId)
  if (!element) return

  const html = element.outerHTML

  try {
    const response = await fetch(serverless_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html, name:`calendar-${new Date().toISOString().split("T")[0]}.pdf` }),
    })

    if (!response.ok) throw new Error("Export failed")

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `calendar-${new Date().toISOString().split("T")[0]}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("PDF export error:", error)
    alert("Failed to export calendar as PDF")
  }
}
