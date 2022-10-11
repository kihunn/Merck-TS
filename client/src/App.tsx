import React, { useEffect } from 'react';
import msdlogo from './images/msdlogo.png';
import Form from './components/form/form';
import Samples from './components/samples/samples';

import { getSamples } from './redux/actions/samples';
import { getPrinters } from './redux/actions/printer';
import { useDispatch } from 'react-redux';

import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';
import useStyles from './styles'


const App = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // @ts-ignore
        dispatch(getSamples());
        // @ts-ignore
        dispatch(getPrinters())
    }, [dispatch])


    return (
        <Container maxWidth="lg">
            <AppBar className={classes.appBar} position="static" color="inherit">
                <Typography className={classes.heading} variant="h2" align="center">Merck Label Dashboard</Typography>
                <img className={classes.image} src={msdlogo} alt="MSD Logo" height="60" />
            </AppBar>
            <Grow in>
                <Container>
                    <Grid container justifyContent="space-between" alignItems="stretch" spacing={3}>
                        {/* <Grid item xs={12} sm={7}> */}
                            <Samples />
                        {/* </Grid>

                        <Grid item xs={12} sm={4}> */}
                            <Form />
                        {/* </Grid> */}
                    </Grid>
                </Container>
            </Grow>
        </Container>
    )
}

export default App;