import IPP from "ipp";

export class BrotherQLPrinter extends IPP.Printer {

    async executeAsync(operation: IPP.PrinterOpertaion, request: IPP.FullRequest): Promise<IPP.FullResponse> {
        return new Promise((resolve, reject) => {
            this.execute(operation, request, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async getAttributes(): Promise<IPP.GetPrinterAttributesResponse> {
        return <IPP.GetPrinterAttributesResponse> (await this.executeAsync('Get-Printer-Attributes', {
            'operation-attributes-tag': {
                "attributes-charset": "utf-8",
                "requesting-user-name": "class"
            }
        }));
    }

    async print(data: Buffer): Promise<IPP.PrintJobResponse> {
        return <IPP.PrintJobResponse> (await this.executeAsync('Print-Job', {
            'operation-attributes-tag': {
                'attributes-charset': 'utf-8',
                'job-name': 'print-job',
                'requesting-user-name': 'class',
                'document-format': 'application/octet-stream',
            },
            'job-attributes-tag': {
                'orientation-requested': 'landscape',
            },
            'data': data
        }));
    }

    async getJobs(): Promise<IPP.GetJobsResponse> {
        return <IPP.GetJobsResponse> (await this.executeAsync('Get-Jobs', {
            'operation-attributes-tag': {
                'requesting-user-name': 'class',
            }
        }));
    }

    async cancelAllJobs(): Promise<IPP.FullResponse | null> {
        const jobs = await this.getJobs();
        var response: IPP.FullResponse | null = null;

        if (jobs['job-attributes-tag']) {
            if (Array.isArray(jobs['job-attributes-tag'])) {
                for (const job of jobs['job-attributes-tag']) {
                    response = await this.executeAsync('Cancel-Job', {
                        'operation-attributes-tag': {
                            'requesting-user-name': 'class',
                            // @ts-ignore
                            'job-id': job['job-id']
                        }
                    });
                }
            } else {
                response = await this.executeAsync('Cancel-Job', {
                    'operation-attributes-tag': {
                        'requesting-user-name': 'class',
                        // @ts-ignore
                        'job-id': jobs['job-attributes-tag']['job-id']
                    }
                });
            }
        }

        return response;
    }

} 