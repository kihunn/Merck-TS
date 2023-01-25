import NavBar from "../../components/NavBar/NavBar";

import { Team } from "../../constants";
import { DeletedTable } from "../../components/DeletedTable/DeletedTable";

interface DeletedSamplesPageProps {
    team: Team
}

export const DeletedSamplesPage: React.FC<DeletedSamplesPageProps> = ({ team }) => {

    return (
        <>
            <NavBar />
            <DeletedTable team={team} />
        </>
    );
        
}