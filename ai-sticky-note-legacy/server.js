
// AI-Watchy Local Server v5.1.0
const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const sharp = require('sharp');
const { createCanvas, registerFont } = require('canvas');
const ical = require('ical');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3000;

// --- Globals & Config ---
let latestImageData = null;
let calendarUrl = null;
let pollingInterval = null;
const CONFIG_FILE = path.join(__dirname, 'config.json');
const FONT_PATH = path.join(__dirname, 'PressStart2P-Regular.ttf');
let ai;

const LAYOUT = {
    W: 200, H: 200, PADDING: 10,
    TIME_Y: 12, DATE_Y: 48, MEMO_Y: 66,
    TIME_FONT: `28px "Press Start 2P"`,
    DATE_FONT: `10px "Press Start 2P"`,
    MEMO_FONT: `12px "SimSun", "NSimSun", "Heiti SC", "PingFang SC", "Microsoft YaHei", sans-serif`,
    MEMO_LINE_HEIGHT: 18,
    PROMPT_FONT: `12px "Press Start 2P"`,
};

// Register the pixel font for server-side rendering
try {
    registerFont(FONT_PATH, { family: 'Press Start 2P' });
} catch (e) {
    console.warn(`⚠️ Warning: Could not load font at ${FONT_PATH}. Text rendering might fail.`);
    console.warn(`   Ensure 'PressStart2P-Regular.ttf' is in the same directory as server.js.`);
}


async function generateImageBuffer(memoText = "") {
    const canvas = createCanvas(LAYOUT.W, LAYOUT.H);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, LAYOUT.W, LAYOUT.H);
    
    // Draw text
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hour}:${minute}`;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayStr = days[now.getDay()];
    const dateNumStr = String(now.getDate()).padStart(2, '0');
    const monthStr = months[now.getMonth()];
    const dateStr = `${dayStr} ${dateNumStr} ${monthStr}`;

    ctx.font = LAYOUT.TIME_FONT;
    ctx.textBaseline = 'top';
    ctx.fillText(timeStr, LAYOUT.W / 2, LAYOUT.TIME_Y);

    ctx.font = LAYOUT.DATE_FONT;
    ctx.fillText(dateStr, LAYOUT.W / 2, LAYOUT.DATE_Y);

    // --- Memo Drawing Logic ---
    ctx.font = LAYOUT.MEMO_FONT;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    if (memoText) {
        const textLines = memoText.split('\n');
        let processedLines = [];
        const maxLineWidth = LAYOUT.W - LAYOUT.PADDING * 2;

        textLines.forEach(line => {
            let currentLine = '';
            for (let i = 0; i < line.length; i++) {
                const testLine = currentLine + line[i];
                if (ctx.measureText(testLine).width > maxLineWidth) {
                    processedLines.push(currentLine);
                    currentLine = line[i];
                } else {
                    currentLine = testLine;
                }
            }
            processedLines.push(currentLine);
        });
        
        let y = LAYOUT.MEMO_Y + LAYOUT.PADDING;
        for (let i = 0; i < processedLines.length; i++) {
            if (y + LAYOUT.MEMO_LINE_HEIGHT > LAYOUT.H) break; 
            ctx.fillText(processedLines[i], LAYOUT.PADDING, y);
            y += LAYOUT.MEMO_LINE_HEIGHT;
        }
    } else {
         ctx.font = LAYOUT.PROMPT_FONT;
         ctx.fillText('C:\\>_', LAYOUT.PADDING, LAYOUT.MEMO_Y + LAYOUT.PADDING);
    }
    
    const pngBuffer = canvas.toBuffer('image/png');
    // Use sharp to ensure it's a 24-bit RGB PNG compatible with Watchy
    return sharp(pngBuffer)
        .flatten({ background: '#E0E0E0' })
        .png()
        .toBuffer();
}

// --- Middleware ---
app.use(express.raw({ type: 'image/png', limit: '5mb' }));
app.use(express.json()); // For handling JSON payloads like the calendar URL

// --- Routes ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/env.js', (req, res) => {
  res.type('application/javascript');
  res.send(`
    window.process = {
      env: {
        API_KEY: "${process.env.API_KEY || ''}"
      }
    };
  `);
});

// For browser to POST image from voice memo
app.post('/api/image', async (req, res) => {
    if (!req.body || req.body.length === 0) {
        return res.status(400).json({ success: false, message: 'No image data received.' });
    }
    try {
        latestImageData = await sharp(req.body)
            .flatten({ background: '#E0E0E0' })
            .png()
            .toBuffer();
        res.status(200).json({ success: true, message: 'Image received.' });
    } catch (error) {
        console.error('Error processing browser image:', error);
        res.status(500).json({ success: false, message: 'Server failed to process image.' });
    }
});

// For Watchy to GET the latest image
app.get('/api/image', (req, res) => {
    if (latestImageData) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', latestImageData.length);
        res.send(latestImageData);
    } else {
        console.log('No image available for Watchy yet.');
        res.status(404).send('No image available.');
    }
});

// For browser to POST calendar URL
app.post('/api/calendar', async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ success: false, message: 'Invalid URL provided.' });
    }
    try {
        await fs.writeFile(CONFIG_FILE, JSON.stringify({ calendarUrl: url }));
        calendarUrl = url;
        console.log('Calendar URL saved:', url);
        // Restart polling with the new URL
        stopCalendarPolling();
        startCalendarPolling();
        res.status(200).json({ success: true, message: 'Calendar URL saved.' });
    } catch (error) {
        console.error('Failed to save config file:', error);
        res.status(500).json({ success: false, message: 'Failed to save URL on server.' });
    }
});

// --- Calendar Polling Logic ---
async function pollCalendar() {
    if (!calendarUrl || !ai) return;

    try {
        const res = await fetch(calendarUrl);
        const icsData = await res.text();
        const events = ical.parseICS(icsData);
        
        const now = new Date();
        const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
        
        let upcomingEvent = null;

        for (const k in events) {
            if (events.hasOwnProperty(k)) {
                const event = events[k];
                if (event.type === 'VEVENT') {
                    const startDate = new Date(event.start);
                    // Check if the event starts within the next 30 minutes and hasn't ended yet
                    if (startDate > now && startDate < thirtyMinsFromNow) {
                        upcomingEvent = event;
                        break; 
                    }
                }
            }
        }

        if (upcomingEvent) {
            console.log(`Found upcoming event: "${upcomingEvent.summary}"`);
            
            const systemInstruction = `你是一个名为 "AI便利贴" 的AI助手，专为低功耗电子墨水屏手表服务。你的任务是将会话式的日历事件信息，转换为极其简洁、一目了然的提醒事项。你必须严格遵守以下规则：
