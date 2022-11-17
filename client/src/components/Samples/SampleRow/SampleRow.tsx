import { useState } from 'react';

// import useStyles from './styles'

import * as api from '../../../api/index';

import { 
    TableRow, 
    TableCell, 
    IconButton, 
    TextField 
} from '@mui/material';

import { 
    Edit, 
    Print, 
    Check, 
    Close,
    History,
    Delete
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Sample } from '../../../api/types';

interface SampleCellProps {
    sample: Sample,
    onPrint: (event: any, sample: any) => void
    onEdit: (event: any, selectedSample: any) => void,
    isAudit: boolean
}

const SampleCell = (props: SampleCellProps) => {
    var sample = props.sample;

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
    
    const [selectedSample, setSelectedSample]: [Sample, Function] = useState(Object.create(initialSampleState));

    const handleEditRequest = (event: any, sample: any) => {
        setSelectedSample(sample);
    }

    const handleEditSuccess = async (event: any) => {
        // TODO: Shouldn't be called if the sample had no updates
        const { data } = await api.updateSample(selectedSample);
        props.onEdit(event, data)
        sample = data;
        setSelectedSample(Object.create(initialSampleState))
    }

    const handleEditClose = (event: any) => {
        setSelectedSample(Object.create(initialSampleState))
    }

    return (
        sample.qr_code_key != selectedSample.qr_code_key ? (
            <TableRow style={{background: ((new Date(sample.expiration_date) < new Date(Date.now())) && !props.isAudit) ? 'rgba(255,68,68,0.8)' : 'white' }} key={sample.qr_code_key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{sample.qr_code_key}</TableCell>
                <TableCell align="left">{sample.experiment_id}</TableCell>
                <TableCell align="left">{sample.storage_condition}</TableCell>
                <TableCell align="left">{sample.contents}</TableCell>
                <TableCell align="left">{sample.analyst}</TableCell>
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
                        to={`/samples/audit/${sample.audit_id}`}
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
                <TableCell> <IconButton> <Delete/> </IconButton> </TableCell>
            </TableRow>
        )
    )

}

export default SampleCell