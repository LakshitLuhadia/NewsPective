import { HfInference } from '@huggingface/inference';
import { translateToFrench } from './translate.js';
import dotenv from 'dotenv';
dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function getPerspectives(article, perspectiveType, language = 'en') {
    try {
        const prompt = `
        Analyze this news article from a ${perspectiveType} perspective:

        Title: ${article.title}
        Content: ${article.description}

        Instructions:
        1. Write your analysis ONLY in English
        2. Provide a detailed alternative perspective
        3. Consider implications, causes, and potential consequences
        4. Humanize your response
        5. Maintain a professional and objective tone`;

        const response = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            inputs: prompt,
            parameters: {
                max_new_tokens: 300,
                temperature: 0.7,
                top_p: 0.9,
                return_full_text: false,
            }
        });

        let cleanedResponse = response.generated_text.replace(/^[-\s]+/, '').trim();

        if (language === 'fr') {
            console.log('Translating perspective to French...');
            cleanedResponse = await translateToFrench(cleanedResponse);
            console.log('Translation completed');
        }

        return {
            alternative: cleanedResponse
        };
    } catch (error) {
        console.error('Error in getPerspectives:', error);
        return null;
    }
}

export { getPerspectives };
