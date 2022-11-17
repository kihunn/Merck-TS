import prisma, { Sample } from "../db";
import KSUID from 'ksuid';
import { generateHashKey } from "../brother/qr";

async function getSamples(req: any, res: any) {
    const samples = await prisma.samples.findMany();
    res.status(200).json(samples);
}

async function getSample(req: any, res: any) {
    const { qr_code_key } = req.params
    try {
        const sample = await prisma.samples.findUnique({
            where: {
                qr_code_key
            }
        })
        res.status(200).json(sample);
    } catch (error: any) {
        res.status(204).json({ message: `Sample with qr_code_key ${qr_code_key} not found` })
    }
}

async function createSample(req: any, res: any) {
    const sample = req.body
    try {
        console.log(`Creating sample ${JSON.stringify(sample, null, 4)}`)
        const ksuid = await KSUID.random();

        const newSample = await prisma.samples.create({
            data: { ...sample, audit_number: ksuid.timestamp }
        })

        res.status(201).json(newSample)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function updateSample(req: any, res: any) {
    const newSample = req.body;
    try {
        // @ts-ignore
        const omitQR: Omit<Sample, 'qr_code_key'> = {};

        for (const key in newSample) {
            if (key != 'qr_code_key') {
                // @ts-ignore
                omitQR[key] = newSample[key];
            }
        }

        const ksuid = await KSUID.random();
        const newQR = generateHashKey(omitQR);
        newSample.qr_code_key = newQR;
        const sample = await prisma.samples.create({
            data: { ...newSample, audit_id: newSample.audit_id, audit_number: ksuid.timestamp }
        })
        res.status(200).json(sample);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export {
    getSamples,
    getSample,
    createSample,
    updateSample
}