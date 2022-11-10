import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { Sample } from "../../api/types";
import NavBar from "../NavBar/NavBar";
import Samples from "../Samples/Samples";

const AuditTable = () => {
    const { id } = useParams();
    const samples: Sample[] = useSelector((state: any) => state.samples);
    console.log(samples);
    const auditedSamples: Sample[] = samples.filter((sample: Sample) => sample.audit_id == id);
    console.log(auditedSamples)
    auditedSamples.sort((a: Sample, b: Sample) => b.audit_number-a.audit_number);

    return (<>
        <NavBar />
        <Samples samples={auditedSamples} isAudit={true}/>
    </>)

}

export default AuditTable