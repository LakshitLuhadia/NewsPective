import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Chip, Box, CircularProgress, Button} from '@mui/material';
import { styled } from '@mui/material/styles';
// import AutorenewIcon from '@mui/icons-material/Autorenew';
import { motion } from 'framer-motion';
import ExpandedNewsCard from './ExpandedNewsCard';

const StyledCard = styled(motion.div)(({ theme, isPerspective }) => ({
  height: '400px', // Fixed height
  borderRadius: '20px', // More rounded corners
  backgroundColor: isPerspective ? '#1a1a1a' : '#ffffff',
  color: isPerspective ? '#ffffff' : '#000000',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
}));


// const PerspectiveButton = styled(IconButton)(({ theme }) => ({
//   position: 'absolute',
//   bottom: '16px',
//   right: '16px',
//   backgroundColor: 'rgba(255,255,255,0.1)',
//   '&:hover': {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
// }));

function NewsCard({ article, onExpand }) {
  // Remove showPerspective state since we don't need it anymore
  
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <StyledCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onExpand}
      sx={{ cursor: 'pointer' }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          position: 'relative',
          backgroundColor: '#ffffff',
          color: '#000000',
          borderRadius: '20px',
        }}
      >
        <CardContent>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: '1.2rem',
              fontWeight: 600,
              lineHeight: 1.4,
              mb: 2
            }}
          >
            {article.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              mb: 2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {truncateText(article.description)}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  mr: 1
                }}
              >
                {article.source}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: 'text.secondary' }}
              >
                {new Date(article.publishedAt).toLocaleDateString()}
              </Typography>
            </Box>
            
            {article.category && (
              <Chip 
                label={Array.isArray(article.category) ? article.category[0] : article.category}
                size="small"
                sx={{ 
                  mr: 1,
                  backgroundColor: '#f0f0f0',
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </StyledCard>
  );
}


function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchNews = async (pageNum) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news?page=${pageNum}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setNews(prev => [...prev, ...data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleRequestPerspective = async (article, perspectiveType) => {
    try {
      const response = await fetch('http://localhost:5000/api/perspective', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article,
          perspectiveType
        }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch perspective');
      const data = await response.json();
      return data.perspective;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  if (loading && page === 1) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {news.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <NewsCard 
              article={article}
              onExpand={() => setSelectedArticle(article)}
            />
          </Grid>
        ))}
      </Grid>
      
      <ExpandedNewsCard
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
        onRequestPerspective={handleRequestPerspective}
      />
      
      {hasMore && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={loading}
            sx={{
              minWidth: '200px',
              borderRadius: '25px',
              py: 1.5,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default NewsFeed;
