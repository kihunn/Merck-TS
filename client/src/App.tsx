import react from 'react';
import msdlogo from './images/msdlogo.png';
import Form from './components/form/form';
import Samples from './components/samples/samples';

import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';

const App = () => {
    return (
        <Container maxWidth="lg">
            <AppBar position="static" color="inherit">
                <Typography variant="h2" align="center">Merck Label Dashboard</Typography>
                <img src={msdlogo} alt="MSD Logo" height="60" />
            </AppBar>
            <Grow in>
                <Container>
                    <Grid container justifyContent="space-between" alignItems="stretch" spacing={3}>
                        <Grid item xs={12} sm={7}>
                            <Samples />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Form />
                        </Grid>
                    </Grid>
                </Container>
            </Grow>
        </Container>
    )
}

export default App;