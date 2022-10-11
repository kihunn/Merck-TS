import { PrismaClient } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient()

export interface Sample {
    qr_code_key: string,
    experiment_id: string,
    storage_condition: string,
    contents: string,
    analyst: string,
    date_entered: string,
    date_modified: string,
    expiration_date: string
}

export interface Printer {
    ip: string,
    name: string,
    location: string,
    model: string
}

export default prisma

