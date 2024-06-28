// src/App.jsx
import { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import NavbarComponent from './components/NavbarComponent';
import BoardComponent from './components/BoardComponent';
import CalendarComponent from './components/CalenderComponent';

const App = () => {
  const [lists, setLists] = useState([
    { id: 1, title: 'To Do', status: 'ToDo', tasks: [] },
    { id: 2, title: 'Ongoing', status: 'Ongoing', tasks: [] },
    { id: 3, title: 'Done', status: 'Done', tasks: [] },
  ]);
  const [currentPage, setCurrentPage] = useState('Board');
  const [events, setEvents] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('Enter event title:');
    if (title) {
      const newEvent = {
        id: events.length + 1,
        title,
        start,
        end,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleSelectEvent = (event) => {
    alert(`You selected event: ${event.title}`);
  };

  return (
    <Box container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '200vh',
        maxHeight:'100%',
        minWidth: '100vw',
        backgroundColor: '#E5E1DA',
        color: '#071952',
        backgroundImage: 'url("/path/to/your/background-image.jpg")', // Add a background image if desired
        backgroundSize: 'cover', // Ensure the background image covers the entire viewport
        backgroundPosition: 'center', // Center the background image
        justifyContent:'center'
      }}
    >
      <CssBaseline />
      <NavbarComponent onPageChange={handlePageChange} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          {/* {currentPage === 'Board' && 'Board'}
          {currentPage === 'Calendar' && 'Calendar'} */}
        </Typography>
        {currentPage === 'Board' && (
          <BoardComponent lists={lists} setLists={setLists} />
        )}
        {currentPage === 'Calendar' && (
          <CalendarComponent
            events={events}
            handleSelectSlot={handleSelectSlot}
            handleSelectEvent={handleSelectEvent}
          />
        )}
      </Box>
    </Box>
  );
};

export default App;
