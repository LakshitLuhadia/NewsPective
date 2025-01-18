// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Container, AppBar, Toolbar, Typography } from '@mui/material';
// import NewsFeed from './components/NewsFeed';
// import HistoricalContext from './components/HistoricalContext';

// function App() {
//   return (
//     <Router>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6">Perspective-Shifting News Aggregator</Typography>
//         </Toolbar>
//       </AppBar>
//       <Container>
//         <Routes>
//           <Route path="/" element={<NewsFeed />} />
//           <Route path="/historical/:id" element={<HistoricalContext />} />
//         </Routes>
//       </Container>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import HistoricalContext from './components/HistoricalContext';

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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<NewsFeed />} />
          <Route path="/historical/:id" element={<HistoricalContext />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
