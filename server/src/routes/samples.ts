import express from 'express'
import {
    getSamples,
    getSample,
    createSample
} from '../controllers/samples'

const router = express.Router()

router.get('/', getSamples)
router.post('/', createSample)
router.get('/:qr_code_key', getSample)

export default router