import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { Sample } from "../../api/types";
import NavBar from "../NavBar/NavBar";
import PSamples from "../Samples/PSample";
import Samples from "../Samples/Samples";

export enum Team {
    ARD,
    PSCS
}

type CommonSample = {
    audit_id: string,
    audit_number: number
} & any;

interface AuditTableProps {
    team: Team
}

const AuditTable = (props: AuditTableProps) => {
    const { id } = useParams();
    var samples: CommonSample[] = useSelector((state: any) => {
        switch (props.team) {
            case Team.ARD:
                return state.samples;
            case Team.PSCS:
                return state.psamples;
            default:
                return []
        }
    });
    const auditedSamples: CommonSample[] = samples.filter((sample: CommonSample) => sample.audit_id == id);
    auditedSamples.sort((a: CommonSample, b: CommonSample) => b.audit_number-a.audit_number);

    return (<>
        <NavBar />
        {
            props.team == Team.ARD ?
                <Samples samples={auditedSamples} isAudit={true}/>
            : props.team == Team.PSCS ?
                <PSamples samples={auditedSamples} isAudit={true}/>
            : <></>    
        }
    </>)

}

export default AuditTable