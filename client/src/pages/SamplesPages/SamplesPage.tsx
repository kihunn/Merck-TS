import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getSamples } from '../../redux/actions/samples';
import { getPrinters } from '../../redux/actions/printer';

import NavBar from "../../components/NavBar/NavBar"

import SampleTable from "../../components/Samples/SampleTable";

import * as api from '../../api/index';
import { GeneralSample } from "../../api/types";

const SamplesPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        onRefresh();
    }, [dispatch])

    const onGenerateLabels = async (selected: GeneralSample[]): Promise<string[]> => {
        const labels: string[] = [];
        for (let i = selected.length - 1; i >= 0; i--) {
            const sample = selected[i];
            const { data } = await api.createLabel(sample);
            labels.push(data.qr_code_image);
        }
        return labels;
    }

    const onRefresh = () => {
        // @ts-ignore
        dispatch(getSamples());
        // @ts-ignore
        dispatch(getPrinters())
    }

    // TODO: Set up api endpoint for deleting samples
    const onDelete = async (selected: GeneralSample[]) => {
    
    }

    return (
        <>
            <NavBar/>
            <SampleTable 
                selector="samples"
                onRefresh={onRefresh}
                onGenerateLabels={onGenerateLabels}
                onDelete={onDelete}
                updateSample={api.updateSample}
                auditLink={(id: string) => `/samples/audit/${id}`}
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