import { useEffect, useState } from "react";
import { PSamplesTableGridColDefs, SamplesTableGridColDefs, Team } from "../../constants";
import NavBar from "../NavBar/NavBar";
import { GeneralSample } from "../../api/types";
import SampleTable from "../Samples/SampleTable";
import * as api from "../../api/index";

interface DeletedTableProps {
    team: Team
}

export const DeletedTable: React.FC<DeletedTableProps> = ({ team }: DeletedTableProps) => {

    var overrideGridColDefs = [];
    switch (team) {
        case Team.ARND:
            overrideGridColDefs = SamplesTableGridColDefs
            break;
        case Team.PSCS:
            overrideGridColDefs = PSamplesTableGridColDefs;
            break;
    }

    const [deletedSamples, setDeletedSamples] = useState<GeneralSample[]>([]);

    useEffect(() => {
        const fetchSamples = async () => {
            const response = await api.fetchFullDeleted();
            const { data } = await api.fetchDeletedOfType(team);
            console.log(team, response.data, data);
            const qr_code_keys = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].type == team) {
                    qr_code_keys.push(data[i].qr_code_key);
                }
            }
            const samples: GeneralSample[] = [];
            for (let i = 0; i < response.data.length; i++) {
                if (qr_code_keys.includes(response.data[i].qr_code_key)) {
                    samples.push(response.data[i]);
                }
            }
            setDeletedSamples(samples);
        };
        fetchSamples();
    }, []);

    return (
        <SampleTable
            selector=""
            isAuditTable={true}
            overrideSamples={deletedSamples}
            gridColDefs={overrideGridColDefs}
        />
    );
}