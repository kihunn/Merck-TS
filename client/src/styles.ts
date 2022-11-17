import { makeStyles } from '@mui/styles'
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(0, 133, 124, 255)'
        },
        secondary: {
            main: 'rgba(255, 255, 255, 255)'
        },
        error: {
            main: 'rgba(12, 35, 64, 255)'
        },
        warning: {
            main: 'rgba(110, 206, 178, 255)'
        },
        info: {
            main: 'rgba(247, 247, 247, 247)'
        },
    },
});

export default makeStyles(() => ({
    appBar: {
        backgroundColor: 'rgba(200, 200, 200, 1)',
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        color: 'rgba(0, 137, 119, 255)'
    },
    image: {
        alignItems: 'right',
        marginLeft: '15px'
    }
}));