// const axios = require('axios');
// require('dotenv').config();

// const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
// const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// async function getNewsFromMultipleSources(topic = '') {
//   try {
//     console.log('Fetching from NewsData.io...');
//     const newsDataResponse = await axios.get('https://newsdata.io/api/1/news?apikey=pub_65771fb09f8213c1e308f29155fcd954ec968&language=en', {
//       params: {
//         apikey: process.env.NEWSDATA_API_KEY,
//         q: topic,
//         language: 'en'
//       }
//     });
//     console.log('NewsData.io response:', newsDataResponse.data);

//     // console.log('Fetching from GNews...');
//     // const gNewsResponse = await axios.get('https://gnews.io/api/v4/top-headlines?token=5d48e517fc50b45310db9a688a0e275f&lang=en', {
//     //   params: {
//     //     token: process.env.GNEWS_API_KEY,
//     //     q: topic || 'top',
//     //     lang: 'en'
//     //   }
//     // });
//     // console.log('GNews response:', gNewsResponse.data);

//     // Combine and normalize the responses
//     const newsDataArticles = newsDataResponse.data.results.map(article => ({
//       title: article.title,
//       description: article.description,
//       source: article.source_name,
//       url: article.link,
//       publishedAt: article.pubDate,
//       perspective: determinePerspective(article)
//     }));

//     // const gNewsArticles = gNewsResponse.data.articles.map(article => ({
//     //   title: article.title,
//     //   description: article.description,
//     //   source: article.source.name,
//     //   url: article.url,
//     //   publishedAt: article.publishedAt,
//     //   perspective: determinePerspective(article)
//     // }));

//     //return [...newsDataArticles, ...gNewsArticles];
//     return [...newsDataArticles];
//   } catch (error) {
//     console.error('Error fetching news:', error);
//     return [];
//   }
// }

// function determinePerspective(article) {
//   // Analyze the article's content to determine its perspective
//   // This is a simplified example - you might want to use more sophisticated analysis
//   const content = (article.title + ' ' + article.description).toLowerCase();
  
//   if (content.includes('according to experts') || content.includes('research shows')) {
//     return 'Academic/Research';
//   } else if (content.includes('officials say') || content.includes('government')) {
//     return 'Official/Government';
//   } else if (content.includes('critics') || content.includes('opposition')) {
//     return 'Critical/Opposition';
//   } else {
//     return 'General/Neutral';
//   }
// }

// module.exports = { getNewsFromMultipleSources };


const axios = require('axios');

const removeDuplicateNews = (newsArticles) => {
  const uniqueArticles = [];
  const titles = new Set();
  
  newsArticles.forEach(article => {
    if (!titles.has(article.title)) {
      titles.add(article.title);
      uniqueArticles.push(article);
    }
  });
  
  return uniqueArticles;
};
async function getNewsFromMultipleSources(topic = '') {
    try {
        // Fetch from NewsData.io
        const newsDataUrl = `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&language=en`;
        // const newsDataUrl = 'https://newsdata.io/api/1/news?apikey=pub_65771fb09f8213c1e308f29155fcd954ec968&language=en';
        console.log('Fetching from NewsData.io...');
        const newsDataResponse = await axios.get(newsDataUrl);
        
        // Log the raw response for debugging
        console.log('NewsData.io raw response:', newsDataResponse.data);

        // Check if we have results
        if (!newsDataResponse.data || !newsDataResponse.data.results) {
            console.log('No results from NewsData.io');
            return [];
        }

        // Format NewsData.io articles
        const newsDataArticles = newsDataResponse.data.results.map(article => ({
            title: article.title || 'No title',
            description: article.description || 'No description',
            source: article.source_name || 'Unknown source',
            url: article.link || '',
            publishedAt: article.pubDate || new Date().toISOString(),
            content: article.content || '',
            category: article.category || []
        }));

        // Remove duplicate articles
        const uniqueArticles = Array.from(
            new Map(newsDataArticles.map(article => [article.title, article])).values()
        );

        console.log(`Processed ${uniqueArticles.length} unique articles`);
        return uniqueArticles;

    } catch (error) {
        console.error('Error in getNewsFromMultipleSources:', error.message);
        if (error.response) {
            console.error('API Response Error:', error.response.data);
        }
        return [];
    }
}

module.exports = { getNewsFromMultipleSources };
