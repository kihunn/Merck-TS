import { PRINTER } from '../constants'

export default (printers: any = [], action: any) => {
    switch (action.type) {
        case PRINTER.FETCH_ALL:
            console.log(action.payload)
            return action.payload;
        default:
            return printers
    }
}