import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function getBrowser() {
    try {
        const isLocal = !process.env.AWS_REGION && !process.env.VERCEL
    
        if (isLocal) {
            // Local: use full puppeteer
            const localPuppeteer = await import('puppeteer')
            return await localPuppeteer.launch({ 
                headless: true
            })
        }
    
        // Serverless: use puppeteer-core + chromium
        return await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        })
        
    } catch (error) {
        console.error('Error launching browser:', error)
        throw error        
    }
}