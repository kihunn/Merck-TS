import axios from 'axios'

const samplesURL = 'http://localhost:5000/samples'

export const fetchSamples = () => axios.get(samplesURL)
export const createSample = (newSampleData: any) => {
    return axios.post(samplesURL, newSampleData)
}
export const updateSample = (newSapleDate: any) => {
    return axios.put(samplesURL, newSapleDate)
}

const psamplesURL = 'http://localhost:5000/psamples'

export const fetchPSamples = () => axios.get(psamplesURL)
export const createPSample = (newSampleData: any) => {
    return axios.post(psamplesURL, newSampleData)
}
export const updatePSample = (newSapleDate: any) => {
    return axios.put(psamplesURL, newSapleDate)
}

const qrURL = 'http://localhost:5000/qr'

export const createQRCodeKey = (sample: any) => {
    return axios.post(`${qrURL}/key`, sample)
}
export const createLabel = (sample: any) => {
    return axios.post(`${qrURL}/label`, sample)
}

export const fetchPrinters = () => axios.get(`${qrURL}/printers`)

export const printLabel = (base64label: string, printer: any) => {
    return axios.post(`${qrURL}/print`, { base64label, printer })
}