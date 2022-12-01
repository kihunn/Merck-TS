import { useState } from 'react';

// import useStyles from './styles'

import { Link } from 'react-router-dom';

import * as api from '../../../api/index';

import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
import { Edit, Print, Check, Close, History } from '@mui/icons-material';
import { PSample } from '../../../api/types';

interface PSampleCellProps {
    sample: PSample,
    onPrint: (event: any, sample: any) => void,
    onEdit: (event: any, sample: any) => void,
    isAudit: boolean
}

const PSampleCell = (props: PSampleCellProps) => {
    const initialSampleState = {
        qr_code_key: '',
        sample_name: '',
        mk: '',
        eln_notebook_number: '',
        date_entered: (new Date(Date.now())).toISOString().split('T')[0],
        expiration_date: (new Date(Date.now())).toISOString().split('T')[0],
        date_modified: (new Date(Date.now())).toISOString().split('T')[0],
    }
    
    const [selectedSample, setSelectedSample]: [PSample, Function] = useState(Object.create(initialSampleState));
    const [sample, setSample] = useState(props.sample);

    const handleEditRequest = (event: any, sample: any) => {
        setSelectedSample(sample);
    }

    const handleEditSuccess = async (event: any) => {
        // TODO: Shouldn't be called if the sample had no updates
        const { data } = await api.updatePSample(selectedSample);
        props.onEdit(event, selectedSample);
        setSelectedSample(Object.create(initialSampleState))
        setSample(data);
    }

    const handleEditClose = (event: any) => {
        setSelectedSample(Object.create(initialSampleState))
    }

    return (
        sample.qr_code_key != selectedSample.qr_code_key ? (
            <TableRow key={sample.qr_code_key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{sample.qr_code_key}</TableCell>
                <TableCell align="left">{sample.sample_name}</TableCell>
                <TableCell align="left">{sample.mk}</TableCell>
                <TableCell align="left">{sample.eln_notebook_number}</TableCell>
                <TableCell align="left">{sample.date_entered}</TableCell>
                <TableCell align="left">{sample.date_modified}</TableCell>
                <TableCell align="left">{sample.expiration_date}</TableCell>
                {!props.isAudit ? <><TableCell> 
                    <IconButton onClick={(event) => handleEditRequest(event, sample)}> 
                        <Edit /> 
                    </IconButton> 
                </TableCell>
                <TableCell> 
                    <IconButton onClick={(event) => props.onPrint(event, sample)}> 
                        <Print /> 
                    </IconButton> 
                </TableCell>
                <TableCell>  
                    <IconButton>
                        <Link
                        to={`/psamples/audit/${sample.audit_id}`}
                        style={{textDecoration: 'none', color: 'gray'}} 
                        >
                            <History />
                        </Link>
                    </IconButton>
                </TableCell></> : <></>}
            </TableRow>
        ) : (
            <TableRow key={sample.qr_code_key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{sample.qr_code_key}</TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="sampleName" 
                        variant="outlined" 
                        label="Sample Name" 
                        value={selectedSample.sample_name}
                        onChange={(event) => setSelectedSample({...selectedSample, sample_name: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="mk" 
                        variant="outlined" 
                        label="MK" 
                        value={selectedSample.mk}
                        onChange={(event) => setSelectedSample({...selectedSample, mk: event.target.value})}
                    />
                </TableCell>
                <TableCell align="right">
                    <TextField
                        margin='normal'
                        name="elnNotebookNunber" 
                        variant="outlined" 
                        label="ELN Notebook Number"  
                        value={selectedSample.eln_notebook_number}
                        onChange={(event) => setSelectedSample({...selectedSample, eln_notebook_number: event.target.value})}
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

export default PSampleCell
