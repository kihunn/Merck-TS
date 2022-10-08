import prisma from "../db";
import { DateTime } from "luxon";

async function getSamples(req: any, res: any) {
    const samples = await prisma.samples.findMany();
    res.status(200).json(samples);
}

function getSample(req: any, res: any) {

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