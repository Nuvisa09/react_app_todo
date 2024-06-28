import { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText,
  useTheme, useMediaQuery, Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavbarComponent = ({ onPageChange }) => {
  const pages = ['Board', 'Calendar'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  const handlePageChange = (page) => {
    onPageChange(page);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {isMobile ? (
        <>
          <Drawer
            anchor="top"
            open={open}
            onClose={handleDrawerToggle}
            sx={{
              '& .MuiDrawer-paper': {
                top: '64px',
                width: '100%',
                boxSizing: 'border-box',
                backgroundImage: 'linear-gradient(45deg, #92C7CF 30%, #E5E1DA 90%)',
                color: '#071952',
              },
            }}
          >
            <Toolbar />
            <List>
              {pages.map((text) => (
                <ListItem button key={text} onClick={() => handlePageChange(text)}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <AppBar position="fixed" sx={{ backgroundColor: '#92C7CF', color: '#071952' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{
                textAlign: 'center',
                fontFamily: 'Playwrite Espana Decorativa, sans-serif',
                fontWeight: 'bold',
              }}>
                App Todo
              </Typography>
              <Box sx={{ width: 48 }} /> {/* Placeholder to balance the layout */}
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Extra toolbar to push content below AppBar */}
        </>
      ) : (
        <AppBar position="fixed" sx={{ backgroundColor: '#3D5A80', color: 'white' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap component="div" sx={{
              textAlign: 'center',
              fontFamily: 'Playwrite Espana Decorativa, sans-serif',
              fontWeight: 'bold',
              fontSize:'20'
            }}>
              App Todo
            </Typography>
            <List sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', fontSize:'40px', fontWeight:'bold' }}>
              {pages.map((text) => (
                <ListItem button key={text} onClick={() => handlePageChange(text)}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ width: 48 }} /> {/* Placeholder to balance the layout */}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default NavbarComponent;
