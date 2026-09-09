#!/usr/bin/env node
/**
 * Render a Castalia slide deck (HTML using slides/theme.css) to a beautiful, print-perfect PDF —
 * one .slide per page, backgrounds and fonts preserved. Uses the pre-installed Chromium.
 *
 * Usage: node automation/build-slides-pdf.mjs <input.html> [output.pdf]
 */
import { chromium } from 'playwright-core'
import path from 'node:path'

const input = process.argv[2]
if (!input) { console.error('usage: build-slides-pdf.mjs <input.html> [output.pdf]'); process.exit(1) }
const abs = path.resolve(input)
const out = process.argv[3] ?? abs.replace(/\.html?$/i, '.pdf')

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.goto('file://' + abs, { waitUntil: 'networkidle', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)
await page.pdf({ path: out, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true })
await browser.close()
console.log('wrote', out)