1.  **输出语言**: 始终使用简体中文。
2.  **格式**: 必须遵循 \`<时间>: <核心主题>\` 格式。
3.  **简洁性**: 输出总长度严格限制在 15 个汉字以内。
4.  **无多余内容**: 绝对禁止返回任何解释、注释、JSON 或 Markdown 标记。只返回最终的提醒文本。`;

            const userPrompt = `请为我转换以下日历事件：

**事件标题**: ${upcomingEvent.summary}
**开始时间**: ${upcomingEvent.start.toLocaleString()}
**事件描述**: ${upcomingEvent.description || ''}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

            const summary = response.text.trim();
            if (summary) {
                console.log(`AI summary for event: "${summary}"`);
                latestImageData = await generateImageBuffer(summary);
                console.log(`Generated new image for upcoming event.`);
            }
        }
    } catch (error) {
        console.error('Error polling or processing calendar:', error);
    }
}

function startCalendarPolling() {
    if (calendarUrl && !pollingInterval) {
        console.log('Starting calendar polling every 15 minutes.');
        pollCalendar(); // Poll immediately on start
        pollingInterval = setInterval(pollCalendar, 15 * 60 * 1000);
    }
}

function stopCalendarPolling() {
    if (pollingInterval) {
        console.log('Stopping calendar polling.');
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

async function loadConfigAndStart() {
    try {
        if (process.env.API_KEY) {
            ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        } else {
             throw new Error("API_KEY not set.");
        }
        const data = await fs.readFile(CONFIG_FILE, 'utf-8');
        const config = JSON.parse(data);
        calendarUrl = config.calendarUrl;
        startCalendarPolling();
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No config file found. Calendar polling is disabled until a URL is saved.');
            // Create an empty one
            await fs.writeFile(CONFIG_FILE, JSON.stringify({}));
        } else if (error.message.includes("API_KEY")) {
             console.warn('\n***************************************************');
             console.warn('  ⚠️  WARNING: API_KEY environment variable not set.');
             console.warn('     AI functionality will be disabled. Check your start command.');
             console.warn('***************************************************\n');
        } 
        else {
            console.error('Failed to load config:', error);
        }
    }
    // Generate a default image on startup if none exists
    if (!latestImageData) {
        latestImageData = await generateImageBuffer();
    }
}


// --- Server Startup ---
function getLocalIpAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            const { address, family, internal } = iface;
            if (family === 'IPv4' && !internal) {
                addresses.push(address);
            }
        }
    }
    return addresses;
}

app.listen(port, async () => {
    await loadConfigAndStart();
    const ipAddresses = getLocalIpAddresses();
    console.log('===================================================');
    console.log('  AI Sticky Note Local Server Started');
    console.log(`  > Local Access (Recommended): http://localhost:${port}`);
    if (ipAddresses.length > 0) {
        console.log('  > LAN Access (Choose the correct one for your network):');
        ipAddresses.forEach(ip => {
            console.log(`    - http://${ip}:${port}`);
        });
        console.log(`  > Watchy Endpoint: Use one of the LAN IPs above, e.g., http://${ipAddresses[0]}:${port}/api/image`);
    } else {
        console.log('  > LAN Access: No network interfaces found.');
    }
    console.log('===================================================');
    console.log('Keep this terminal window open...');
});