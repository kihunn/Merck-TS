import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getPSamples } from '../../redux/actions/psamples';
import { getPrinters } from '../../redux/actions/printer';

import NavBar from "../../components/NavBar/NavBar"

import SampleTable from "../../components/Samples/SampleTable";

import * as api from '../../api/index';
import { GeneralSample } from "../../api/types";
import { PSamplesTableGridColDefs, Team } from "../../constants";

const PSamplesPage = () => {

    // const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        onRefresh();
    }, [dispatch])

    const onGenerateLabels = async (selected: GeneralSample[]): Promise<string[]> => {
        const labels: string[] = [];
        for (let i = selected.length - 1; i >= 0; i--) {
            const sample = selected[i];
            const { data } = await api.createLabel(sample, Team.PSCS);
            labels.push(data.qr_code_image);
        }
        return labels;
    }

    const onRefresh = () => {
        // @ts-ignore
        dispatch(getPSamples());
        // @ts-ignore
        dispatch(getPrinters())
    }    

    const onDelete = async (selected: GeneralSample[]) => {
        for (let i = selected.length - 1; i >= 0; i--) {
            const sample = selected[i];
            await api.createDeleted({
                audit_id: sample.audit_id,
                audit_number: sample.audit_number,
                qr_code_key: sample.qr_code_key,
                team: Team.PSCS,
                date_deleted: new Date(Date.now()).toISOString().split('T')[0],
            });
        }
        onRefresh();
    }

    return (
        <>
            <NavBar/>
            <SampleTable 
                selector="psamples"
                onRefresh={onRefresh}
                onGenerateLabels={onGenerateLabels}
                onDelete={onDelete}
                auditLink={(id: string) => `/psamples/audit/${id}`}
                updateSample={api.updatePSample}
                gridColDefs={PSamplesTableGridColDefs}
            />
        </>
    )
}

export default PSamplesPage