import { useEffect, useState } from "react";
import { PSamplesTableGridColDefs, SamplesTableGridColDefs, Team } from "../../constants";
import NavBar from "../NavBar/NavBar";
import { GeneralSample } from "../../api/types";
import SampleTable from "../Samples/SampleTable";
import * as api from "../../api/index";
import { GridColDef } from "@mui/x-data-grid";

interface DeletedTableProps {
    team: Team
}

export const DeletedTable: React.FC<DeletedTableProps> = ({ team }: DeletedTableProps) => {

    var overrideGridColDefs: GridColDef[] = [];
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
            const { data } = await api.fetchDeletedByTeam(team);
            setDeletedSamples(data);
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