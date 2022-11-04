import React, { useState } from 'react';

import useStyles from './styles'

import * as api from '../../api/index';

import { useSelector } from 'react-redux';
import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody, InputLabel, Select, MenuItem, Button } from '@mui/material';
import SampleRow from './SampleRow/PSampleRow';

const Samples = () => {
    const [labelImage, setLabelImage] = useState('');
    const [printer, setPrinter] = useState('None');

    const samples: any[] = useSelector((state: any) => state.samples);
    const printers: any[] = useSelector((state: any) => state.printers);

    const classes = useStyles();


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

    return (
        <>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>QR Code Key</TableCell>
                        <TableCell>Sample Name</TableCell>
                        <TableCell>MK</TableCell>
                        <TableCell>ELN notebook number</TableCell>
                        <TableCell>Date Created</TableCell>
                        <TableCell>Date Appended</TableCell>
                        <TableCell>Expiration Date</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Print</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { 
                        samples.map((sample: any) => (
                            <SampleRow sample={sample} samples={samples} onPrint={handleGenerateLabel}/>
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

export default Samples;
