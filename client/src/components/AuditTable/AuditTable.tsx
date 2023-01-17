import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { GeneralSample, Sample } from "../../api/types";
import NavBar from "../NavBar/NavBar";
import SampleTable from "../Samples/SampleTable";
import { GridColDef } from "@mui/x-data-grid";
import { PSamplesTableGridColDefs, SamplesTableGridColDefs, Team } from "../../constants";


interface AuditTableProps {
    team: Team
}

const AuditTable = ({ team }: AuditTableProps) => {
    const { id } = useParams();
    var overrideGridColDefs: GridColDef[] = [];
    var samples: GeneralSample[] = useSelector((state: any) => {
        switch (team) {
            case Team.ARND:
                overrideGridColDefs = SamplesTableGridColDefs
                return state.samples;
            case Team.PSCS:
                overrideGridColDefs = PSamplesTableGridColDefs
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
            gridColDefs={overrideGridColDefs}
        />
    </>)

}

export default AuditTable