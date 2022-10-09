import axios from 'axios'

const samplesURL = 'http://localhost:5000/samples'

export const fetchSamples = () => axios.get(samplesURL)
export const createSample = (newSampleData: any) => {
    return axios.post(samplesURL, newSampleData)
} 

const qrURL = 'http://localhost:5000/qr'

export const createQRCodeKey = (sample: any) => {
    return axios.post(`${qrURL}/key`, sample)
}
export const createLabel = (sample: any) => {
    return axios.post(`${qrURL}/label`, sample)
}