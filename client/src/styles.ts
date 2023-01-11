import { makeStyles } from '@mui/styles'

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