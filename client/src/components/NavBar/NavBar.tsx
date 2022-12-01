import { AppBar, Typography, Button, Container, Grow } from '@mui/material';
import useStyles from './styles'
import msdlogo from '../../images/msdlogo.png'
import { Link } from 'react-router-dom';

const NavBar = (props: any) => {
    const classes = useStyles()

    const linkStyle = {
        textDecoration: 'none',
        color: 'white'
    }

    return (        
        <Container>
            <AppBar className={classes.appBar} position="static" color="inherit">
                <Typography className={classes.heading} variant="h2" align="center">Merck Label Dashboard</Typography>
                <img className={classes.image} src={msdlogo} alt="MSD Logo" height="60" />
                
                <div>
                    <Button
                        variant='contained'
                    >
                        <Link to="/" style={linkStyle}>Home</Link>
                    </Button>
                </div>

                <div>
                    <Button
                        variant='contained'
                    >
                        <Link to="/psamples" style={linkStyle}>View Samples - Pharmaceutical Team</Link>
                    </Button>
                    <span></span>
                    <Button
                        variant='contained'
                    >
                        <Link to="/psamples/create" style={linkStyle}>Create Sample - Pharmaceutical Team</Link>
                    </Button> 
                </div>

                <div>
                    <Button
                        variant='contained'
                    >
                        <Link to="/samples" style={linkStyle}>View Samples - AR&D Team</Link>
                    </Button>
                    <span></span>
                    <Button
                        variant='contained'
                    >
                        <Link to="/samples/create" style={linkStyle}>Create Sample - AR&D Team</Link>
                    </Button>   
                </div> 


            </AppBar>
            <Grow>
                <Container>
                    {props.children}
                </Container>
            </Grow>
        </Container>
    )
}

export default NavBar