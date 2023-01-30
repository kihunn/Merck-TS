import { generateHashKey, generateLayoutLabel } from "../../brother/qr";
import { printLabels } from "../../brother/print";
import prisma from "../../db";

const labelCache: { [key: string]: string } = {};

async function createQRCodeKey(req: any, res: any) {
    const sample: Omit<ARNDSample, 'qr_code_key'> = req.body;
    try {
        const hashKey = generateHashKey(sample);
        res.status(201).json({ qr_code_key: hashKey });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function createQRCodeLabel(req: any, res: any) {
    const sample: ARNDSample = req.body;
    const { team } = req.params;
    try {
        if (labelCache[sample.qr_code_key]) {
            res.status(201).json({ qr_code_image: labelCache[sample.qr_code_key] });
        } else {
            // This generates the hard coded label that looks good right now
            // const labelImage = await generateLabel(sample)
            const labelImage = await generateLayoutLabel(sample, team);
            const buffer = await labelImage.getBufferAsync('image/png')
            const base64 = buffer.toString('base64')
            labelCache[sample.qr_code_key] = base64;
            res.status(201).json({ qr_code_image: base64 });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function printQRCodeLabel(req: any, res: any) {
    const data = req.body;
    const base64labels = data.base64labels;
    const printer: Printer = data.printer;
    try {
        const success = await printLabels(base64labels, printer)
        res.status(200).json({ success });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function getPrinters(req: any, res: any) {
    const printers = await prisma.printers.findMany()
    res.status(200).json(printers)
}


export {
    createQRCodeKey,
    createQRCodeLabel,
    getPrinters,
    printQRCodeLabel
}