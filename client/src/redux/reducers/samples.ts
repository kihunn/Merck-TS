import { SAMPLE } from '../constants'

export default (samples: any = [], action: any) => {
    switch (action.type) {
        case SAMPLE.CREATE:
            return [...samples, action.payload]
        case SAMPLE.FETCH_ALL:
            return action.payload;
        default:
            return samples;
    }
}