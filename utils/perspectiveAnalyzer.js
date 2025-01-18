const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function getPerspectives(article, perspectiveType) {
    try {
        const perspectivePrompts = {
            student: "from a student's viewpoint, considering academic implications and youth perspective",
            researcher: "from a researcher's analytical viewpoint, focusing on methodology and evidence",
            expert: "from an expert's professional viewpoint, considering industry implications",
            general: "from a general adult's everyday perspective, focusing on practical implications"
        };

        const prompt = `
        Analyze this news article and provide an alternative perspective ${perspectivePrompts[perspectiveType]}:
        Title: ${article.title}
        Description: ${article.description}

        Rules:
        1. Don't change the facts of the story
        2. Present a different but valid viewpoint on the same events
        3. Be objective and balanced
        4. If there's no meaningful alternative perspective, return "No alternative perspective available"

        Provide the alternative perspective in a concise paragraph.
        `;

        const response = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            inputs: prompt,
            parameters: {
                max_new_tokens: 250,
                temperature: 0.7,
                return_full_text: false,
            }
        });

        return {
            alternative: response.generated_text.trim() || null
        };
    } catch (error) {
        console.error('Error generating perspective:', error);
        return { alternative: null };
    }
}

module.exports = { getPerspectives };
