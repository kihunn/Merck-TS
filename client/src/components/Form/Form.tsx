import { Alert, Button, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { GeneralSample } from "../../api/types";
import React, { useState } from "react";
import * as api from "../../api/index";

import "./styles.css";

export interface FormField {
    /**
     * The name of the field in the database that is a key of a sample
     */
    field: string;

    /**
     * The name of the field that is displayed to the user
     */
    displayName: string;
}

interface FormProps {
    additionalFields: FormField[];

    onSubmit: (sample: GeneralSample) => void;
}

export const Form: React.FC<FormProps> = ({
    additionalFields,
    onSubmit,
}) => {

    const now = new Date(Date.now()).toISOString().split('T')[0];
    const defaultSample: { [key: string]: string | Date } = {
        date_entered: now,
        date_modified: now,
        expiration_date: now,
    };

    const fields: FormField[] = [
        ...additionalFields,
        { field: "date_entered", displayName: "Date Entered" },
        { field: "date_modified", displayName: "Date Modified" },
        { field: "expiration_date", displayName: "Expiration Date" },
    ]

    for (const field of additionalFields) {
        defaultSample[field.field] = "";
    }

    const [sample, setSample] = useState(defaultSample);
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const onChange = (event: any, field: string) => {
        const updated = { ...sample, [field]: event.target.value };

        var allFilled = true;
        for (const field of fields) {
            if (updated[field.field] === "") {
                allFilled = false;
                break;
            }
        }

        setAllFieldsFilled(allFilled);
        setSample(previous => ({ ...previous, [field]: event.target.value }));
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        let { qr_code_key } = (await api.createQRCodeKey(sample)).data;
        sample["qr_code_key"] = qr_code_key;
        // @ts-ignore
        onSubmit(sample);
        setAllFieldsFilled(false);
        setSample(defaultSample);
        setShowSuccessAlert(true);
    }

    return (
        <>
            <Snackbar 
                open={showSuccessAlert} 
                autoHideDuration={3000} 
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={() => setShowSuccessAlert(false)}
            >
                <Alert 
                    severity="success"
                    onClose={() => setShowSuccessAlert(false)}
                >
                    Sample successfully created
                </Alert>
            </Snackbar>
            <Paper className="sample-form-paper">
                <form className="sample-form" onSubmit={handleSubmit} autoComplete="off">
                    <Typography className="sample-form-header-text" variant="h6">Enter Sample Information</Typography>
                    {
                        fields.map(({ field, displayName }) => (
                            <TextField
                                className="sample-form-textfield"
                                key={field}
                                margin='normal'
                                size='small'
                                name={field}
                                variant="outlined"
                                type={field.includes("date") ? "date" : "text"}
                                label={displayName}
                                value={sample[field]}
                                fullWidth
                                onChange={(event) => onChange(event, field)}
                            />
                        ))
                    }
                    <Button
                        className="sample-form-submit-button"
                        variant='contained'
                        type='submit'
                        color='primary'
                        size='large'
                        disabled={!allFieldsFilled}
                        fullWidth
                    >
                        Submit
                    </Button>
                </form>
            </Paper>
        </>
    );

}