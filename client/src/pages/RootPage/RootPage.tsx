import { useEffect } from "react";
import { useDispatch } from "react-redux";
import NavBar from "../../components/NavBar/NavBar";

const RootPage = () => {

    // const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // @ts-ignore
        dispatch(getSamples());
        // @ts-ignore
        dispatch(getPrinters())
    }, [dispatch])

    return (
        <>
            <NavBar />
        </>
    );
} 

export default RootPage