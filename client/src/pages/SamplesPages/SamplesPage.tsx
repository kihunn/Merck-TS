import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getSamples } from '../../redux/actions/samples';
import { getPrinters } from '../../redux/actions/printer';

import NavBar from "../../components/NavBar/NavBar"

import SampleTable from "../../components/Samples/SampleTable";

import * as api from '../../api/index';

const SamplesPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        // @ts-ignore
        dispatch(getSamples());
        // @ts-ignore
        dispatch(getPrinters())
    }, [dispatch])

    // TODO: Create the on refresh, on generate labels, and on delete functions in this file

    return (
        <>
            <NavBar/>
            <SampleTable 
                selector="samples"
                onRefresh={() => {}}
                onGenerateLabels={async (selected) => { return [""]; }}
                onDelete = {async () => {}}
                updateSample={api.updateSample}
                overrideGridColDefs={[
                    { 
                        field: 'experiment_id', 
                        headerName: 'Experiment ID', 
                        flex: 1,
                        sortable: false,
                        editable: true,
                    },
                    { 
                        field: 'storage_condition', 
                        headerName: 'Storage Condition', 
                        flex: 1,
                        sortable: false,
                        editable: true
                    },
                    { 
                        field: 'contents',
                        headerName: 'Contents', 
                        flex: 1,
                        sortable: false,
                        editable: true
                    },
                    { 
                        field: 'analyst', 
                        headerName: 'Analyst', 
                        flex: 1,
                        sortable: false,
                        editable: true
                    },
                ]}
            />
        </>
    )
}

export default SamplesPage