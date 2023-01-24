import KSUID from "ksuid";
import prisma from "../db";
import { Prisma } from "@prisma/client";

export async function setLabel(req: any, res: any) {
    const { information, type }: { information: Prisma.JsonArray, type: string } = req.body;
    const ksuid = await KSUID.random();
    console.log(information, type);
    try {
        switch (type) {
            case 'ARND':
                const result = await prisma.labels.create({
                    data: {
                        id: ksuid.timestamp,
                        team: type,
                        data: information,
                    }
                })
                break;

            case 'PSCS':
                break;
        }

        res.status(200).json({ message: "Label design set" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}