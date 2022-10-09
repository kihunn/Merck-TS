import prisma from "../db";

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
        const newSample = await prisma.samples.create({
            data: sample
        })
        res.status(201).json(newSample)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export {
    getSamples,
    getSample,
    createSample,
}