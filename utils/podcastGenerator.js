const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generatePodcastScript(article, perspective) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `Generate an engaging podcast script discussing this news article and perspective:
        
        News Title: ${article.title}
        News Content: ${article.description}
        Alternative Perspective: ${perspective}
        
        Format as a natural conversation between two hosts named Alex and Jordan.
        Include:
        1. Engaging introduction
        2. Discussion of main story points
        3. Analysis of the alternative perspective
        4. Concluding thoughts
        
        Make it conversational and natural, avoiding any artificial or robotic language.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating podcast script:', error);
        return null;
    }
}

module.exports = { generatePodcastScript };
