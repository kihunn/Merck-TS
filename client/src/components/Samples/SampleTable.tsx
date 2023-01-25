import { DataGrid, GridColDef, GridRowId, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import { GridToolbarContainer } from '@mui/x-data-grid/components';

import { Alert, AlertProps, Button, MenuItem, Paper, Select, SelectChangeEvent, Snackbar, Typography } from "@mui/material";

import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HistoryIcon from '@mui/icons-material/History';

import { AxiosResponse } from "axios";

import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";

import * as api from '../../api/index';
import { GeneralSample, Printer } from "../../api/types";

import { Link } from "react-router-dom";

import "./styles.css";
import { Team } from '../../constants';

/**
 * Given an array of samples, will group those with the same audit id, and filter the ones
 * with the highest audit_number.
 * @param allSamples The samples to be filtered
 * @returns An array of the newest samples and an object with keys as the unique audit_id and values being an array of all samples with that audit_id
 */
async function filterNewestNonDeletedSamples(allSamples: GeneralSample[]): Promise<{ newestSamples: GeneralSample[], auditGroups: AuditGroups }> {
    const auditGroups: AuditGroups = {};
    const newestSamples: GeneralSample[] = [];
    const deletedSamples: any[] = (await api.fetchDeleted()).data;
    const deletedAuditIDs = deletedSamples.map((d) => d.audit_id);

    /**
     * Generates an object with keys as the unique audit_id and values
     * being an array of all samples with that audit_id
     */
    for (const sample of allSamples) {
        if (!auditGroups[sample.audit_id]) {
            auditGroups[sample.audit_id] = [sample];
        } else {
            auditGroups[sample.audit_id].push(sample);
        }
    }

    /**
     * Now we go through that object and for each unique audit_id
     * we find the sample with the max audit_number (aka most recent sample)
     * and add it to `newestSamples`
     */
    for (const key of Object.keys(auditGroups)) {
        // Reduce function goes through all the samples in an audit group and finds the one with the highest audit_number (aka most recent sample)
        const newestSample: GeneralSample = auditGroups[key].reduce((max: GeneralSample, value: GeneralSample) => {
            return value.audit_number > max.audit_number ? value : max;
        })
        newestSamples.push(newestSample);
    }

    for (let i = newestSamples.length - 1; i >= 0; i--) {
        if (deletedAuditIDs.includes(newestSamples[i].audit_id)) {
            newestSamples.splice(i, 1);
        }
    }

    return { newestSamples, auditGroups };
}

type AuditGroups = { [key: GeneralSample["audit_id"]]: GeneralSample[] }

interface SampleTableProps {
    /**
     * What key to select from the redux state
     * * useSelector((state) => state[selector])
     * 
     */
    selector: string;
    
    /**
     * What should happen when the refresh button is clicked
     * * This is usually a dispatch to the redux store
     */
    onRefresh?: () => void;

    /**
     * What should happen when the delete button is clicked
     * * Generally going to call an api route to delete each sample
     */
    onDelete?: (selected: GeneralSample[]) => Promise<void>;

    /**
     * Given an array of selected samples, generate the labels, 
     * and return an array of base64 strings
     * @param selected The current samples selected in the data grid
     * @returns An array of base64 strings
     */
    onGenerateLabels?: <T extends GeneralSample>(selected: T[]) => Promise<string[]>;

    /**
     * Function encapsulating an api call to the server to update a sample
     * @param sample The sample to be updated
     * @returns The updated sample with its new qr_code_key as an axios response
     */
    updateSample?: <T extends GeneralSample>(sample: T) => Promise<AxiosResponse<T, any>>

    /**
     * Overrides selected samples from redux store.
     * Most likely use case is with an audit table.
     */
    overrideSamples?: GeneralSample[];

    /**
     * Whether we are showing an audit table or not. An audit table will have certain 
     * features removed such as editing, generating labels, and deleting samples.
     */
    isAuditTable?: boolean;

    /**
     * A function, that given an audit id, returns a link to the audit page for that sample
     * @param audit_id The audit id of the sample we wish to audit
     * @returns 
     */
    auditLink?: (audit_id: string) => string;

    /**
     * Any additional column defintions we will need to visualize the data properly
     * 4 columns are added by default (qr_code_key, date_entered, date_modified, expiration_date)
     */
    gridColDefs?: GridColDef[];
}

const SampleTable: React.FC<SampleTableProps> = ({
    selector,
    onRefresh,
    onGenerateLabels,
    onDelete,
    updateSample,
    overrideSamples,
    isAuditTable,
    auditLink,
    gridColDefs: overrideGridColDefs,
}) => {
    /**
     * Stores the base64 label images generated by `onGenerateLabels`
     */
    const [labelImages, setLabelImages] = useState<string[]>([]);

    /**
     * This stores the most recent samples filtered by audit_id and audit_number.
     * This only shows unique sample (i.e. unique audit_id). These are the samples
     * that are shown in the data grid.
     */
    const [viewableSamples, setViewableSamples] = useState<GeneralSample[]>([]);

    /**
     * Stores the currently selected samples. These are the samples that are passed to 
     * the `onGenerateLabels` function.
     */
    const [selectedSamples, setSelectedSamples] = useState<GeneralSample[]>([]);    

    /**
     * The currently selected printer name. We can search the printers returned by
     * the redux store to find the full printer details (ip, name, model, location)
     */
    const [printer, setPrinter] = useState('None');

    /**
     * The current page size. This is used to determine how many samples to show on each page
     */
    const [pageSize, setPageSize] = useState(10);

    const [showPrintStatusAlert, setShowPrintStatusAlert] = useState(false);

    const [printStatusSeverity, setPrintStatusSeverity] = useState<AlertProps['severity']>('success');

    const [printStatusMessage, setPrintStatusMessage] = useState("");

    const labelImageContainerRef = useRef<HTMLDivElement>(null);


    /**
     * If we are given `overrideSamples` use those, 
     * otherwise, select our samples from the redux store.
     * * We must call useSelector initially due to reacts rule of hooks
     */
    var samples: GeneralSample[] = useSelector((state: any) => state[selector]);
    
    if (overrideSamples !== undefined) {
        samples = overrideSamples;
    }
    
    /**
     * Now we will select all the printers from the redux store.
     */
    const printers: Printer[] = useSelector((state: any) => state.printers);

    /**
     * Assuming a change in the samples array, this function will filter
     * out the newest samples and set those as viewable. If this is an audit 
     * table it will set the viewable samples to be the same as the samples array.
     * Therefore if the property `isAuditTable` is true, then `overrideSamples` property
     * should be provided.
     */
    const updateViewableSamples = async () => {
        if (isAuditTable) {
            setViewableSamples(samples);
        } else {
            const { newestSamples } = await filterNewestNonDeletedSamples(samples);
            setViewableSamples(newestSamples);
        }
    }

    /** 
     * As samples are loaded in via redux useSelector from above we update our viewable samples 
     */
    useEffect(() => {
        updateViewableSamples();
    }, [samples])

    /** ----- on functions ----- */

    /**
     * Handles the printing of the labels.
     */
    const onPrintLabels = async () => {
        const device: Printer = printers.find((p: Printer) => p.name === printer)!;

        const { data } =  await api.printLabels(labelImages, device);
        if (data.success) {
            setShowPrintStatusAlert(true);
            setPrintStatusSeverity('success');
            setPrintStatusMessage('Labels printed successfully');
        } else {
            setShowPrintStatusAlert(true);
            setPrintStatusSeverity('error');
            setPrintStatusMessage('Labels failed to print (printer took too long to respond)');
        }
        setLabelImages([]); // clear the label images
    }

    /**
     * When a printer is selected from the dropdown, this function will be called.
     * The dropdown is only visible after labels have been generated.
     * @param event The event that triggered this function
     */
    const onPrinterChange = (event: SelectChangeEvent<string>) => {
        setPrinter(event.target.value);
    }

    /**
     * Handles the editing process and makes the relevant api call to update the sample.
     * @param newRow The new row data
     * @param oldRow The old row data
     * @returns The data to display in the data grid
     */
    const onSampleRowEdit = async (newRow: GeneralSample, oldRow: GeneralSample): Promise<GeneralSample> => {
        const prismaDate = (dstring: string) => new Date(dstring).toISOString().split('T')[0];
        
        const { data } = await updateSample!({
            ...newRow,
            date_entered: prismaDate(newRow.date_entered),
            date_modified: prismaDate(new Date(Date.now()).toString()),
            expiration_date: prismaDate(newRow.expiration_date),
        });

        samples.push(data);

        updateViewableSamples();

        return data;
    }

    /**
     * Fired when a new sample (or all) was selected in data grid
     * @param newSelection The new selection of samples
     */
    const onSelectionChange = (newSelection: GridRowId[]) => {
        const samples: GeneralSample[] = []
        newSelection.forEach((qr_code_key: GridRowId) => {
            samples.push(viewableSamples.find((sample: GeneralSample) => sample.qr_code_key === qr_code_key)!);
        });
        setSelectedSamples(samples);
    }

    /** ---------- end --------- */

    /**
     * Custom toolbar for the data grid to add a few buttons
     */
    const CustomToolbar: React.FC = () => {
        const onGenerateLabelsClick = async () => {
            setLabelImages(await onGenerateLabels!(selectedSamples));
            // dont work :(
            labelImageContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
        }

        return (
            <GridToolbarContainer>
                <GridToolbar />
                
                <Button 
                    startIcon={<NoteAddIcon />} 
                    disabled={selectedSamples.length == 0} 
                    onClick={onGenerateLabelsClick}
                >
                    Generate Label(s)
                </Button>

                <Button 
                    startIcon={<DeleteIcon />} 
                    disabled={selectedSamples.length == 0} 
                    onClick={() => { onDelete!(selectedSamples); }}
                >
                    Delete Sample(s)
                </Button>
                
                <Button 
                    startIcon={<HistoryIcon />} 
                    disabled={selectedSamples.length != 1}
                >
                    <Link
                        to={auditLink!(selectedSamples[0]?.audit_id)}
                        style={{textDecoration: 'none', color: 'inherit'}}
                    >
                        View Audit Table    
                    </Link>
                </Button>

                <Button 
                    startIcon={<RefreshIcon />} 
                    onClick={onRefresh}
                >
                    Refresh Samples
                </Button>
            </GridToolbarContainer>
        )
    }

    const dateGetter = <K extends keyof GeneralSample>(sample: GeneralSample, key: K) => {
        const input: string = sample[key] as string;
        const split = input.split("-");
        const year = split[0];
        const month = split[1];
        const day = split[2];
        const date = `${month}/${day}/${year}`;
        // some dates had some sort of sequence like {month}/{day}T00:00:00Z/{year}
        // so we remove that
        var out: string = date.substring(0, date.indexOf('T')) + date.substring(date.indexOf('Z'), date.length);       
        return new Date(out);
    } 

    const columns: GridColDef[] = [
        { 
            field: 'qr_code_key', 
            headerName: 'QR Code Key', 
            width: 150,
            sortable: false,
        },
        ...(overrideGridColDefs ?? []),
        { 
            field: 'date_entered', 
            headerName: 'Date Entered', 
            flex: 0.6,
            type: 'date',
            sortable: true,
            editable: true,
            valueGetter: (params: GridValueGetterParams<any, GeneralSample>) => dateGetter(params.row, 'date_entered')
        },
        { 
            field: 'date_modified', 
            headerName: 'Date Modified', 
            type: 'date',
            flex: 0.6,
            sortable: true,
            editable: false,
            valueGetter: (params: GridValueGetterParams<any, GeneralSample>) => dateGetter(params.row, 'date_modified')
        },
        { 
            field: 'expiration_date', 
            headerName: 'Expiration Date',
            flex: 0.6,
            type: 'date',
            sortable: true,
            editable: true,
            valueGetter: (params: GridValueGetterParams<any, GeneralSample>) => dateGetter(params.row, 'expiration_date')
        },
    ];

    return (
        <>
        <Snackbar 
                open={showPrintStatusAlert} 
                autoHideDuration={3000} 
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={() => setShowPrintStatusAlert(false)}
            >
                <Alert 
                    severity={printStatusSeverity}
                    color={printStatusSeverity}
                    onClose={() => setShowPrintStatusAlert(false)}
                >
                    {printStatusMessage}
                </Alert>
        </Snackbar>
        <div className='data-grid-container'>
            <DataGrid className='data-grid'
                experimentalFeatures={{ newEditingApi: true }}
                rows={viewableSamples}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50]}
                getRowId={(sample: GeneralSample) => sample.qr_code_key}
                components={{ Toolbar: isAuditTable ? GridToolbar : CustomToolbar }}
                isCellEditable={(params) => params.field !== 'qr_code_key' && params.field != 'date_entered' && !isAuditTable}
                disableSelectionOnClick
                checkboxSelection
                onSelectionModelChange={onSelectionChange}
                onPageSizeChange={(size) => setPageSize(size)}
                editMode='row'
                processRowUpdate={onSampleRowEdit}
                getRowClassName={(params) => {
                    return `${new Date(params.row.expiration_date) < new Date(Date.now()) && !isAuditTable ? 'data-grid-row-expired' : ''}`;
                }}
            />
        </div>
        
        {
            labelImages.length > 0 ? (
                <>
                    <Paper className="img-label-container">
                        {
                            labelImages.map((labelImage: string, i) =>
                                <img width={270} height={90} className="img-label" key={`${i}`} src={`data:image/png;base64,${labelImage}`} alt="Label"/>
                            )
                        }
                    </Paper>
                    <Paper className="printer-selector-container">
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                            <Typography variant="h6">Select printer:</Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Select
                                value={printer}
                                label="Printer"
                                variant="standard"
                                onChange={onPrinterChange}
                            >
                                <MenuItem value='None'>None</MenuItem>
                                {
                                    printers.map((printer: Printer, i) =>
                                        <MenuItem key={`${i}`} value={printer.name}>{printer.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px' }}>
                            {
                                printer !== 'None' ? (
                                    <Button onClick={onPrintLabels} >Print Labels</Button>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </Paper>
                </>
            ) : (
                <></>
            )
        }

        <div ref={labelImageContainerRef}></div>
        </>
    );
}

export default SampleTable;