import React from 'react';
import Sample from './sample/sample';

import useStyles from './styles'

import { useSelector } from 'react-redux';
// import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const Samples = () => {
    const samples = useSelector((state: any) => state.samples);
    const classes = useStyles();

    console.log(samples);

    return (

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Experiment ID</TableCell>
                        <TableCell>Storage Condition</TableCell>
                        <TableCell>Contents</TableCell>
                        <TableCell>Analyst</TableCell>
                        <TableCell>Date Created</TableCell>
                        <TableCell>Date Modified</TableCell>
                        <TableCell>Expiration Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        samples.map((sample: any) => (
                            <TableRow key={sample.experiment_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{sample.expirement_id}</TableCell>
                                <TableCell align="right">{sample.storage_condition}</TableCell>
                                <TableCell align="right">{sample.contents}</TableCell>
                                <TableCell align="right">{sample.analyst}</TableCell>
                                <TableCell align="right">{sample.date_created}</TableCell>
                                <TableCell align="right">{sample.date_modified}</TableCell>
                                <TableCell align="right">{sample.expiration_date}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>    
        </TableContainer>
    )
}

export default Samples;