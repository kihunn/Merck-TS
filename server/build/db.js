"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * This was some code I wrote to generate a table in the database with a given name and columns.
 * Though it could potentially be used by some sort of admin dashboard but it's not necessary
 * and could result in some vulnerabilities or non-compliance.
 */
// export class TableDoesNotExistError extends Error {
//     constructor(tableName: string) {
//         super(`Table ${tableName} does not exist`);
//     }
// }
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
exports.default = prisma;
