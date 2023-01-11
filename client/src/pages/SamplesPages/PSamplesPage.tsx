import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getPSamples } from '../../redux/actions/psamples';
import { getPrinters } from '../../redux/actions/printer';

import NavBar from "../../components/NavBar/NavBar"

import SampleTable from "../../components/Samples/SampleTable";

import * as api from '../../api/index';

const PSamplesPage = () => {

    // const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // @ts-ignore
        dispatch(getPSamples());
        // @ts-ignore
        dispatch(getPrinters())
    }, [dispatch])

    return (
        <>
            <NavBar/>
            <SampleTable 
                selector="psamples"
                onRefresh={() => {}}
                onGenerateLabels={async (selected) => { return [""]; }}
                onDelete = {async () => {}}
                auditLink={(id: string) => `/psamples/audit/${id}`}
                updateSample={api.updatePSample}
                overrideGridColDefs={[
                    { 
                        field: 'sample_name', 
                        headerName: 'Sample Name', 
                        flex: 1,
                        sortable: false,
                        editable: true,
                    },
                    { 
                        field: 'mk', 
                        headerName: 'MK', 
                        flex: 1,
                        sortable: false,
                        editable: true
                    },
                    { 
                        field: 'eln_notebook_number',
                        headerName: 'ELN Notebook Number', 
                        flex: 1,
                        sortable: false,
                        editable: true
                    },
                ]}
            />
        </>
    )
}

export default PSamplesPage