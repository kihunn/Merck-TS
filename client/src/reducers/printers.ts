export default (printers: any = [], action: any) => {
    switch (action.type) {
        case 'FETCH_ALL':
            return action.payload;
        default:
            return printers
    }
}