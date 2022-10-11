import * as api from '../api'

export const getPrinters = () => async (dispatch: any) => {
    try {
        const { data } = await api.getPrinters()

        dispatch({ type: 'FETCH_ALL', payload: data })
    } catch (error: any) {
        console.log(error.message)
    }
}