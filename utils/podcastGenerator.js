// const { HfInference } = require('@huggingface/inference');
// require('dotenv').config();

// async function generatePodcastScript(article, perspective) {
//     try {
//         const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
        
//         const prompt = `
//         Create an engaging podcast script discussing this news article and perspective:

//         News Title: ${article.title}
//         News Content: ${article.description}
//         Alternative Perspective: ${perspective}

//         Format the script as a small natural conversation between two hosts named Alex and Jordan:
//         1. Brief introduction by Alex
//         2. Main story coverage by Jordan
//         3. Discussion of the alternative perspective
//         4. Concluding thoughts from both hosts

//         Make it conversational, engaging, and natural. Avoid any artificial language.
//         `;

//         const response = await hf.textGeneration({
//             model: "mistralai/Mistral-7B-Instruct-v0.2",
//             inputs: prompt,
//             parameters: {
//                 max_new_tokens: 200,
//                 temperature: 0.7,
//                 return_full_text: false,
//             }
//         });

//         return response.generated_text;
//     } catch (error) {
//         console.error('Error generating podcast script:', error);
//         return null;
//     }
// }

// module.exports = { generatePodcastScript };


const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function generatePodcastScript(article, perspective) {
    try {
        console.log('Starting podcast script generation...');
        
        const prompt = `
        Create an engaging podcast script discussing this news article and perspective:

        News Title: ${article.title}
        News Content: ${article.description}
        Alternative Perspective: ${perspective}

        Format the script EXACTLY as shown below, with clear speaker labels:
        Alex: [Introduction]
        Jordan: [Main story coverage]
        Alex: [Discussion of perspective]
        Jordan: [Additional insights]
        Alex: [Concluding thoughts]

        Make sure each line starts with either "Alex:" or "Jordan:" to clearly indicate who is speaking.
        Keep it natural and conversational.`;

        const response = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            inputs: prompt,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                return_full_text: false,
            }
        });

        console.log('Script generation completed');
        return response.generated_text;
    } catch (error) {
        console.error('Error in generatePodcastScript:', error);
        return null;
    }
}

module.exports = { generatePodcastScript };
