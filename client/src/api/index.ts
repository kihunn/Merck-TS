import axios from 'axios'
import { GeneralSample, PSample, Printer, Sample } from './types'

const baseURL = 'http://localhost:5000'

const samplesURL = `${baseURL}/samples`

export const fetchSamples = () => axios.get(samplesURL)
export const createSample = (newSampleData: any) => axios.post(samplesURL, newSampleData)
export const updateSample = (newSapleDate: any) => axios.put(samplesURL, newSapleDate)

const psamplesURL = `${baseURL}/psamples`

export const fetchPSamples = () => axios.get(psamplesURL)
export const createPSample = (newSampleData: any) => axios.post(psamplesURL, newSampleData)
export const updatePSample = (newSapleDate: any) => axios.put(psamplesURL, newSapleDate)

const qrURL = `${baseURL}/qr`

export const createQRCodeKey = (sample: any) => axios.post(`${qrURL}/key`, sample)
export const createLabel = (sample: any) => axios.post(`${qrURL}/label`, sample)

export const fetchPrinters = () => axios.get(`${qrURL}/printers`)
export const printLabels = (base64labels: string[], printer: Printer) => axios.post(`${qrURL}/print`, { base64labels, printer })

const deletedURL = `${baseURL}/deleted`;

export const fetchDeleted = () => axios.get(deletedURL);
export const fetchFullDeleted = () => axios.get(`${deletedURL}/full`);
export const fetchDeletedOfType = (type: string) => axios.get(`${deletedURL}`, { params: { type } });
export const fetchDeletedByAuditID = (audit_id: string) => axios.get(`${deletedURL}`, { params: { audit_id } });
export const fetchDeletedByQRCodeKey = (qr_code_key: string) => axios.get(`${deletedURL}`, { params: { qr_code_key } });
export const createDeleted = (deleted: any) => axios.post(deletedURL, deleted);

const labelsURL = `${baseURL}/labels`;

export const setLabelDesign = (information: any, type: string) => axios.post(labelsURL, { information, type });