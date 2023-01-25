import axios from 'axios'
import { GeneralSample, PSample, Printer, Sample } from './types'
import { Team } from '../constants'

const baseURL = 'http://localhost:5000'

// TODO: Replace any with proper types

const samplesURL = `${baseURL}/arnd_samples`

export const fetchSamples = () => axios.get(samplesURL)
export const createSample = (newSampleData: any) => axios.post(samplesURL, newSampleData)
export const updateSample = (newSapleDate: any) => axios.put(samplesURL, newSapleDate)

const psamplesURL = `${baseURL}/pscs_samples`

export const fetchPSamples = () => axios.get(psamplesURL)
export const createPSample = (newSampleData: any) => axios.post(psamplesURL, newSampleData)
export const updatePSample = (newSapleDate: any) => axios.put(psamplesURL, newSapleDate)

const qrURL = `${baseURL}/qr`

export const createQRCodeKey = (sample: any) => axios.post(`${qrURL}/key`, sample)
export const createLabel = (sample: any, team: Team) => axios.post(`${qrURL}/label/${team}`, sample)

export const fetchPrinters = () => axios.get(`${qrURL}/printers`)
export const printLabels = (base64labels: string[], printer: Printer) => axios.post(`${qrURL}/print`, { base64labels, printer })

const deletedURL = `${baseURL}/deleted`;

export const fetchDeleted = () => axios.get(deletedURL);
export const fetchDeletedByTeam = (team: Team) => axios.get(`${deletedURL}/${team}`)
export const createDeleted = (deleted: any) => axios.post(deletedURL, deleted);

const labelsURL = `${baseURL}/labels`;

export const setLabelDesign = (information: any, type: string) => axios.post(labelsURL, { information, team: type });