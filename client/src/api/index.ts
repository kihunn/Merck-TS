import axios from 'axios'

const url = 'http://localhost:5000/samples'

export const fetchSamples = () => axios.get(url)
export const createSample = (newSampleData: any) => {
    return axios.post(url, newSampleData)
} 