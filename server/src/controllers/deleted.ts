import prisma, { Deleted, PSample, Sample } from "../db";

export async function getDeletedOfType(req: any, res: any) {
    const { type } = req.params;
    try {
        const deleted: Deleted[] = await prisma.deleted.findMany({
            where: {
                type
            }
        });
        res.status(200).json(deleted);
    } catch (error: any) {
        res.status(204).json({ message: `Deleted with type ${type} not found` })
    }
}

export async function getFullDeleted(req: any, res: any) {
    const deleted: Deleted[] = await prisma.deleted.findMany();
    const allDeleted: ((Sample | PSample) & Deleted)[] = [];
    for (const d of deleted) {
        switch (d.type) {
            case "ARND":
                const sample: Sample = (await prisma.samples.findUnique({
                    where: {
                        qr_code_key: d.qr_code_key,
                    }
                }))!;
                allDeleted.push({ ...d, ...sample });
                break;
            case "PSCS":
                const psample: PSample = (await prisma.psamples.findUnique({
                    where: {
                        qr_code_key: d.qr_code_key,
                    }
                }))!;
                allDeleted.push({ ...d, ...psample });
                break;
        }
    }
    res.status(200).json(allDeleted);
}

export async function getDeletedByAuditID(req: any, res: any) {
    const { audit_id } = req.params;
    try {
        const deleted: Deleted | null = await prisma.deleted.findUnique({
            where: {
                audit_id
            }
        });
        res.status(200).json(deleted);
    }
    catch (error: any) {
        res.status(204).json({ message: `Deleted with audit_id ${audit_id} not found` })
    }
}

export async function getDeletedByQRCodeKey(req: any, res: any) {
    const { qr_code_key } = req.params;
    try {
        const deleted: Deleted | null = await prisma.deleted.findUnique({
            where: {
                qr_code_key
            }
        });
        res.status(200).json(deleted);
    } catch (error: any) {
        res.status(204).json({ message: `Deleted with qr_code_key ${qr_code_key} not found` })
    }
}

export async function getDeleted(req: any, res: any) {
    const deleted: Deleted[] = await prisma.deleted.findMany();
    res.status(200).json(deleted);
}

export async function createDeleted(req: any, res: any) {
    const deleted = req.body;
    try {
        const newDeleted = await prisma.deleted.create({
            data: { ...deleted }
        })
        res.status(201).json(newDeleted)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}