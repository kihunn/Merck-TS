import { PrismaClient } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient()

export interface Sample {
    qr_code_key: string,
    sample_id: String,
    experiment_id: string,
    storage_condition: string,
    contents: string,
    analyst: string,
    date_entered: string,
    date_modified: string,
    expiration_date: string
}

export interface PSample {
    qr_code_key: string,
    sample_name: String,
    MK: string,
    ELNnotebooknumber: string,
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

