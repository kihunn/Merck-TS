import { useState } from 'react';
import { useSelector } from 'react-redux';

import { PSample, Printer } from '../../api/types';
import * as api from '../../api/index';

import { 
    TableContainer, 
    Table, 
    Paper, 
    TableHead, 
    TableRow,
    TableCell, 
    TableBody, 
    InputLabel, 
    Select, 
    MenuItem, 
    Button 
} from '@mui/material';

import useStyles from './styles';
import PSampleRow from './SampleRow/PSampleRow';

type AuditGroups = { [key: PSample["audit_id"]]: PSample[] }

function filterNewestSamples(allSamples: PSample[]): { newestSamples: PSample[], auditGroups: AuditGroups } {
    const auditGroups: AuditGroups = {};
    const newestSamples: PSample[] = [];

    // Group samples by audit_id
    for (const sample of allSamples) {
        if (!auditGroups[sample.audit_id]) {
            auditGroups[sample.audit_id] = [sample];
        } else {
            auditGroups[sample.audit_id].push(sample);
        }
    }

    for (const key of Object.keys(auditGroups)) {
        // Reduce function goes through all the samples in an audit group and finds the one with the highest audit_number (aka most recent sample)
        const newestSample: PSample = auditGroups[key].reduce((max: PSample, value: PSample) => {
            return value.audit_number > max.audit_number ? value : max;
        })
        newestSamples.push(newestSample);
    }

    return { newestSamples, auditGroups };
}

interface PSamplesTableProps {
    samples?: PSample[],
    isAudit?: boolean
}

const PSamples = (props: PSamplesTableProps) => {
    const [labelImage, setLabelImage] = useState('');
    const [printer, setPrinter] = useState('None');

    var samples: PSample[] = useSelector((state: any) => state.psamples);
    if (props.samples)
        samples = props.samples;

    const printers: Printer[] = useSelector((state: any) => state.printers);

    const { newestSamples } = filterNewestSamples(samples);

    const classes = useStyles();
    const isAudit = props.isAudit ?? false;

    const handlePrintLabel = async (event: any) => {
        const printerData = printers.find((p: any) => p.name === printer);
        await api.printLabel(labelImage, printerData)
    }

    const handleSelectPrinter = (event: any) => {
        setPrinter(event.target.value);
    }

    // This needs to create a different label than AR&D one
    const handleGenerateLabel = async (event: any, sample: any) => {
        const { qr_code_image } = (await api.createLabel(sample)).data;
        setLabelImage(qr_code_image);
    }

    const onEdit = async (event: any, selectedSample: any) => {
        samples.push(selectedSample);
    }

    return (
        <>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>QR Code Key</TableCell>
                        <TableCell>Sample Name</TableCell>
                        <TableCell>MK</TableCell>
                        <TableCell>ELN Notebook Number</TableCell>
                        <TableCell>Date Created</TableCell>
                        <TableCell>Date Modified</TableCell>
                        <TableCell>Expiration Date</TableCell>
                        {!isAudit ? <>
                        <TableCell>Edit</TableCell>
                        <TableCell>Print</TableCell>
                        <TableCell>History</TableCell>
                        </>
                        : <></>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    { 
                        (isAudit ? samples : newestSamples).map((sample: PSample) => (
                            <PSampleRow sample={sample} onPrint={handleGenerateLabel} onEdit={onEdit} isAudit={isAudit}/>
                        ))
                    }
                </TableBody>
            </Table>    
        </TableContainer>
        
        <Paper style={{
            width: '100%',
            margin: 'auto'
        }}>
            {
                labelImage !== '' ? 
                <div>
                    <img src={`data:image/png;base64,${labelImage}`} alt="Label" style={{ objectFit: 'cover' }} /> 
                    <InputLabel id="printer-label">Printer</InputLabel>
                    <Select
                        value={printer}
                        label='Printer'
                        onChange={handleSelectPrinter}
                    >
                        <MenuItem value='None'>None</MenuItem>
                        {
                            printers.map((printer: any) => 
                                <MenuItem value={printer.name}>{printer.name}</MenuItem>
                            )
                        }
                    </Select>
                    {
                        printer !== 'None' ? <Button onClick={handlePrintLabel}>Print</Button> : null
                    }
                </div>
                : null
            }
        </Paper>
        </>
    )
}

export default PSamples;