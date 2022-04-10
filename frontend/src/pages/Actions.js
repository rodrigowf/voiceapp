import React from 'react';
import { Box, Typography } from "@mui/material";
import SortableGird from "../components/SortableGrid";
import { actionsApi } from "../scripts/api";


const types = ['Console', 'HotKey', 'Browser', 'MQTT'];

const columns = [
    // { field: 'order', headerName: '#', type: 'number', editable: false },
    { field: 'name', headerName: 'Nome', width: 230, editable: true, sortable: false  },
    { field: 'type', headerName: 'Tipo', type: 'singleSelect', valueOptions: types, width: 150, editable: true, sortable: false  },
    { field: 'program', headerName: 'Programa / Device', width: 300, editable: true, sortable: false },
    { field: 'parameters', headerName: 'Parâmetros', width: 500, editable: true, sortable: false , flex: 1 },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Excluir',
        width: 100,
        cellClassName: 'actions',
    },
];

const emptyRow = { id: 0, order: 0, name: '', type: types[1], program: '', parameters: '' };


const Actions = () => (
    <Box sx={{maxWidth: '1488px', margin: 'auto'}}>
        <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}} gutterBottom>
            Editar Ações
        </Typography>
        <SortableGird
            columns={columns}
            api={actionsApi}
            emptyRow={emptyRow}
            newButtonLabel="Adicionar Nova Ação"
        />
    </Box>
); export default Actions;
