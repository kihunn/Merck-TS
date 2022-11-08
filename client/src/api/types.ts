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

export interface Printer {
    ip: string,
    name: string,
    location: string,
    model: string
}