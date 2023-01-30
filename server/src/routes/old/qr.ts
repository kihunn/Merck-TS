import express from 'express';
import { createQRCodeKey, createQRCodeLabel, getPrinters, printQRCodeLabel } from '../../controllers/old/qr'

const router = express.Router();

router.post('/key', createQRCodeKey)
router.post('/label/:team', createQRCodeLabel)
router.post('/print', printQRCodeLabel)
router.get('/printers', getPrinters)

export default router;