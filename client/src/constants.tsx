export enum Team {
    ARND = 'ARND',
    PSCS = 'PSCS',
}

export const SamplesTableGridColDefs = [
    { 
        field: 'experiment_id', 
        headerName: 'Experiment ID', 
        flex: 1,
        sortable: false,
        editable: true,
    },
    { 
        field: 'storage_condition', 
        headerName: 'Storage Condition', 
        flex: 1,
        sortable: false,
        editable: true
    },
    { 
        field: 'contents',
        headerName: 'Contents', 
        flex: 1,
        sortable: false,
        editable: true
    },
    { 
        field: 'analyst', 
        headerName: 'Analyst', 
        flex: 1,
        sortable: false,
        editable: true
    },
];

export const PSamplesTableGridColDefs = [
    { 
        field: 'sample_name', 
        headerName: 'Sample Name', 
        flex: 1,
        sortable: false,
        editable: true,
    },
    { 
        field: 'mk', 
        headerName: 'MK', 
        flex: 1,
        sortable: false,
        editable: true
    },
    { 
        field: 'eln_notebook_number',
        headerName: 'ELN Notebook Number', 
        flex: 1,
        sortable: false,
        editable: true
    },
]