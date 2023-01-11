import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { GeneralSample, Sample } from "../../api/types";
import NavBar from "../NavBar/NavBar";
import SampleTable from "../Samples/SampleTable";
import { GridColDef } from "@mui/x-data-grid";

export enum Team {
    ARD,
    PSCS
}

interface AuditTableProps {
    team: Team
}

const AuditTable = ({ team }: AuditTableProps) => {
    const { id } = useParams();
    var overrideGridColDefs: GridColDef[] = [];
    var samples: GeneralSample[] = useSelector((state: any) => {
        switch (team) {
            case Team.ARD:
                overrideGridColDefs = [
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
                ]
                return state.samples;
            case Team.PSCS:
                overrideGridColDefs = [
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
                ]
                return state.psamples;
            default:
                return []
        }
    });
    
    const auditedSamples: GeneralSample[] = samples.filter((sample: GeneralSample) => sample.audit_id == id);
    auditedSamples.sort((a: GeneralSample, b: GeneralSample) => b.audit_number-a.audit_number);

    return (<>
        <NavBar />
        <SampleTable 
            selector={""} 
            isAuditTable={true}       
            overrideSamples={auditedSamples} 
            overrideGridColDefs={overrideGridColDefs}
        />
    </>)

}

export default AuditTable