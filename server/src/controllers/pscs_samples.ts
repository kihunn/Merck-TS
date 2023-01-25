import prisma from "../db";
import KSUID from 'ksuid';
import { generateHashKey } from "../brother/qr";
import { Request, Response } from "express";

/**
 * Returns an array of all PSCS samples in the database
 * @param req 
 * @param res 
 */
export async function getPSCSSamples(req: Request, res: Response) {
    const samples = await prisma.psamples.findMany();
    res.status(200).json(samples);
}

/**
 * Retrieves a specific PSCS sample from the database
 * @param req params: qr_code_key - the qr_code_key of the sample to be returned
 * @param res Contains the sample with the specified qr_code_key
 * @returns
 * * 200 - The sample with the specified qr_code_key
 * * 204 - The sample with the specified qr_code_key was not found
 * * 500 - An error occurred while retrieving the sample
 */
export async function getPSCSSample(req: Request, res: Response) {
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


/**
 * Creates a new PSCS sample in the database
 * @param req body: the unhashed sample information to generate a qr_code_key for and add to the database
 * @param res The newly created sample
 * @returns
 * * 201 - The sample was successfully created
 * * 500 - An error occurred while creating the sample
 */
export async function createPSCSSample(req: Request, res: Response) {
    const sample = req.body
    try {
        const ksuid = await KSUID.random();

        const newSample = await prisma.psamples.create({
            data: { ...sample, audit_number: ksuid.timestamp }
        })

        res.status(201).json(newSample)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

/**
 * Takes in sample information, generates the new qr_code_key, and adds it to the database.
 * * Note: This function does not actually use the update operation. It creates a new sample in the databse with the new information and returns it.
 * * This is required by merck for compliance reasons. 
 * * The audit_id of updated samples is retained, but the audit_number is changed to the current KSUID timestamp.
 * * This means that the audit_id is unique, but the audit_number is not and all samples with the same audit_id are different versions of the same sample.
 * @param req The body should contain the new sample information
 * @param res The newly created sample 
 */
export async function updatePSCSSample(req: Request, res: Response) {
    const newSample: PSCSSample = req.body;
    try {
        const unhashedNewSample: UnhashedPSCSSample | {} = {};

        for (const key in newSample) {
            if (key != 'qr_code_key') {
                // @ts-ignore
                unhashedNewSample[key] = newSample[key];
            }
        }

        const ksuid = await KSUID.random();

        // Generate a new qr_code_key based off of the contents of the new sample
        // We have to do this because the payload in req.body contains the old qr_code_key
        const newQR = generateHashKey(unhashedNewSample as UnhashedPSCSSample);
        newSample.qr_code_key = newQR;

        const sample = await prisma.psamples.create({
            data: {
                ...newSample,
                audit_id: newSample.audit_id,
                audit_number: ksuid.timestamp
            }
        })

        res.status(200).json(sample);
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}