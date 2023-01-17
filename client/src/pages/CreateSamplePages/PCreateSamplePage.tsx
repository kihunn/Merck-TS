import { useDispatch } from "react-redux"
import { GeneralSample } from "../../api/types"
import { Form } from "../../components/Form/Form"
import NavBar from "../../components/NavBar/NavBar"
import { createPSample } from "../../redux/actions/psamples"

const PCreateSamplePage = () => {

    const dispatch = useDispatch();

    const additionalFields = [
        { field: "sample_name", displayName: "Sample Name" },
        { field: "mk", displayName: "MK" },
        { field: "eln_notebook_number", displayName: "ELN Notebook Number" },
    ]

    const onSubmit = (sample: GeneralSample) => {
        // @ts-ignore
        dispatch(createPSample(sample));
    }

    return (
        <>
            <NavBar />
            <Form
                additionalFields={additionalFields}
                onSubmit={onSubmit}
            />
        </>
    )
}

export default PCreateSamplePage