import * as api from '../../api'
import { PRINTER } from '../constants'

export const getPrinters = () => async (dispatch: any) => {
    try {
        const { data } = await api.fetchPrinters()

        dispatch({ type: PRINTER.FETCH_ALL, payload: data })
    } catch (error: any) {
        console.log(error.message)
    }
}