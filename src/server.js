import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';
import { isValidYouTubeUrl } from './utils/validation.js';
import { downloadMP3, downloadMP4 } from './utils/downloader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/downloads', express.static('downloads'));

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, '../downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

app.post('/download', async (req, res) => {
    const { url, format, quality } = req.body;
    
    if (!isValidYouTubeUrl(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    try {
        let result;
        if (format === 'mp3') {
            result = await downloadMP3(url, downloadsDir);
        } else if (format === 'mp4') {
            result = await downloadMP4(url, quality, downloadsDir);
        } else {
            return res.status(400).json({ error: 'Invalid format specified' });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});