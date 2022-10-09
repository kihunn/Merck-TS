import express from 'express';
import { createQRCodeKey, createQRCodeLabel } from '../controllers/qr'

const router = express.Router();

router.post('/key', createQRCodeKey)
router.post('/label', createQRCodeLabel)

export default router;