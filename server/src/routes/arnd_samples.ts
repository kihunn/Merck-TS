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