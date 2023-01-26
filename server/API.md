# Merck Label Dashboard API Guide

# Introduction
One of the first things I believe imperative to do if you are new to this api is to get in touch with the common types we use. You can think of these as a typescript interface we use or the structure of the JSON data that is accepted and returned by our api. In our case we are most commonly dealing with samples. Currently we have three "types" of samples, a `GeneralSample`, `ARNDSample`, `PSCSSample`. The `GeneralSample` defines what properties `ALL` samples have regardless of the team it is for. The `ARND` and `PSCS` samples are team specific samples with properties provided my merck. Below I will define the structure of the samples in typescript interfaces.

### Types

```typescript
interface GeneralSample {
    qr_code_key: string,
    audit_id: string,
    audit_number: number,
    date_entered: string,
    date_modified: string,
    expiration_date: string,
}
```

```typescript
interface ARNDSample extends GeneralSample {
    experiment_id: string,
    storage_condition: string,
    contents: string,
    analyst: string,
}
```

```typescript
interface PSCSSample extends GeneralSample {
    sample_name: string,
    mk: string,
    eln_notebook_number: string,
}
```

One thing to note is that you will never encounter an endpoint the request or responds with the general sample model.

# Endpoints

## `GET` /samples 

### Note on *`GET` /samples*
To adhere to Merck guidlines and standard compliance policies, all samples are stored in the same database table. That means all versions of samples as well as deleted samples are stored in the same table. This is the leading factor behind the decision for this route to have query paramaters. With that said, you will see examples of requests using those query parameters below as well as specific details on what each do. 
- Directly below are the `default values` for those parameters.

```typescript
disabled = false;
newest = true;
```

Example Request
```typescript
const { data } = await axios.get(`${HOST}/samples`)
```
Example Response
```json
[
    {
        "qr_code_key": "e3f949db",
        "experiment_id": "TES",
        "storage_condition": "Freezing",
        "contents": "NaCl",
        "analyst": "Abraham Lincoln",
        "date_entered": "2023-01-26",
        "date_modified": "2023-01-26",
        "expiration_date": "2023-02-28",
        "audit_id": "e5ac40a1-b65d-4ae3-a1ea-2fd68fc2e150",
        "audit_number": 274701609
    },
    {
        "qr_code_key": "8eba87d6",
        "experiment_id": "LOP",
        "storage_condition": "Ground",
        "contents": "Seed",
        "analyst": "Thomas",
        "date_entered": "2023-01-26",
        "date_modified": "2023-01-26",
        "expiration_date": "2023-01-31",
        "audit_id": "9439490a-2ff1-4fa4-8321-564b7bb43544",
        "audit_number": 274701643
    },
    {
        "qr_code_key": "230df1b5",
        "experiment_id": "KLO",
        "storage_condition": "Unknown",
        "contents": "Cellulite",
        "analyst": "Thomas",
        "date_entered": "2023-01-25",
        "date_modified": "2023-01-26",
        "expiration_date": "2023-01-12",
        "audit_id": "18d75b71-2f71-400c-b6a6-b7c697aca89a",
        "audit_number": 274701655
    }
]
```

## `GET` /samples?deleted={boolean}
- TODO

## `GET` /samples?newest={boolean}
- TODO

## `POST` /samples
Example Request
```typescript
/**
 * Required Fields
 * - [ "experiment_id", "storage_condition", "contents", "analyst"
 *     "date_entered", "date_modified", "expiration_date" ]
 * 
 * Generated Fields 
 * - [ "qr_code_key", "audit_id", "audit_number" ]
 */
const sampleData = {
    experiment_id: "TES",
    storage_condition: "Freezing",
    contents: "NaCl",
    analyst: "Abraham Lincoln",
    date_entered: "2023-01-26",
    date_modified: "2023-01-26",
    expiration_date: "2023-02-28",
}

const { data } = await axios.post(`${HOST}/samples`, sampleData);
```

Example Response
```json
{
    "qr_code_key": "8eba87d6",
    "experiment_id": "TES",
    "storage_condition": "Freezing",
    "contents": "NaCl",
    "analyst": "Abraham Lincoln",
    "date_entered": "2023-01-26",
    "date_modified": "2023-01-26",
    "expiration_date": "2023-02-28",
    "audit_id": "9439490a-2ff1-4fa4-8321-564b7bb43544",
    "audit_number": 274701643
}
```

## `PUT` /samples

### Note on *`GET` /samples*
Everytime this endpoint is hit, a new qr_code_key is generated based off of the sample data. This is to ensure that the qr_code_key is always unique. It is also important to note that when editing a sample, the audit_id is never changed, this acts as a way to group all versions of a sample together.

Example Request
```typescript
/**
 * Required Fields
 * - [ "experiment_id", "storage_condition", "contents", "analyst"
 *     "date_entered", "date_modified", "expiration_date", "audit_id" ]
 * 
 * Generated Fields 
 * - [ "qr_code_key", "audit_number" ]
 * 
 * If the qr_code_key or audit_number field is provided, it will be ignored.
 */
const sampleData = {
    experiment_id: "TES",
    storage_condition: "Freezing",
    contents: "NaCl",
    analyst: "Abraham Lincoln",
    date_entered: "2023-01-26",
    date_modified: "2023-01-30",
    expiration_date: "2023-02-28",
    audit_id: "9439490a-2ff1-4fa4-8321-564b7bb43544"
}

const { data } = await axios.put(`${HOST}/samples`, sampleData);
```

Example Response
```json
{
    "qr_code_key": "efb9b5a0",
    "experiment_id": "TES",
    "storage_condition": "Freezing",
    "contents": "NaCl",
    "analyst": "Abraham Lincoln",
    "date_entered": "2023-01-26",
    "date_modified": "2023-01-30",
    "expiration_date": "2023-02-28",
    "audit_id": "9439490a-2ff1-4fa4-8321-564b7bb43544",
    "audit_number": 274701900
}
```
