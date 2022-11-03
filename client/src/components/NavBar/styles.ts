import { makeStyles } from '@mui/styles'

export default makeStyles((theme) => ({
    appBar: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        /* color: 'rgba(0, 0, 0, 0)' */
        color: 'rgba(0, 137, 119, 255)'
    },
    image: {
        alignItems: 'right',
        marginLeft: '15px'
    }
}));