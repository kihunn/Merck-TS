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
    expiration_date: string,
    audit_id: string,
    audit_number: number
}

export interface PSample {
    qr_code_key: string,
    sample_name: string,
    mk: string,
    eln_notebook_number: string,
    date_entered: string,
    date_modified: string,
    expiration_date: string,
    audit_id: string,
    audit_number: number
}

export interface Printer {
    ip: string,
    name: string,
    location: string,
    model: string
}

export class TableDoesNotExistError extends Error {
    constructor(tableName: string) {
        super(`Table ${tableName} does not exist`);
    }
}

// export async function dropTable(tableName: string) {
//     return await prisma.$queryRawUnsafe(`DROP TABLE IF EXISTS ${tableName}`);
// }

// export async function createTableIfNotExists(tableName: string, columnNames: string[], columnTypes?: string[]) {
//     if (columnTypes != undefined && columnNames.length != columnTypes.length)
//         throw new Error("Column names and types must be the same length");
//     return await prisma.$queryRawUnsafe(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnNames.map((name: string, index: number) => `${name} ${columnTypes != undefined ? columnTypes[index] : "TEXT"}`).join(", ")})`);
// }

// export async function createTableAlways(tableName: string, columnNames: string[], columnTypes?: string[]) {
//     if (columnTypes != undefined && columnNames.length != columnTypes.length)
//         throw new Error("Column names and types must be the same length");
//     await dropTable(tableName);
//     return await createTableIfNotExists(tableName, columnNames, columnTypes);
// }

// export async function insertInto(tableName: string, columnNames: string[], values: string[]) {
//     if (columnNames.length != values.length)
//         throw new Error("Column names and values must be the same length");
//     try {
//         return await prisma.$queryRawUnsafe(`INSERT INTO ${tableName} (${columnNames.join(", ")}) VALUES (${values.map((value: string) => `'${value}'`).join(", ")})`);
//     } catch (error: any) {
//         if (error.message.includes(`"${tableName}" does not exist`))
//             throw new TableDoesNotExistError(tableName);
//         else
//             throw error;
//     }
// }

export default prisma

