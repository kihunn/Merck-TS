import { useState } from 'react';

// import useStyles from './styles'

import * as api from '../../../api/index';

import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
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
        sample_name: '',
        MK: '',
        ELNnotebooknumber: '',
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
        // TODO: Shouldn't be called if the sample had no updates
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
                <TableCell align="right">{sample.sample_name}</TableCell>
                <TableCell align="right">{sample.MK}</TableCell>
                <TableCell align="right">{sample.ELNnotebooknumber}</TableCell>
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
                        name="samplename" 
                        variant="outlined" 
                        label="Sample Name" 
                        value={selectedSample.sample_name}
                        onChange={(event) => setSelectedSample({...selectedSample, sample_name: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="MK" 
                        variant="outlined" 
                        label="MK" 
                        value={selectedSample.MK}
                        onChange={(event) => setSelectedSample({...selectedSample, MK: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="ELN notebooknumber" 
                        variant="outlined" 
                        label="ELN notebooknumber"  
                        value={selectedSample.ELNnotebooknumber}
                        onChange={(event) => setSelectedSample({...selectedSample, ELNnotebooknumber: event.target.value})}
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
