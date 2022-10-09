import { PrismaClient } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient()

export interface Sample {
    qr_code_key: string,
    expirement_id: string,
    storage_condition: string,
    contents: string,
    analyst: string,
    date_entered: string,
    date_modified: string,
    expiration_date: string
}

export default prisma

