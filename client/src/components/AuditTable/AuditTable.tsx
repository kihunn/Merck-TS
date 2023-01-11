import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { GeneralSample, Sample } from "../../api/types";
import NavBar from "../NavBar/NavBar";

export enum Team {
    ARD,
    PSCS
}

interface AuditTableProps {
    team: Team
}

const AuditTable = (props: AuditTableProps) => {
    const { id } = useParams();
    var samples: GeneralSample[] = useSelector((state: any) => {
        switch (props.team) {
            case Team.ARD:
                return state.samples;
            case Team.PSCS:
                return state.psamples;
            default:
                return []
        }
    });
    const auditedSamples: GeneralSample[] = samples.filter((sample: GeneralSample) => sample.audit_id == id);
    auditedSamples.sort((a: GeneralSample, b: GeneralSample) => b.audit_number-a.audit_number);

    // TODO: Get audit table working with the new SampleTable component

    return (<>
        <NavBar />
        {/* {
            props.team == Team.ARD ?
                <Samples samples={auditedSamples} isAudit={true}/>
            : props.team == Team.PSCS ?
                <PSamples samples={auditedSamples} isAudit={true}/>
            : <></>    
        } */}
    </>)

}

export default AuditTable