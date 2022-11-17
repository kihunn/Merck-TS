import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getPSamples } from '../../../redux/actions/psamples';
import { getPrinters } from '../../../redux/actions/printer';

import NavBar from "../../../components/NavBar/NavBar"

// import useStyles from './styles'
import PSamples from "../../../components/Samples/PSample";

const PSamplesPage = () => {

    // const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // @ts-ignore
        dispatch(getPSamples());
        // @ts-ignore
        dispatch(getPrinters())
    }, [dispatch])

    return (
        <>
            <NavBar/>
            <PSamples />
        </>
    )
}

export default PSamplesPage