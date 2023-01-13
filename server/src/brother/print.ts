import Jimp from 'jimp';
import prisma, { Printer } from '../db';
import { BrotherQLPrinter } from './printer';
import { BrotherQLRaster, Raster } from './raster';

export async function getPrinters(): Promise<Printer[]> {
    return await prisma.printers.findMany();
}

export function formatPrinterURL(printer: Printer) {
    return `http://${printer.ip}:631/ipp/print`;
}

export async function printLabel(base64label: string, printer: Printer) {
    const brotherPrinter = new BrotherQLPrinter(formatPrinterURL(printer));
    const printerAttributes = await brotherPrinter.getAttributes();
    // @ts-ignore
    const mediaName: string = printerAttributes["printer-attributes-tag"]["media-ready"];
    var [width, length] = RegExp(/(\d+)x(\d+)/).exec(mediaName)!.slice(1).map(Number);
    length = length == 0 ? 100 : length;
    
    const image = await Jimp.read(Buffer.from(base64label, 'base64'));
    
    // const raster = new BrotherQLRaster({
    //     media: {
    //         width,
    //         length,
    //         type: "DieCut"
    //     },
    //     image,
    // });
    // const buffer = raster.addAll().buildBuffer();

    const raster = new Raster();
    raster.addAll();
    raster.addPrintData(image);
    const buffer = raster.get();

    await brotherPrinter.print(buffer);
    return true;
}