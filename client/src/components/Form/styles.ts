import { makeStyles } from "@mui/styles";

export default makeStyles(() => ({
  root: {
    '& .MuiTextField-root': {
      margin: 1,
    },
  },
  paper: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // @ts-ignore
    padding: 10,
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
}));
