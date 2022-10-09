import { generateHashKey, generateLabel } from "../brother/qr";
import { Sample } from "../db";

async function createQRCodeKey(req: any, res: any) {
    const sample: Omit<Sample, 'qr_code_key'> = req.body;
    try {
        const hashKey = generateHashKey(sample);
        res.status(201).json({ qr_code_key: hashKey });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function createQRCodeLabel(req: any, res: any) {
    const sample: Omit<Sample, 'qr_code_key'> = req.body;
    try {
        const labelImage = await generateLabel(sample)
        const buffer = await labelImage.getBufferAsync('image/png')
        const base64 = buffer.toString('base64')
        res.status(201).json({ qr_code_image: base64 });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


export {
    createQRCodeKey,
    createQRCodeLabel
}