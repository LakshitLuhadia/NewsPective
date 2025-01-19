// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const { HfInference } = require('@huggingface/inference');
// // const { getHistoricalNews, getGNews } = require('./newsApi');
// // const db = require('./db');

// // const app = express();
// // const port = process.env.PORT || 5000;

// // app.use(cors());
// // app.use(express.json());

// // const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// // app.get('/', (req, res) => {
// //   res.send(`
// //     <h1>Perspective-Shifting News Aggregator API</h1>
// //     <p>Available endpoints:</p>
// //     <ul>
// //       <li><a href="/api/news">/api/news</a> - Fetch latest news from multiple sources</li>
// //       <li><a href="/api/historical-news">/api/historical-news</a> - Fetch historical news (requires query parameters)</li>
// //       <li><a href="/api/historical-context">/api/historical-context</a> - Fetch historical context for a news article</li>
// //     </ul>
// //   `);
// // });

// // app.get('/api/news', async (req, res) => {
// //   try {
// //     const newsDataNews = await getHistoricalNews('', '', '');
// //     const gNews = await getGNews();
    
// //     const combinedNews = [...newsDataNews, ...gNews];
    
// //     const newsWithSentiment = await Promise.all(combinedNews.map(async (article) => {
// //       const sentiment = await hf.textClassification({
// //         model: 'distilbert-base-uncased-finetuned-sst-2-english',
// //         inputs: article.title,
// //       });
// //       return { ...article, sentiment: sentiment[0].label };
// //     }));

// //     res.json(newsWithSentiment);
// //   } catch (error) {
// //     console.error('Error fetching news:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // app.get('/api/historical-news', async (req, res) => {
// //   try {
// //     const { query, fromDate, toDate } = req.query;
// //     const news = await getHistoricalNews(query, fromDate, toDate);
// //     res.json(news);
// //   } catch (error) {
// //     console.error('Error fetching historical news:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // app.get('/api/historical-context/:id', async (req, res) => {
// //   try {
// //     const [rows] = await db.query('SELECT * FROM historical_news WHERE article_id = ?', [req.params.id]);
// //     res.json(rows);
// //   } catch (error) {
// //     console.error('Error fetching historical context:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { getNewsFromMultipleSources } = require('./newsApi');
// const { getPerspectives } = require('./utils/perspectiveAnalyzer');

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Multi-Perspective News Aggregator API</h1>
//     <p>Available endpoints:</p>
//     <ul>
//       <li><a href="/api/news">/api/news</a> - Fetch latest news</li>
//       <li>/api/perspective - Get specific perspective on news (POST)</li>
//     </ul>
//   `);
// });

// app.get('/api/news', async (req, res) => {
//   try {
//     console.log('Fetching news from multiple sources...');
//     const allNews = await getNewsFromMultipleSources();
//     console.log(`Successfully fetched ${allNews.length} articles`);
//     res.json(allNews);
//   } catch (error) {
//     console.error('Error in /api/news endpoint:', error);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       message: error.message 
//     });
//   }
// });

// // Add this new endpoint for perspectives
// app.post('/api/perspective', async (req, res) => {
//   try {
//     const { article, perspectiveType } = req.body;
//     console.log(`Generating ${perspectiveType} perspective for article: ${article.title}`);
    
//     if (!article || !perspectiveType) {
//       return res.status(400).json({ 
//         error: 'Bad Request', 
//         message: 'Article and perspective type are required' 
//       });
//     }

//     const perspective = await getPerspectives(article, perspectiveType);
//     console.log('Perspective generated successfully');
//     res.json({ perspective: perspective.alternative });
//   } catch (error) {
//     console.error('Error generating perspective:', error);
//     res.status(500).json({ 
//       error: 'Internal server error', 
//       message: error.message 
//     });
//   }
// });

// // const { generatePodcastScript } = require('./utils/podcastGenerator');

