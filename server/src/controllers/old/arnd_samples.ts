import prisma from "../../db";
import KSUID from 'ksuid';
import { generateHashKey } from "../../brother/qr";
import { Request, Response } from "express";

/**
 * Returns all samples in the database
 * @method GET
 * @query 
 * * ?deleted=true - returns all samples, including those that have been deleted (this includes deleted samples, it is not only deleted samples)
 * * ?deleted=false - returns all samples, excluding those that have been deleted
 * * ?newest=true - returns the newest sample for each audit_id
 * * ?newest=false - returns all samples
 */
export async function getARNDSamples(req: Request, res: Response) {
    const { deleted: queryDeleted, newest: queryNewest } = req.query as { deleted?: string, newest?: string };

    const deleted = queryDeleted === undefined ? false : queryDeleted === 'true';
    const newest = queryNewest === undefined ? true : queryNewest === 'true';

    // Gets every samples stored in the database
    // This will return every version of every sample, including those that have been deleted
    if (deleted && !newest) {
        const samples = await prisma.samples_old.findMany();
        return res.status(200).json(samples);
    }

    // This is required by the three queries below
    const deletedAuditIDs = (await prisma.deleted.findMany({
        select: {
            audit_id: true
        }
    })).map((_) => _.audit_id);

    // Gets the newest smaples, including those that have been deleted
    if (deleted && newest) {
        // Broken
        const deletedSamples = await prisma.samples_old.findMany({
            where: {
                audit_id: {
                    in: deletedAuditIDs
                }
            }
        });

        const groupedSamples = await prisma.samples_old.groupBy({
            by: ['audit_id'],
            where: {
                audit_id: {
                    notIn: deletedAuditIDs
                }
            },
            _max: {
                audit_number: true
            }
        });

        const newestSamples = await prisma.samples_old.findMany({
            where: {
                audit_id: {
                    in: groupedSamples.map((_) => _.audit_id)
                },
                audit_number: {
                    in: groupedSamples.map((_) => _._max.audit_number) as number[]
                }
            }
        });

        return res.status(200).json([...deletedSamples, ...newestSamples]);
    }

    // Gets the newest samples that have not been deleted
    // This will be the most common type of request
    if (!deleted && newest) {
        const groupedSamples = await prisma.samples_old.groupBy({
            by: ['audit_id'],
            where: {
                audit_id: {
                    notIn: deletedAuditIDs
                }
            },
            _max: {
                audit_number: true
            }
        });

        const samples = await prisma.samples_old.findMany({
            where: {
                audit_id: {
                    in: groupedSamples.map((_) => _.audit_id)
                },
                audit_number: {
                    in: groupedSamples.map((_) => _._max.audit_number) as number[]
                }
            }
        });

        return res.status(200).json(samples);
    }

    // Gets all samples that havent been deleted
    if (!deleted && !newest) {
        const samples = await prisma.samples_old.findMany({
            where: {
                audit_id: {
                    notIn: deletedAuditIDs
                }
            }
        });

        return res.status(200).json(samples);
    }

}

/**
 * Retrieves a specific ARND sample from the database
 * @param req params: qr_code_key - the qr_code_key of the sample to be returned
 * @param res Contains the sample with the specified qr_code_key
 * @returns
 * * 200 - The sample with the specified qr_code_key
 * * 204 - The sample with the specified qr_code_key was not found
 * * 500 - An error occurred while retrieving the sample 
 */
export async function getARNDSample(req: Request, res: Response) {
    const { qr_code_key } = req.params
    try {
        const sample = await prisma.samples_old.findUnique({
            where: {
                qr_code_key
            }
        });

        // If the sample didnt exist, respond with a 404 (Not Found) and return from the function
        if (sample === null)
            return res.status(404).json({ message: `Sample with qr_code_key ${qr_code_key} not found` })

        res.status(200).json(sample);
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

/**
 * Creates a new ARND sample based on the given information
 * @param req The body should contain the sample information
 * @param res The newly created sample
 * @returns
 * * 201 - The sample was successfully created
 * * 500 - An error occurred while creating the sample
 */
export async function createARNDSample(req: Request, res: Response) {
    const sample: ARNDSample = req.body;

    try {
        const ksuid = await KSUID.random();

        // If the sample doesnt have a qr_code_key, generate one.
        // This is currently done in the client but may be removed in the future.
        // This is done here to ensure that the qr_code_key is always generated
        if (sample.qr_code_key === undefined)
            sample.qr_code_key = generateHashKey(sample);

        const newSample = await prisma.samples_old.create({
            data: {
                ...sample,
                audit_number: ksuid.timestamp
            }
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
export async function updateARNDSample(req: Request, res: Response) {
    const newSample: ARNDSample = req.body;

    try {
        var unhashedNewSample: UnhashedARNDSample | {} = {};

        for (const key in newSample) {
            if (key !== 'qr_code_key')
                // @ts-ignore
                unhashedNewSample[key] = newSample[key];
        }

        const ksuid = await KSUID.random();

        // Generate a new qr_code_key based off of the contents of the new sample
        // We have to do this because the payload in req.body contains the old qr_code_key
        const newQR = generateHashKey(unhashedNewSample as UnhashedPSCSSample);
        newSample.qr_code_key = newQR;

        const sample = await prisma.samples_old.create({
            data: { ...newSample, audit_id: newSample.audit_id, audit_number: ksuid.timestamp }
        })

        res.status(200).json(sample);
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
