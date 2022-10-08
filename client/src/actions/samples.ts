import * as api from '../api';

export const getSamples = () => async (dispatch: any) => {
    try {
        const { data } = await api.fetchSamples();

        dispatch({ type: 'FETCH_ALL', payload: data });
    } catch (error: any) {
        console.log(error.message)
    }
}

export const createSample = (sampleData: any) => async (dispatch: any) => {
    try {
        const { data } = await api.createSample(sampleData);

        dispatch({ type: 'CREATE', payload: data });
    } catch (error: any) {
        console.log(error.message)
    }
}