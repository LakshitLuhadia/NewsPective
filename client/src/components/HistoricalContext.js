// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { Typography, List, ListItem, ListItemText } from '@mui/material';
// import axios from 'axios';

// function HistoricalContext() {
//   const [context, setContext] = useState([]);
//   const { id } = useParams();

//   const fetchHistoricalContext = useCallback(async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/historical-context/${id}`);
//       setContext(response.data);
//     } catch (error) {
//       console.error('Error fetching historical context:', error);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchHistoricalContext();
//   }, [fetchHistoricalContext]);

//   return (
//     <div>
//       <Typography variant="h4">Historical Context</Typography>
//       <List>
//         {context.map((item, index) => (
//           <ListItem key={index}>
//             <ListItemText primary={item.title} secondary={item.date} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );
// }

// export default HistoricalContext;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

function HistoricalContext() {
  const [context, setContext] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchHistoricalContext = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/historical-context/${id}`);
      if (!response.ok) throw new Error('Failed to fetch historical context');
      const data = await response.json();
      setContext(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHistoricalContext();
  }, [fetchHistoricalContext]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Historical Context</Typography>
      <List>
        {context.map((item, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={item.title}
              secondary={new Date(item.date).toLocaleDateString()}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default HistoricalContext;
