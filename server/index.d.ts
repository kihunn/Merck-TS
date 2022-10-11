// brother-label-printer has no type definitions so we declare them here
declare module 'brother-label-printer' {
    export interface Options {
        landscape?: boolean,
        blackwhiteThreshold?: number
    }
    export async function printPngFile(printerUrl: string, filename: string, options?: Options);
    export async function printPngBuffer(printerUrl: string, buffer: Buffer, options?: Options);
}