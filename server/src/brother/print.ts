const brother = require('brother-label-printer')
import prisma, { Printer } from '../db';
import ipp from 'ipp'


export async function getPrinters(): Promise<Printer[]> {
    return await prisma.printers.findMany();
}

export function formatPrinterURL(printer: Printer) {
    return `http://${printer.ip}:631/ipp/print`;
}

export async function printLabel(base64label: string, printer: Printer) {
    const printerURL = formatPrinterURL(printer);
    const _printer = new ipp.Printer(printerURL);
    const imageData = Buffer.from(base64label, 'base64')
    const img = await brother.parseBuffer(imageData);
    const printData = await brother.convert(img)

    var print: ipp.PrintJobRequest = {
        "operation-attributes-tag": {
            "requesting-user-name": "merck",
            "job-name": "test",
            "document-format": "application/octet-stream"
        },
        data: printData,
        "job-attributes-tag": {
            "copies": 1,
            "sides": "one-sided",
            "number-up": 1,
            "orientation-requested": "landscape",
        }
    }

    var job_id = 0

    try {
        _printer.execute("Print-Job", print, (err: any, res: any) => {
            if (err) {
                console.log(err)
            } else {
                job_id = res["job-attributes-tag"]["job-id"]
                console.log("Job ID: " + job_id)
            }
        });
        // await new Promise((resolve: (value: void) => void, reject) => {
        //     _printer.execute('Create-Job', print, (err: any, res: ipp.FullResponse) => {
        //         if (err) {
        //             console.log(err)
        //             reject()
        //         } else {
        //             console.log(res);
        //             // @ts-ignore
        //             job_id = res['job-attributes-tag']['job-id']
        //             console.log(job_id)
        //             resolve()
        //         }
        //     })
        // })

        // var send_msg: ipp.SendDocumentRequest = {
        //     "operation-attributes-tag": {
        //       "job-id": job_id,
        //       "requesting-user-name": "John Doe",
        //       "document-format": 'application/octet-stream',
        //       "last-document": true
        //     },
        //     data: imageData
        // };


        // await new Promise((resolve: (value: void) => void, reject) => {
        //     _printer.execute('Send-Document', send_msg, (err: any, res: ipp.FullResponse) => {
        //         if (err) {
        //             console.log(err);
        //             reject()
        //         } else {
        //             console.log(res);
        //             resolve();
        //         }
        //     })
        // })

        // await printPngBuffer(printerURL, buffer);
        return true;
    } catch (error: any) {
        console.log(error)
        return false;
    }
}