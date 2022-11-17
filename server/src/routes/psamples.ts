import express from 'express'
import {
    getPSamples,
    getPSample,
    createPSample,
    updatePSample
} from '../controllers/psamples'

const router = express.Router()

/**
 * Returns all psamples in the database
 * @method GET
 */
router.get('/', getPSamples)

/**
 * Create a new psample that is added to the database 
 * 
 */
router.post('/', createPSample)

/**
 * Updates a given psample
 */
router.put('/', updatePSample)

// get /psamples/:qr_code_key
router.get('/:qr_code_key', getPSample)

export default router