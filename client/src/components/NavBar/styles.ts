import { makeStyles } from '@mui/styles'
import theme from '../../styles';

export default makeStyles((theme) => ({
    appBar: {
        backgroundColor: 'rgba(0, 0, 0, 255)',
        color: 'rgba(247, 247, 247, 255)',
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        color: 'rgba(0, 133, 124, 255)'
    },
    image: {
        alignItems: 'right',
        marginLeft: '15px',
        display: 'inline',
    }
}));