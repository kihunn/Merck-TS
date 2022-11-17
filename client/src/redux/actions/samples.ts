import * as api from '../../api';
import { SAMPLE } from '../constants';

export const getSamples = () => async (dispatch: any) => {
    try {
        const { data } = await api.fetchSamples();

        dispatch({ type: SAMPLE.FETCH_ALL, payload: data });
    } catch (error: any) {
        console.log(error.message)
    }
}

export const createSample = (sampleData: any) => async (dispatch: any) => {
    try {
        const { data } = await api.createSample(sampleData);

        dispatch({ type: SAMPLE.CREATE, payload: data });
    } catch (error: any) {
        console.log(error.message)
    }
}