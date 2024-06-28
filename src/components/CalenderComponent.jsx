import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Paper, Typography, TextField, Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events, handleSelectSlot, handleSelectEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEventTitle, setEditedEventTitle] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditedEventTitle(event.title);
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id ? { ...event, title: editedEventTitle } : event
    );
    setIsModalOpen(false);
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ height: '75vh', width:'100%', padding: '20px', margin: '20px', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#3D5A80',
          textAlign: 'center',
          marginBottom: '50px',
        }}
      >
        Task Deadline Calendar
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEditEvent} // Change to handleEditEvent for event selection
        onSelectDate={handleDateSelect}
        popup
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        defaultDate={selectedDate || new Date()}
        style={{ fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor:'#F0F4F8', padding:'30px' }}
      />

      <Modal open={isModalOpen} onClose={handleCancelEdit}>
        <Paper
          elevation={3}
          style={{
            padding: '20px',
            maxWidth: '400px',
            margin: 'auto',
            marginTop: '100px',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#3D5A80', textAlign: 'center', fontWeight: 'bold' }}>
            Edit Event
          </Typography>
          <TextField
            fullWidth
            label="Event Title"
            value={editedEventTitle}
            onChange={(e) => setEditedEventTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            fullWidth
            sx={{
              mt: 2,
              background: '#3D5A80',
              '&:hover': { backgroundColor: '#E5E1DA', color: '#071952' },
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={handleCancelEdit}
            fullWidth
            sx={{
              mt: 2,
              background: '#3D5A80',
              '&:hover': { backgroundColor: '#E5E1DA', color: '#071952' },
            }}
          >
            Cancel
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
