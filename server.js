// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { HfInference } = require('@huggingface/inference');
// const { getHistoricalNews, getGNews } = require('./newsApi');
// const db = require('./db');

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Perspective-Shifting News Aggregator API</h1>
//     <p>Available endpoints:</p>
//     <ul>
//       <li><a href="/api/news">/api/news</a> - Fetch latest news from multiple sources</li>
//       <li><a href="/api/historical-news">/api/historical-news</a> - Fetch historical news (requires query parameters)</li>
//       <li><a href="/api/historical-context">/api/historical-context</a> - Fetch historical context for a news article</li>
//     </ul>
//   `);
// });

// app.get('/api/news', async (req, res) => {
//   try {
//     const newsDataNews = await getHistoricalNews('', '', '');
//     const gNews = await getGNews();
    
//     const combinedNews = [...newsDataNews, ...gNews];
    
//     const newsWithSentiment = await Promise.all(combinedNews.map(async (article) => {
//       const sentiment = await hf.textClassification({
//         model: 'distilbert-base-uncased-finetuned-sst-2-english',
//         inputs: article.title,
//       });
//       return { ...article, sentiment: sentiment[0].label };
//     }));

//     res.json(newsWithSentiment);
//   } catch (error) {
//     console.error('Error fetching news:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/historical-news', async (req, res) => {
//   try {
//     const { query, fromDate, toDate } = req.query;
//     const news = await getHistoricalNews(query, fromDate, toDate);
//     res.json(news);
//   } catch (error) {
//     console.error('Error fetching historical news:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/historical-context/:id', async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM historical_news WHERE article_id = ?', [req.params.id]);
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching historical context:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getNewsFromMultipleSources } = require('./newsApi');
const { getPerspectives } = require('./utils/perspectiveAnalyzer');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>Multi-Perspective News Aggregator API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/news">/api/news</a> - Fetch latest news</li>
      <li>/api/perspective - Get specific perspective on news (POST)</li>
    </ul>
  `);
});

app.get('/api/news', async (req, res) => {
  try {
    console.log('Fetching news from multiple sources...');
    const allNews = await getNewsFromMultipleSources();
    console.log(`Successfully fetched ${allNews.length} articles`);
    res.json(allNews);
  } catch (error) {
    console.error('Error in /api/news endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Add this new endpoint for perspectives
app.post('/api/perspective', async (req, res) => {
  try {
    const { article, perspectiveType } = req.body;
    console.log(`Generating ${perspectiveType} perspective for article: ${article.title}`);
    
    if (!article || !perspectiveType) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Article and perspective type are required' 
      });
    }

    const perspective = await getPerspectives(article, perspectiveType);
    console.log('Perspective generated successfully');
    res.json({ perspective: perspective.alternative });
  } catch (error) {
    console.error('Error generating perspective:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
