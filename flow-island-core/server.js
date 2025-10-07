
// 心流静岛 (Flow Island) Local Server v2.2.1 "Odyssey Binarized"
// ARCHITECTURE: UNIFIED Client-Side Rendering. This server is a "Dumb Pipe".
// Its sole responsibility is to receive a pre-rendered PNG from the Web UI,
// process it for hardware compatibility, cache it, and serve it to the Watchy device.
const express = require('express');
const path = require('path');
const os =require('os');
const sharp = require('sharp');

const app = express();
const port = 3000;

// This will hold the latest image data (as a binary Buffer) in memory
let latestImageData = null;

// --- Middleware ---
app.use(express.raw({ type: 'image/png', limit: '5mb' }));

// --- API Endpoints ---
app.use(express.static(__dirname)); 
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/env.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

app.post('/api/image', async (req, res) => {
    if (!req.body || req.body.length === 0) {
        return res.status(400).json({ success: false, message: 'No image data received.' });
    }
    try {
        const processedImageBuffer = await sharp(req.body)
            .flatten({ background: '#FFFFFF' }) // 1. Remove alpha channel.
            .threshold(128)                     // 2. Binarize image for crisp e-ink display.
            .png({ palette: false })            // 3. CRITICAL: Force non-paletted PNG for hardware compatibility.
            .toBuffer();
        latestImageData = processedImageBuffer;
        res.status(200).json({ success: true, message: 'Image received and cached.' });
    } catch (error) {
        console.error('Error processing image with sharp:', error);
        res.status(500).json({ success: false, message: 'Server failed to process image.' });
    }
});

app.get('/api/image', (req, res) => {
    if (latestImageData) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', latestImageData.length);
        res.send(latestImageData);
    } else {
        console.log('No image available for Watchy yet.');
        res.status(404).send('No image available. Please generate one via the Web UI.');
    }
});

function getLocalIpAddresses() {
    const addresses = [];
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    return addresses;
}

// --- Server Initialization ---
app.listen(port, () => {
    const ipAddresses = getLocalIpAddresses();
    if (!process.env.API_KEY) {
        console.warn('\n⚠️ WARNING: API_KEY is not set. The Web UI will need it for AI features.\n');
    }
    console.log('===================================================');
    console.log('  心流静岛 (Flow Island) Local Server Started');
    console.log(`  > Version: v2.2.1 (Binarized Output)`);
    console.log('---------------------------------------------------');
    console.log(`  > Web UI (on this computer):`);
    console.log(`    - http://localhost:${port}`);
    if (ipAddresses.length > 0) {
        console.log('  > Watchy Device (on same Wi-Fi):');
        ipAddresses.forEach(ip => console.log(`    - http://${ip}:${port}/api/image`));
    }
    console.log('===================================================');
    console.log('Keep this terminal window open...');
});