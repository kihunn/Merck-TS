import { AppBar, Typography, Button, Container, Grow, Box, Toolbar, IconButton, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import CreateIcon from '@mui/icons-material/Create';
import PageviewIcon from '@mui/icons-material/Pageview';
import TrashIcon from '@mui/icons-material/Delete';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';

import msdlogo from '../../images/msdlogo.png'
import { Link } from 'react-router-dom';
import "./styles.css";
import React, { useState } from 'react';
import { Home } from '@mui/icons-material';

const NavBar: React.FC<React.PropsWithChildren> = ({ children }: React.PropsWithChildren) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const toggleDrawer = () => {
        setIsSideBarOpen(!isSideBarOpen);
    }

    const Sidebar = () => {
        return (
            <Box
                sx={{ width: 300 }}
                role="presentation"
                onClick={toggleDrawer}
                onKeyDown={toggleDrawer}
            >
                <List>
                    <ListItem key={"home"} disablePadding>
                        <ListItemButton>
                            <Link to="/" className="link-button">
                                <ListItemIcon>
                                    <Home />
                                    <Typography variant="h6" color="primary">
                                        Home
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>

                    </ListItem>
                    <ListItem key={"editor"} disablePadding>
                        <ListItemButton style={{ textAlign: "center" }}>
                            <Link to="/editor" className="link-button">
                                <ListItemIcon>
                                    <FormatShapesIcon />
                                    <Typography variant="h6" align="center" color="primary" component="div">
                                        Label Editor
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider />
                
                <List>
                    <ListItem key={"arnd-header"}>
                        <Typography variant="h5" align="center" color="primary" component="div">
                            AR&D Team
                        </Typography>
                    </ListItem>
                    <ListItem key={"samples-table"} disablePadding>
                        <ListItemButton>
                            <Link to="/samples" className="link-button">
                                <ListItemIcon>
                                    <PageviewIcon />
                                    <Typography variant="h6" align="center" color="primary" component="div">
                                        View Samples
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"samples-form"} disablePadding>
                        <ListItemButton>
                            <Link to="/samples/create" className="link-button">
                                <ListItemIcon>
                                    <CreateIcon />
                                    <Typography variant="h6" align="center" color="primary" component="div">
                                        Create Sample
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"samples-deleted"} disablePadding>
                        <ListItemButton>
                            <Link to="/samples/deleted" className="link-button">
                                <ListItemIcon>
                                    <TrashIcon />
                                    <Typography variant="h6" align="center" color="primary" component="div">
                                        View Deleted Samples
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider />

                <List>
                    <ListItem key={"pcsc-header"}>
                        <Typography variant="h5" align="center" color="primary" component="div">
                            PCSC Team
                        </Typography>
                    </ListItem>
                    <ListItem key={"psamples-table"} disablePadding>
                        <ListItemButton>
                            <Link to="/psamples" className="link-button">
                                <ListItemIcon>
                                    <PageviewIcon />
                                    <Typography variant="h6" align="center" color="primary" component="div">
                                        View Samples
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"psamples-form"} disablePadding>
                        <ListItemButton>
                            <Link to="/psamples/create" className="link-button">
                                <ListItemIcon>
                                    <CreateIcon />
                                    <Typography variant="h6" align="center" color="primary" component="div">
                                        Create Sample
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"psamples-deleted"} disablePadding>
                        <ListItemButton>
                            <Link to="/psamples/deleted" className="link-button">
                                <ListItemIcon>
                                    <TrashIcon />
                                    <Typography variant="h6" align="center" color="primary" component="div">
                                        View Deleted Samples
                                    </Typography>
                                </ListItemIcon>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                </List>

            </Box>
        )
    }

    return (        
        <Container>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="inherit" style={{ padding: '10px', margin: '10px' }}>
                    <Toolbar className="nav-toolbar">
                        <React.Fragment key={"sidebar"}>
                            <IconButton
                                size="large"
                                edge="start"
                                aria-label="menu"
                                onClick={toggleDrawer} 
                                onKeyDown={toggleDrawer}
                            >
                                <MenuIcon />
                            </IconButton>   
                            <Drawer
                                anchor={"left"}
                                open={isSideBarOpen}
                                onClose={toggleDrawer}
                            >
                                <Sidebar />
                            </Drawer>   
                        </React.Fragment>

                        <Typography variant="h4" align="center" color="primary" component="div">
                            Merck Label Dashboard
                        </Typography>

                        <div className="msg-image-container">
                        <Link to="/">
                            <img src={msdlogo} alt="MSD Logo" height="60"/>
                        </Link>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <Grow>
                <Container>
                    {children}
                </Container>
            </Grow>
        </Container>
    )
}

export default NavBar