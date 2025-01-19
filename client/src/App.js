import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import HistoricalContext from './components/HistoricalContext';

// Create a language context
export const LanguageContext = React.createContext();

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    background: {
      default: '#f5f5f5', // Light grey
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#1a237e',
            color: 'white',
            '&:hover': {
              backgroundColor: '#2832a8',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
      console.log('Language changed to:', newLanguage);
    }
  };

  const CustomHeader = () => (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project
        </Typography>
        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={handleLanguageChange}
          aria-label="language selection"
          size="small"
          sx={{
            backgroundColor: 'white',
            borderRadius: '20px',
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              '&:not(:last-child)': {
                marginRight: '4px',
              },
            },
          }}
        >
          <ToggleButton value="en" aria-label="english">
            EN
          </ToggleButton>
          <ToggleButton value="fr" aria-label="french">
            FR
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>
    </AppBar>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <Router>
          <CustomHeader />
          <Header />
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/historical/:id" element={<HistoricalContext />} />
          </Routes>
        </Router>
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}

export default App;
