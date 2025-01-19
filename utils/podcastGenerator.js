import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function generatePodcastScript(article, perspective, language = 'en') {
    try {
        console.log('Starting podcast script generation...');
        
        let prompt;
        if (language === 'fr') {
            prompt = `
            Créez un script de podcast engageant qui discute de cet article d'actualité et de cette perspective:

            Titre: ${article.title}
            Contenu: ${article.description}
            Perspective Alternative: ${perspective}

            Format du script (gardez exactement ces indicateurs de dialogue):
            Alex: [Introduction en français]
            Jordan: [Présentation des faits principaux]
            Alex: [Discussion de la perspective]
            Jordan: [Analyse supplémentaire]
            Alex: [Conclusion]

            Assurez-vous que chaque ligne commence par "Alex:" ou "Jordan:" pour indiquer qui parle.
            Gardez un ton naturel et conversationnel en français.`;
        } else {
            prompt = `
            Create an engaging podcast script discussing this news article and perspective:

            News Title: ${article.title}
            News Content: ${article.description}
            Alternative Perspective: ${perspective}

            Format the script EXACTLY as shown below:
            Alex: [Introduction]
            Jordan: [Main story coverage]
            Alex: [Discussion of perspective]
            Jordan: [Additional insights]
            Alex: [Concluding thoughts]

            Make sure each line starts with either "Alex:" or "Jordan:" to clearly indicate who is speaking.
            Keep it natural and conversational.`;
        }

        const response = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            inputs: prompt,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
                return_full_text: false,
            }
        });

        console.log(`Script generated in ${language}`);
        return response.generated_text;
    } catch (error) {
        console.error('Error in generatePodcastScript:', error);
        return null;
    }
}

export { generatePodcastScript };
