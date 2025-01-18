import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const AnimatedContent = motion.div;


// Existing styled components remain the same
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '90%',
    maxWidth: '800px',
    borderRadius: '20px',
    padding: theme.spacing(2),
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '10px',
      '&:hover': {
        background: '#666'
      }
    }
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(5px)'
  }
}));

// Existing PerspectiveButton and AnimatedContent remain the same...
const PerspectiveButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: '25px',
  padding: '10px 20px',
  transition: 'all 0.3s ease',
  backgroundColor: selected ? '#1a1a1a' : 'transparent',
  color: selected ? '#ffffff' : '#1a1a1a',
  border: `1px solid ${selected ? '#1a1a1a' : theme.palette.grey[300]}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: selected ? '#333333' : 'rgba(0,0,0,0.1)',
  },
}));




function ExpandedNewsCard({ open, onClose, article, onRequestPerspective }) {
  const [selectedPerspective, setSelectedPerspective] = useState(null);
  const [loading, setLoading] = useState(false);
  const [perspective, setPerspective] = useState(null);
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [podcastScript, setPodcastScript] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (!open) {
      setSelectedPerspective(null);
      setPerspective(null);
      setPodcastScript(null);
      setAudioUrl(null);
    }
  }, [open]);

  if (!article) return null;

  const perspectives = [
    { id: 'student', label: 'Student' },
    { id: 'researcher', label: 'Researcher'},
    { id: 'expert', label: 'Expert'},
    { id: 'general', label: 'General'}
  ];

  const handlePerspectiveClick = async (perspectiveId) => {
    setSelectedPerspective(perspectiveId);
    setLoading(true);
    setPodcastScript(null);
    setAudioUrl(null);
    try {
      const newPerspective = await onRequestPerspective(article, perspectiveId);
      setPerspective(newPerspective);
    } catch (error) {
      console.error('Error:', error);
      setPerspective(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePodcast = async () => {
    if (!selectedPerspective || !perspective) return;
    
    setPodcastLoading(true);
    try {
      const response = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          article,
          perspective
        })
      });
      
      const data = await response.json();
      setPodcastScript(data.script);
      setAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('Error generating podcast:', error);
    } finally {
      setPodcastLoading(false);
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <AnimatedContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <IconButton
            onClick={onClose}
            sx={{ 
              position: 'absolute',
              right: '16px',
              top: '16px',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)'
              },
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, pr: 4 }}>
            {article.title}
          </Typography>

          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              mt: 2,
              whiteSpace: 'pre-wrap',
              color: 'text.primary',
            }}
          >
            {article.description}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              View Different Perspectives
            </Typography>
            
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                gap: 2,
                mb: 3 
              }}
            >
              {perspectives.map((p) => (
                <PerspectiveButton
                  key={p.id}
                  selected={selectedPerspective === p.id}
                  onClick={() => handlePerspectiveClick(p.id)}
                >
                  {p.label}
                </PerspectiveButton>
              ))}
            </Box>

            <Box sx={{ 
              mt: 3, 
              minHeight: '150px',
              backgroundColor: 'rgba(0,0,0,0.03)',
              borderRadius: '10px',
              p: 2
            }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="150px">
                  <CircularProgress />
                </Box>
              ) : perspective ? (
                <>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {perspective}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    onClick={handleGeneratePodcast}
                    disabled={podcastLoading}
                    startIcon={<HeadphonesIcon />}
                    sx={{
                      borderRadius: '25px',
                      mt: 2,
                      backgroundColor: '#1a1a1a',
                      '&:hover': {
                        backgroundColor: '#333',
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {podcastLoading ? 'Generating Podcast...' : 'Generate Podcast'}
                  </Button>
                </>
              ) : selectedPerspective ? (
                <Typography color="text.secondary">
                  Failed to load perspective. Please try again.
                </Typography>
              ) : (
                <Typography color="text.secondary" textAlign="center">
                  Select a perspective to view analysis
                </Typography>
              )}
            </Box>

            {audioUrl && (
              <Box sx={{ 
                mt: 3,
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderRadius: '10px',
              }}>
                <Typography variant="subtitle1" gutterBottom>
                  Generated Podcast
                </Typography>
                <audio 
                  controls 
                  style={{ 
                    width: '100%',
                    borderRadius: '10px',
                  }}
                >
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="caption" color="text.secondary">
              Source: {article.source} | {new Date(article.publishedAt).toLocaleDateString()}
            </Typography>
            <Button 
              variant="contained" 
              href={article.url} 
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderRadius: '25px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Read Full Article
            </Button>
          </Box>
        </AnimatedContent>
      </DialogContent>
    </StyledDialog>
  );
}

export default ExpandedNewsCard;
