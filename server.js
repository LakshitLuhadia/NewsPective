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
