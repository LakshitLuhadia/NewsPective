const axios = require('axios');
require('dotenv').config();

async function convertToAudio(script) {
    try {
        console.log('Starting audio conversion with ElevenLabs...');
        
        // Split script into parts for different speakers
        const parts = script.split(/Alex:|Jordan:/).filter(Boolean);
        const audioChunks = [];

        // Voice IDs for different speakers
        const voices = {
            'Alex': 'pNInz6obpgDQGcFmaJgB', // Adam voice ID
            'Jordan': 'ErXwobaYiN019PkySvjV'  // Antoni voice ID
        };

        // Process each part of the script
        for (let i = 0; i < parts.length; i++) {
            const text = parts[i].trim();
            const speaker = i % 2 === 0 ? 'Alex' : 'Jordan';
            const voiceId = voices[speaker];

            const response = await axios({
                method: 'POST',
                url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY
                },
                data: {
                    text: text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                        style: 0.5,
                        use_speaker_boost: true
                    }
                },
                responseType: 'arraybuffer'
            });

            audioChunks.push(response.data);
        }

        // Combine all audio chunks
        const combinedAudio = Buffer.concat(audioChunks);
        const audioBase64 = combinedAudio.toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        console.log('Audio conversion completed');
        return audioUrl;
    } catch (error) {
        console.error('Error in audio conversion:', error);
        if (error.response) {
            console.error('ElevenLabs API response:', error.response.data);
        }
        return null;
    }
}

module.exports = { convertToAudio };