// // Add this new endpoint
// // app.post('/api/generate-podcast', async (req, res) => {
// //     try {
// //         const { article, perspective } = req.body;
// //         const script = await generatePodcastScript(article, perspective);
        
// //         if (!script) {
// //             throw new Error('Failed to generate podcast script');
// //         }
        
// //         res.json({ script });
// //     } catch (error) {
// //         console.error('Error:', error);
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // server.js
// const { generatePodcastScript } = require('./utils/podcastGenerator');
// const { convertToAudio } = require('./utils/audioGenerator');

// // app.post('/api/generate-podcast', async (req, res) => {
// //     try {
// //         const { article, perspective } = req.body;
        
// //         // Generate script using Gemini
// //         const script = await generatePodcastScript(article, perspective);
// //         if (!script) {
// //             throw new Error('Failed to generate podcast script');
// //         }
        
// //         // Convert script to audio using Speechify
// //         const audioUrl = await convertToAudio(script);
// //         if (!audioUrl) {
// //             throw new Error('Failed to convert script to audio');
// //         }
        
// //         res.json({ 
// //             script: script,
// //             audioUrl: audioUrl 
// //         });
// //     } catch (error) {
// //         console.error('Error:', error);
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// app.post('/api/generate-podcast', async (req, res) => {
//     try {
//         const { article, perspective } = req.body;
//         console.log('Received request for podcast generation');
        
//         const script = await generatePodcastScript(article, perspective);
//         if (!script) {
//             throw new Error('Failed to generate podcast script');
//         }
        
//         // Comment out audio conversion for now
//         // const audioUrl = await convertToAudio(script);
        
//         res.json({ 
//             script: script,
//             // audioUrl: audioUrl 
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { getNewsFromMultipleSources } = require('./newsApi');
// const { getPerspectives } = require('./utils/perspectiveAnalyzer');
// const { generatePodcastScript } = require('./utils/podcastGenerator');
// // const { convertToAudio } = require('./utils/audioGenerator'); // Commented for now

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { HfInference } from '@huggingface/inference';
import { getNewsFromMultipleSources } from './newsApi.js';
import { getPerspectives } from './utils/perspectiveAnalyzer.js';
import { generatePodcastScript } from './utils/podcastGenerator.js';
import { convertToAudio } from './utils/audioGenerator.js';
import db from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

app.get('/', (req, res) => {
  res.send(`
    <h1>Multi-Perspective News Aggregator API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/news">/api/news</a> - Fetch latest news</li>
      <li>/api/perspective - Get specific perspective on news (POST)</li>
      <li>/api/generate-podcast - Generate podcast script (POST)</li>
    </ul>
  `);
});

app.get('/api/news', async (req, res) => {
  try {
    const language = req.query.language || 'en';
    const category = req.query.category || 'top';
    
    console.log(`Fetching ${category} news in ${language}`);
    
    const allNews = await getNewsFromMultipleSources(language, category);
    res.json(allNews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.post('/api/perspective', async (req, res) => {
    try {
        const { article, perspectiveType, language } = req.body;
        console.log(`Generating ${perspectiveType} perspective for article: ${article.title}`);
        
        if (!article || !perspectiveType) {
            return res.status(400).json({ 
                error: 'Bad Request', 
                message: 'Article and perspective type are required' 
            });
        }

        const perspective = await getPerspectives(article, perspectiveType, language);
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

app.post('/api/generate-podcast', async (req, res) => {
    try {
        const { article, perspective, language = 'en' } = req.body;
        console.log(`Generating podcast in ${language}...`);
        
        const script = await generatePodcastScript(article, perspective, language);
        if (!script) {
            throw new Error('Failed to generate podcast script');
        }
        
        console.log('Converting script to audio...');
        const audioUrl = await convertToAudio(script, language);
        if (!audioUrl) {
            throw new Error('Failed to convert script to audio');
        }
        
        res.json({ audioUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
