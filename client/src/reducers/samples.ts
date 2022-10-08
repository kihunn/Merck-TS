export default (samples: any = [], action: any) => {
    switch (action.type) {
        case 'CREATE':
            return [...samples, action.payload]
        case 'FETCH_ALL':
            return action.payload;
        default:
            return samples;
    }
}