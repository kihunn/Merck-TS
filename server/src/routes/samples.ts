import express from 'express'
import {
    getSamples,
    getSample,
    createSample
} from '../controllers/samples'

const router = express.Router()


/**
 * Returns all samples in the database
 * @method GET
 */
router.get('/', getSamples)

/**
 * Create a new sample that is added to the database 
 * 
 */
router.post('/', createSample)

// get /samples/:qr_code_key
router.get('/:qr_code_key', getSample)

// post /samples/:qr_code_key/print/:printer_ip
router.post('/:qr_code_key/print/:printer_ip')

export default router