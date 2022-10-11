const { printPngBuffer } = require('brother-label-printer')
import prisma, { Printer } from '../db';

export async function getPrinters(): Promise<Printer[]> {
    return await prisma.printers.findMany();
}

export function formatPrinterURL(printer: Printer) {
    return `http://${printer.ip}:631/ipp/print`;
}

export async function printLabel(base64label: string, printer: Printer) {
    const printerURL = formatPrinterURL(printer);
    const buffer = Buffer.from(base64label, 'base64')
    try {
        await printPngBuffer(printerURL, buffer);
        return true;
    } catch (error: any) {
        console.log(error)
        return false;
    }
}