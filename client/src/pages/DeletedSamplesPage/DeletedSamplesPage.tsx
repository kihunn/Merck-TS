import { useEffect, useState } from "react";
import { GeneralSample } from "../../api/types";
import NavBar from "../../components/NavBar/NavBar";

import * as api from '../../api';
import { Team } from "../../constants";
import { DeletedTable } from "../../components/DeletedTable/DeletedTable";

interface DeletedSamplesPageProps {
    team: Team
}

export const DeletedSamplesPage: React.FC<DeletedSamplesPageProps> = ({ team }) => {
    
    const [samples, setSamples] = useState<GeneralSample[]>([]);

    return (
        <>
            <NavBar />
            <DeletedTable team={team} />
        </>
    );
        
}