// utils/audioGenerator.js
const axios = require('axios');

async function convertToAudio(podcastScript) {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://api.speechify.com/api/v1/convert',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SPEECHIFY_API_KEY}`
            },
            data: {
                text: podcastScript,
                voice: 'alex', // Use Alex voice for first host
                speed: 1.0,
                format: 'mp3'
            }
        });

        return response.data.audioUrl;
    } catch (error) {
        console.error('Error converting to audio:', error);
        return null;
    }
}

module.exports = { convertToAudio };
