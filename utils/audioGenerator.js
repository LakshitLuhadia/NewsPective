import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const voiceIds = {
    'fr': {
        'Alex': 'GBv7mTt0atIp3Br8iCZE',    // French male voice
        'Jordan': 'IKne3meq5aSn9XLyUdCD'    // French female voice
    },
    'en': {
        'Alex': 'pNInz6obpgDQGcFmaJgB',     // English male voice (Adam)
        'Jordan': 'ErXwobaYiN019PkySvjV'     // English female voice (Antoni)
    }
};

async function convertToAudio(script, language = 'en') {
    try {
        console.log(`Starting audio conversion in ${language}...`);
        
        const parts = script.split(/Alex:|Jordan:/).filter(Boolean);
        const audioChunks = [];

        for (let i = 0; i < parts.length; i++) {
            const text = parts[i].trim();
            const speaker = i % 2 === 0 ? 'Alex' : 'Jordan';
            const voiceId = voiceIds[language][speaker];

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
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                },
                responseType: 'arraybuffer'
            });

            audioChunks.push(response.data);
        }

        const combinedAudio = Buffer.concat(audioChunks);
        const audioBase64 = combinedAudio.toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        return audioUrl;
    } catch (error) {
        console.error('Error in audio conversion:', error);
        return null;
    }
}

export { convertToAudio };
