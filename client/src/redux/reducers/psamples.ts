import { PSAMPLE } from '../constants'

export default (samples: any = [], action: any) => {
    switch (action.type) {
        case PSAMPLE.CREATE:
            return [...samples, action.payload]
        case PSAMPLE.FETCH_ALL:
            return action.payload;
        default:
            return samples;
    }
}