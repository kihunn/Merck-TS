import prisma, { PSample } from "../db";
import KSUID from 'ksuid';
import { generateHashKey } from "../brother/qr";

async function getPSamples(req: any, res: any) {
    const samples = await prisma.psamples.findMany();
    res.status(200).json(samples);
}

async function getPSample(req: any, res: any) {
    const { qr_code_key } = req.params
    try {
        const sample = await prisma.psamples.findUnique({
            where: {
                qr_code_key
            }
        })
        res.status(200).json(sample);
    } catch (error: any) {
        res.status(204).json({ message: `Sample with qr_code_key ${qr_code_key} not found` })
    }
}

async function createPSample(req: any, res: any) {
    const sample = req.body
    try {
        console.log(`Creating psample ${JSON.stringify(sample, null, 4)}`)
        const ksuid = await KSUID.random();

        const newSample = await prisma.psamples.create({
            data: { ...sample, audit_number: ksuid.timestamp }
        })

        res.status(201).json(newSample)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

async function updatePSample(req: any, res: any) {
    const newSample = req.body;
    try {
        // @ts-ignore
        const omitQR: Omit<PSample, 'qr_code_key'> = {};

        for (const key in newSample) {
            if (key != 'qr_code_key') {
                // @ts-ignore
                omitQR[key] = newSample[key];
            }
        }

        const ksuid = await KSUID.random();
        const newQR = generateHashKey(omitQR);
        newSample.qr_code_key = newQR;
        const sample = await prisma.psamples.create({
            data: { ...newSample, audit_id: newSample.audit_id, audit_number: ksuid.timestamp }
        })
        res.status(200).json(sample);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export {
    getPSamples,
    getPSample,
    createPSample,
    updatePSample
}