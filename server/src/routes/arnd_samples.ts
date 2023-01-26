import express from 'express'
import {
    getARNDSamples,
    getARNDSample,
    createARNDSample,
    updateARNDSample
} from '../controllers/arnd_samples'

const router = express.Router()


/**
 * Returns all samples in the database
 * @method GET
 * @query 
 * * ?deleted=true - returns all samples, including those that have been deleted
 * * ?deleted=false - returns all samples, excluding those that have been deleted
 * * ?newest=true - returns the newest sample for each audit_id
 * * ?newest=false - returns all samples
 */
router.get('/', getARNDSamples)

/**
 * Create a new sample that is added to the database 
 * 
 */
router.post('/', createARNDSample)

/**
 * Updates a given sample
 */
router.put('/', updateARNDSample)

// get /samples/:qr_code_key
router.get('/:qr_code_key', getARNDSample)

export default router