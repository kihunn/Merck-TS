import { AppBar, Typography, Button, Container, Grow, Box, Toolbar } from '@mui/material';
import useStyles from './styles'
import msdlogo from '../../images/msdlogo.png'
import { Link } from 'react-router-dom';
import "./styles.css";

const NavBar = (props: any) => {
    // const classes = useStyles()

    const linkStyle = {
        textDecoration: 'none',
        color: 'white'
    }

    return (        
        <Container>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="inherit" style={{ padding: '10px', margin: '10px' }}>
                    <Toolbar>
                        <Typography variant="h4" align="center" color="primary" component="div">
                            Merck Label Dashboard
                        </Typography>

                        {/* <Button
                            variant='contained'
                        >
                            <Link to="/" style={linkStyle}>Home</Link>
                        </Button> */}

                        <div className="app-toolbar-button-container">
                            <Button
                                variant='contained'
                            >
                                <Link to="/psamples" style={linkStyle}>View Samples - Pharmaceutical Team</Link>
                            </Button>

                            <Button
                                variant='contained'
                            >
                                <Link to="/psamples/create" style={linkStyle}>Create Sample - Pharmaceutical Team</Link>
                            </Button>

                            <Button
                                variant='contained'
                            >
                                <Link to="/samples" style={linkStyle}>View Samples - AR&D Team</Link>
                            </Button>

                            <Button
                                variant='contained'
                            >
                                <Link to="/samples/create" style={linkStyle}>Create Sample - AR&D Team</Link>
                            </Button>  
                        </div> 

                        <Link to="/" style={linkStyle}>
                            <img src={msdlogo} alt="MSD Logo" height="60"/>
                        </Link>
                    </Toolbar>
                </AppBar>
            </Box>
            <Grow>
                <Container>
                    {props.children}
                </Container>
            </Grow>
        </Container>
    )
}

export default NavBar