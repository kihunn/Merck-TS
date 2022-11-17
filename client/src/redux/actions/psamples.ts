import * as api from '../../api';
import { PSAMPLE } from '../constants';

export const getPSamples = () => async (dispatch: any) => {
    try {
        const { data } = await api.fetchPSamples();

        dispatch({ type: PSAMPLE.FETCH_ALL, payload: data });
    } catch (error: any) {
        console.log(error.message)
    }
}

export const createPSample = (sampleData: any) => async (dispatch: any) => {
    try {
        const { data } = await api.createPSample(sampleData);

        dispatch({ type: PSAMPLE.CREATE, payload: data });
    } catch (error: any) {
        console.log(error.message)
    }
}