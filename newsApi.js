import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function getNewsFromMultipleSources(language = 'en', category = '') {
    try {
        // Construct URL with category parameter
        const newsDataUrl = `https://newsdata.io/api/1/news?` + 
            `apikey=${process.env.NEWSDATA_API_KEY}` +
            `&language=${language}` +
            (category ? `&category=${category}` : '');

        console.log('Fetching from NewsData.io:', newsDataUrl);
        const newsDataResponse = await axios.get(newsDataUrl);
        
        if (!newsDataResponse.data || !newsDataResponse.data.results) {
            console.log('No results from NewsData.io');
            return [];
        }

        const newsDataArticles = newsDataResponse.data.results.map(article => ({
            title: article.title || 'No title',
            description: article.description || 'No description',
            source: article.source_name || 'Unknown source',
            url: article.link || '',
            publishedAt: article.pubDate || new Date().toISOString(),
            content: article.content || '',
            category: article.category || []
        }));

        return newsDataArticles;

    } catch (error) {
        console.error('Error in getNewsFromMultipleSources:', error.message);
        return [];
    }
}


export { getNewsFromMultipleSources };
