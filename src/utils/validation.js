import ytdl from 'ytdl-core';

export function isValidYouTubeUrl(url) {
    try {
        return ytdl.validateURL(url);
    } catch (error) {
        return false;
    }
}