import { useDispatch } from "react-redux"
import { GeneralSample } from "../../api/types"
import { FormField, Form } from "../../components/Form/Form"
import NavBar from "../../components/NavBar/NavBar"
import { createSample } from "../../redux/actions/samples"

const CreateSamplePage = () => {

    const dispatch = useDispatch();

    const additionalFields: FormField[] = [
        { field: "experiment_id", displayName: "Experiment ID" },
        { field: "analyst", displayName: "Analyst" },
        { field: "storage_condition", displayName: "Storage Condition" },
        { field: "contents", displayName: "Contents" },
    ]

    const onSubmit = (sample: GeneralSample) => {
        // @ts-ignore
        dispatch(createSample(sample));
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

export default CreateSamplePage