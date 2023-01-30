import { PrismaClient } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient()

// Main purpose of this is to keep have a single source of truth for the status values when creating or deleteing.
// Use STATUS.CREATE when creating a new record.
// Use STATUS.DELETE when deleting a record.
// By summing status values, we can deduce whether the record is active or not. 
// - If the sum is 1, the record is active. else, it is not.
export const STATUS = {
    CREATE: 1, 
    DELETE: -1
} as const;

export const teamIsActive = async (team: string) => {
    const teamExists = await prisma.team.groupBy({
        by: ['name'],
        where: {
            name: team,
        },
        _sum: {
            status: true
        }
    });

    return teamExists.length > 0 && teamExists[0]._sum.status === 1;
}


export default prisma;

