/**
 * Defines the properties every sample should have regardless of the team
 */
interface GeneralSample {
    qr_code_key: string,
    audit_id: string,
    audit_number: number,
    date_entered: string,
    date_modified: string,
    expiration_date: string,
}

/**
 * Represents a sample that has yet to be hashed (i.e. before its qr_code_key is generated).
 * The only point a sample is unhashed is when the user has used the sample creation form
 * and is sending the sample data to the server to be hashed and stored.
 */
type UnhashedSample<T extends GeneralSample> = Omit<T, 'qr_code_key'>;

/**
 * Defines the unique properties of an ARND sample
 */
interface ARNDSample extends GeneralSample {
    experiment_id: string,
    storage_condition: string,
    contents: string,
    analyst: string,
}

/**
 * ARNDSample without the qr_code_key property
 */
type UnhashedARNDSample = UnhashedSample<ARNDSample>;

/**
 * Defines the unique properties of a PSCS sample
 */
interface PSCSSample extends GeneralSample {
    sample_name: string,
    mk: string,
    eln_notebook_number: string,
}

/**
 * PSCSSample without the qr_code_key property
 */
type UnhashedPSCSSample = UnhashedSample<PSCSSample>;

/**
 * Defines the properties of a deleted sample.
 * When a sample is deleted, its audit_id and qr_code_key is stored in the deleted table.
 * We can get the full information of the deleted sample by querying the samples table that corresponds with the team.
 */
interface Deleted {
    audit_id: string;
    audit_number: number;
    qr_code_key: string;
    team: Team | string;
    date_deleted: string;
}

/**
 * Defines the properties of a printer
 */
interface Printer {
    ip: string,
    name: string,
    location: string,
    model: string
}

interface Position {
    x: number;
    y: number;
}

interface Dimensions {
    width: number;
    height: number;
}

interface LabelEntity {
    text: string;
    position: Position;

    /**
     * Unused value but provided in the payload
     */
    fontColor: string;
    fontSize: number;

    /**
     * This value is only present if the entity is a qr code which there is only one of 
     * in any label layout. So it is safe to check against this value to determine if the
     * entity is a qr code.
     */
    size?: number;
}

interface LabelLayoutData {
    entities: LabelEntity[];
    labelSize: Dimensions;
}

/**
 * Defines the properties of a label layout.
 * The newest label layout will be the one with the highest id. 
 * Coupling that with selecting only a specific team, you can get the most recent label layout for a team.
 * * id: The unique KSUID of the label layout.
 * * data: The entities that make up the label layout.
 * * team: The team that the label layout belongs to.
 */
interface LabelLayout {
    id: number;
    data: LabelLayoutData
    team: Team | string;
}

type Team = 'ARND' | 'PSCS';