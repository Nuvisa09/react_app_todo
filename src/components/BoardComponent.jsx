// src/components/BoardComponent.jsx
import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, TextField, Button, Box, IconButton, Card, CardContent, Chip, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import CalendarComponent from './CalenderComponent';

const ItemTypes = {
    TASK: 'task',
};

const DraggableTask = ({ task, handleEditTask, handleDeleteTask, isEditing, handleSaveEditTask, handleCancelEditTask, editTaskText, setEditTaskText, editStatus, setEditStatus, editImage, setEditImage, editDeadline, setEditDeadline }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card ref={drag} sx={{ opacity: isDragging ? 0.5 : 1, mb: 2, }}>
            <CardContent>
                {isEditing ? (
                    <>
                        <TextField
                            fullWidth
                            value={editTaskText}
                            onChange={(e) => setEditTaskText(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                            style={{ marginTop: 10 }}
                        />
                        {editImage && (
                            <img
                                src={editImage}
                                alt="Task"
                                style={{ marginTop: 10, maxWidth: '100%', maxHeight: 150 }}
                            />
                        )}
                        <TextField
                            type="date"
                            label="Deadline"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mt: 1 }}
                        />
                        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                            <InputLabel id="edit-status-label">Status</InputLabel>
                            <Select
                                labelId="edit-status-label"
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="ToDo">To Do</MenuItem>
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                ) : (
                    <>
                        <Typography variant="body1">{task.text}</Typography>
                            {task.image && (
                                <img
                                    src={task.image}
                                    alt="Task"
                                    style={{ marginTop: 10, maxWidth: '100%', maxHeight: 150, padding:2, marginBottom:20, display: 'block',marginLeft: 'auto',marginRight: 'auto'}}
                                />
                            )}
                            {task.deadline && (
                                <Typography variant="caption" color="textSecondary" sx={{textAlign:'left', mt:1, display:'blok'}}>
                                    Deadline: {task.deadline}
                                </Typography>
                            )}
                        <Box sx={{ display: 'flex', justifyContent: 'start', mt: 1 }}>
                            <Chip
                            label={`${task.status}`}
                            size="small"
                            sx={{
                                backgroundColor: task.status === 'ToDo' ? '#ecd4ea' : task.status === 'Done' ? '#d5e4cf' : '#E0FBFC',
                                color: '#071952', marginRight:1
                            }}/>
                            <Chip
                            label={`${task.priority}`}
                            size="small"
                            color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'primary' : 'default'}
                            sx={{
                                backgroundColor: task.priority === 'High' ? '#EE6C4D' : task.priority === 'Medium' ? '#98C1D9' : '#E0FBFC',
                                color: '#071952',
                            }}
                            />
                        </Box>
                    </>
                )}
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    {isEditing ? (
                        <>
                            <IconButton onClick={handleSaveEditTask}>
                                <Save />
                            </IconButton>
                            <IconButton onClick={handleCancelEditTask}>
                                <Cancel />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={() => handleDeleteTask(task.id)}>
                                <Delete />
                            </IconButton>
                            <IconButton onClick={() => handleEditTask(task)}>
                                <Edit />
                            </IconButton>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const DroppableZone = ({ status, onDrop, children }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item) => onDrop(item, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={{ backgroundColor: isOver ? '' : '', padding: 10 }}>
            {children.length > 0 ? (
                children
            ) : (
                <Typography variant="body1"  align="center">
                    No Task
                </Typography>
            )}
        </div>
    );
};

const BoardComponent = ({ lists, setLists }) => {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState('ToDo');
    const [deadline, setDeadline] = useState(null);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [editDeadline, setEditDeadline] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTask = () => {
        if (task.trim()) {
            const newLists = [...lists];
            newLists[0].tasks.push({ id: uuidv4(), text: task, priority: priority, completed: false, status: status, image: null, deadline: deadline });
            setLists(newLists);
            setTask('');
            setPriority('Medium');
            setStatus('ToDo');
            setDeadline(null);
            updateCalendarEvents(newLists); 
        }
    };

    const handleDeleteTask = (taskId) => {
        const newLists = lists.map(list => ({
            ...list,
            tasks: list.tasks.filter(task => task.id !== taskId)
        }));
        setLists(newLists);
        updateCalendarEvents(newLists); 
    };

    const handleEditTask = (task) => {
        setEditTaskId(task.id);
        setEditTaskText(task.text);
        setEditStatus(task.status);
        setEditImage(task.image);
        setEditDeadline(task.deadline);
        setIsModalOpen(true); // Open the modal when editing starts
    };

    const handleSaveEditTask = () => {
        const newLists = lists.map(list => ({
            ...list,
            tasks: list.tasks.map(task =>
                task.id === editTaskId ? { ...task, text: editTaskText, status: editStatus, image: editImage, deadline: editDeadline } : task
            )
        }));
        setLists(newLists);
        setEditTaskId(null);
        setEditTaskText('');
        setEditStatus('');
        setEditImage(null);
        setEditDeadline(null);
        setIsModalOpen(false); // Close the modal after saving edits
        updateCalendarEvents(newLists); 
    };

    const handleCancelEditTask = () => {
        setEditTaskId(null);
        setEditTaskText('');
        setEditStatus('');
        setEditImage(null);
        setEditDeadline(null);
        setIsModalOpen(false);
        updateCalendarEvents(newLists);  // Close the modal if editing is canceled
    };

    const filteredTasks = (statusType) => {
        return lists.flatMap(list => list.tasks.filter(task => task.status === statusType));
    };

    const handleDrop = (item, newStatus) => {
        const newLists = lists.map(list => ({
            ...list,
            tasks: list.tasks.map(task =>
                task.id === item.id ? { ...task, status: newStatus } : task
            )
        }));
        setLists(newLists);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [calendarEvents, setCalendarEvents] = useState([]);

    const updateCalendarEvents = (updatedLists) => {
        const updatedEvents = updatedLists.flatMap(list =>
            list.tasks.filter(task => task.deadline).map(task => ({
                id: task.id,
                title: task.text,
                start: new Date(task.deadline),
                end: new Date(task.deadline),
            }))
        );
        setCalendarEvents(updatedEvents);
    };

    useEffect(() => {
        const storedLists = JSON.parse(localStorage.getItem('lists')) || [];
        if (storedLists.length > 0) {
            setLists(storedLists);
            updateCalendarEvents(storedLists); 
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('lists', JSON.stringify(lists));
    }, [lists]);
        

    return (
        <Grid container spacing={2}  sx={{ p: 2 }} >
            <Grid item xs={12} sm={12} sx={{ p: 1 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3D5A80', textAlign: 'center', padding:'15px' }}>
                    Board
                </Typography>
            </Grid>
            <Grid item xs={12} sm={3} sx={{ p: 2 }} >
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#F0F4F8' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#3D5A80' }}>
                        Add Task
                    </Typography>
                    <TextField
                        fullWidth
                        label="Task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        select
                        label="Priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        select
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="ToDo">To Do</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        type="date"
                        label="Deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddTask}
                        fullWidth
                        sx={{
                            background: '#3D5A80',
                            color: '#E0FBFC',
                            '&:hover': {
                                backgroundColor: '#E5E1DA',
                                color: '#3D5A80',
                            },
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: 1.5,
                        }}
                    >
                        Add Task
                    </Button>
                </Paper>
            </Grid>

            {lists.map((list) => (
                <Grid item key={list.id} xs={12} sm={3}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto', backgroundImage: 'linear-gradient(70deg, #E5E1DA  30%, #3D5A80 30%)', color:'White', fontWeight:'bold' }}>
                        <Typography variant="h6" gutterBottom>
                            {list.title}
                        </Typography>
                        <DroppableZone status={list.status} onDrop={handleDrop}>
                            {filteredTasks(list.status).map((task) => (
                                <DraggableTask
                                    key={task.id}
                                    task={task}
                                    handleEditTask={handleEditTask}
                                    handleDeleteTask={handleDeleteTask}
                                    isEditing={editTaskId === task.id}
                                    handleSaveEditTask={handleSaveEditTask}
                                    handleCancelEditTask={handleCancelEditTask}
                                    editTaskText={editTaskText}
                                    setEditTaskText={setEditTaskText}
                                    editStatus={editStatus}
                                    setEditStatus={setEditStatus}
                                    editImage={editImage}
                                    setEditImage={setEditImage}
                                    editDeadline={editDeadline}
                                    setEditDeadline={setEditDeadline}
                                />
                            ))}
                        </DroppableZone>
                    </Paper>
                </Grid>
            ))}
            <Grid container>
                <Grid item xs={8} md={10}  >
                    <Modal open={isModalOpen}  onClose={handleCancelEditTask}>
                        <Paper elevation={3}  sx={{ p: 4, maxWidth: 400, margin: 'auto', mt: 10 }}>
                            <Typography variant="h6" gutterBottom>
                                Edit Task
                            </Typography>
                            <TextField
                                fullWidth
                                label="Task"
                                value={editTaskText}
                                onChange={(e) => setEditTaskText(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                <InputLabel id="edit-status-label">Status</InputLabel>
                                <Select
                                    labelId="edit-status-label"
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="ToDo">To Do</MenuItem>
                                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                                    <MenuItem value="Done">Done</MenuItem>
                                </Select>
                            </FormControl>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={handleImageChange}
                                style={{ marginTop: 10 , padding:3, marginBottom:20}}
                            />
                            {editImage && (
                                <img
                                    src={editImage}
                                    alt="Task"
                                    style={{ marginTop: 10, maxWidth: '100%', maxHeight: 150, padding:2, marginBottom:20, display: 'block',marginLeft: 'auto',marginRight: 'auto' }}
                                />
                            )}
                            <TextField
                                fullWidth
                                type="date"
                                label="Deadline"
                                value={editDeadline}
                                onChange={(e) => setEditDeadline(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained"  onClick={handleSaveEditTask} fullWidth sx={{background:'#92C7CF', '&:hover': {
                                backgroundColor: '#E5E1DA', color:'#071952'},}}> 
                                Save
                            </Button>
                            <Button variant="contained" onClick={handleCancelEditTask} fullWidth  sx={{ mt: 2, background:'#92C7CF', '&:hover': {
                                backgroundColor: '#E5E1DA', color:'#071952'},}}>
                                Cancel
                            </Button>
                        </Paper>
                    </Modal>
                </Grid>
            </Grid>
            <Grid item container justifyContent="center" sx={{ mt: 4 }}>
                <Grid item xs={10}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3D5A80', textAlign: 'center', padding:'20px' }}>
                        
                    </Typography>
                    <CalendarComponent events={calendarEvents} />
                </Grid>
            </Grid>

        </Grid>
    );
};

export default function App() {
    const [lists, setLists] = useState([
        {
            id: 1,
            title: 'To Do',
            status: 'ToDo',
            tasks: [],
        },
        {
            id: 2,
            title: 'Ongoing',
            status: 'Ongoing',
            tasks: [],
        },
        {
            id: 3,
            title: 'Done',
            status: 'Done',
            tasks: [],
        },
    ]);

    return (
        <DndProvider backend={HTML5Backend}>
            <BoardComponent lists={lists} setLists={setLists} />
        </DndProvider>
    );
}
