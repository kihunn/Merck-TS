import React, { useState } from 'react';

// import useStyles from './styles'

import * as api from '../../../api/index';

import { useSelector } from 'react-redux';
import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody, IconButton, InputLabel, Select, MenuItem, Button, TextField } from '@mui/material';
import { Edit, Print, Check, Close } from '@mui/icons-material';

interface SampleCellProps {
    sample: any,
    samples: any[],
    onPrint: (event: any, sample: any) => void
}
const SampleCell = (props: SampleCellProps) => {
    const sample = props.sample;

     const initialSampleState = {
        qr_code_key: '',
        experiment_id: '',
        storage_condition: '',
        contents: '',
        analyst: '',
        date_entered: (new Date(Date.now())).toISOString().split('T')[0],
        expiration_date: (new Date(Date.now())).toISOString().split('T')[0],
        date_modified: (new Date(Date.now())).toISOString().split('T')[0],
    }
    
    const [selectedSample, setSelectedSample] = useState(Object.create(initialSampleState));
    const samples: any[] = props.samples

    const handleEditRequest = (event: any, sample: any) => {
        setSelectedSample(sample);
    }

    const handleEditSuccess = async (event: any) => {
        await api.updateSample(selectedSample);
        for (let i = 0; i < samples.length; i++) {
            if (samples[i].qr_code_key === selectedSample.qr_code_key) {
                samples[i] = selectedSample;
            }
        }
        setSelectedSample(Object.create(initialSampleState))
    }

    const handleEditClose = (event: any) => {
        setSelectedSample(Object.create(initialSampleState))
    }

    return (
        sample.qr_code_key != selectedSample.qr_code_key ? (
            <TableRow key={sample.qr_code_key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{sample.qr_code_key}</TableCell>
                <TableCell align="right">{sample.experiment_id}</TableCell>
                <TableCell align="right">{sample.storage_condition}</TableCell>
                <TableCell align="right">{sample.contents}</TableCell>
                <TableCell align="right">{sample.analyst}</TableCell>
                <TableCell align="right">{sample.date_entered}</TableCell>
                <TableCell align="right">{sample.date_modified}</TableCell>
                <TableCell align="right">{sample.expiration_date}</TableCell>
                <TableCell> <IconButton onClick={(event) => handleEditRequest(event, sample)}> <Edit /> </IconButton> </TableCell>
                <TableCell> <IconButton onClick={(event) => props.onPrint(event, sample)}> <Print /> </IconButton> </TableCell>
            </TableRow>
        ) : (
            <TableRow key={sample.qr_code_key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{sample.qr_code_key}</TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="experimentID" 
                        variant="outlined" 
                        label="Experiment ID" 
                        value={selectedSample.experiment_id}
                        onChange={(event) => setSelectedSample({...selectedSample, experiment_id: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="storageCondition" 
                        variant="outlined" 
                        label="Storage Condition" 
                        value={selectedSample.storage_condition}
                        onChange={(event) => setSelectedSample({...selectedSample, storage_condition: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="contents" 
                        variant="outlined" 
                        label="Contents"  
                        value={selectedSample.contents}
                        onChange={(event) => setSelectedSample({...selectedSample, contents: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="analyst" 
                        variant="outlined" 
                        label="Analyst"  
                        value={selectedSample.analyst}
                        onChange={(event) => setSelectedSample({...selectedSample, analyst: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="dateCreated" 
                        variant="outlined" 
                        label="Date Created"
                        type="date"  
                        value={selectedSample.date_entered}
                        onChange={(event) => setSelectedSample({...selectedSample, date_entered: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="dateModified" 
                        variant="outlined" 
                        label="Date Modified"
                        type="date"  
                        value={selectedSample.date_modified}
                        onChange={(event) => setSelectedSample({...selectedSample, date_modified: event.target.value})}
                    />
                </TableCell>    
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="expirationDate" 
                        variant="outlined" 
                        label="Expiration Date"
                        type="date"  
                        value={selectedSample.expiration_date}
                        onChange={(event) => setSelectedSample({...selectedSample, expiration_date: event.target.value})}
                    />                                
                </TableCell>
                <TableCell> <IconButton onClick={handleEditSuccess}> <Check/> </IconButton> </TableCell>
                <TableCell> <IconButton onClick={handleEditClose}> <Close/> </IconButton> </TableCell>
            </TableRow>
        )
    )

}

export default SampleCell