import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Sample, Printer } from '../../api/types';
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
import SampleRow from './SampleRow/SampleRow';

type AuditGroups = { [key: Sample["audit_id"]]: Sample[] }

function filterNewestSamples(allSamples: Sample[]): { newestSamples: Sample[], auditGroups: AuditGroups } {
    const auditGroups: AuditGroups = {};
    const newestSamples: Sample[] = [];

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
        const newestSample: Sample = auditGroups[key].reduce((max: Sample, value: Sample) => {
            return value.audit_number > max.audit_number ? value : max;
        })
        newestSamples.push(newestSample);
    }

    return { newestSamples, auditGroups };
}

interface SamplesTableProps {
    samples?: Sample[],
    isAudit?: boolean
}

const Samples = (props: SamplesTableProps) => {
    const [labelImage, setLabelImage] = useState('');
    const [printer, setPrinter] = useState('None');

    var samples: Sample[] = useSelector((state: any) => state.samples);
    if (props.samples)
        samples = props.samples;

    const printers: Printer[] = useSelector((state: any) => state.printers);

    const [viewableSamples, setViewableSamples]: [Sample[], Function] = useState(filterNewestSamples(samples).newestSamples);

    const classes = useStyles();
    const isAudit = props.isAudit ?? false;

    const handlePrintLabel = async (event: any) => {
        const printerData = printers.find((p: any) => p.name === printer);
        await api.printLabel(labelImage, printerData)
    }

    const handleSelectPrinter = (event: any) => {
        setPrinter(event.target.value);
    }

    const handleGenerateLabel = async (event: any, sample: any) => {
        const { qr_code_image } = (await api.createLabel(sample)).data;
        setLabelImage(qr_code_image);
    }

    const onSampleEdit = async (event: any, oldSample: Sample, newSample: Sample) => {
        console.log(oldSample, newSample);
        viewableSamples.splice(viewableSamples.indexOf(oldSample), 1, newSample);
        setViewableSamples(viewableSamples);
    }

    return (
        <>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align='left'>QR Code Key</TableCell>
                        <TableCell align='left'>Experiment ID</TableCell>
                        <TableCell align='left'>Storage Condition</TableCell>
                        <TableCell align='left'>Contents</TableCell>
                        <TableCell align='left'>Analyst</TableCell>
                        <TableCell align='left'>Date Created</TableCell>
                        <TableCell align='left'>Date Modified</TableCell>
                        <TableCell align='left'>Expiration Date</TableCell>
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
                        (isAudit ? samples : viewableSamples).map((sample: Sample) => (
                            <SampleRow key={sample.qr_code_key} sample={sample} onPrint={handleGenerateLabel} onEdit={onSampleEdit} isAudit={isAudit}/>
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
                <div style={{ textAlign: 'center' }}>
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

export default Samples;