import express from 'express'
import {
    getPSCSSamples,
    getPSCSSample,
    createPSCSSample,
    updatePSCSSample
} from '../controllers/pscs_samples'

const router = express.Router()

/**
 * Returns all psamples in the database
 * @method GET
 */
router.get('/', getPSCSSamples)

/**
 * Create a new psample that is added to the database 
 * 
 */
router.post('/', createPSCSSample)

/**
 * Updates a given psample
 */
router.put('/', updatePSCSSample)

// get /psamples/:qr_code_key
router.get('/:qr_code_key', getPSCSSample)

export default router