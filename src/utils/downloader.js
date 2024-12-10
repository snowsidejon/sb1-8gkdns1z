import ytdl from 'ytdl-core';
import { exec } from 'child_process';
import path from 'path';

export async function downloadMP3(url, downloadsDir) {
    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');
    const outputPath = path.join(downloadsDir, `${title}.mp3`);
    
    return new Promise((resolve, reject) => {
        const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" ${url}`;
        
        exec(command, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({
                downloadLink: `/downloads/${title}.mp3`,
                filename: `${title}.mp3`
            });
        });
    });
}

export async function downloadMP4(url, quality, downloadsDir) {
    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');
    const outputPath = path.join(downloadsDir, `${title}.mp4`);
    
    return new Promise((resolve, reject) => {
        const command = `yt-dlp -f "bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]" -o "${outputPath}" ${url}`;
        
        exec(command, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({
                downloadLink: `/downloads/${title}.mp4`,
                filename: `${title}.mp4`
            });
        });
    });
}