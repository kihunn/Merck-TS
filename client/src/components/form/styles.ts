import { makeStyles } from "@mui/styles";

export default makeStyles(() => ({
    root: {
      '& .MuiTextField-root': {
        margin: 1,
      },
    },
    paper: {
      backgroundColor: 'rgba(200, 200, 200, 1)',
        // @ts-ignore
      padding: 10,
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    fileInput: {
      width: '97%',
      margin: '10px 0',
    },
    buttonSubmit: {
      marginBottom: 10,
    },
  }));