import KSUID from "ksuid";
import prisma from "../db";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

interface RequestBody {
    information: LabelLayoutData;
    team: Team;
}

export async function setLabel(req: Request<any, any, RequestBody>, res: Response) {
    const { information, team }: RequestBody = req.body;
    const ksuid: KSUID = await KSUID.random();
    var result = null;

    try {
        result = await prisma.labels.create({
            data: {
                id: ksuid.timestamp,
                team,
                data: <Prisma.InputJsonValue><unknown>information,
            }
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}