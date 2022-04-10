import React from 'react';
import { Box, Typography } from "@mui/material";
import SortableGird from "../components/SortableGrid";
import { speechesApi } from "../scripts/api";


const columns = [
    // { field: 'order', headerName: '#', type: 'number', editable: false },
    { field: 'name', headerName: 'Nome', width: 300, editable: true, sortable: false  },
    { field: 'phrase', headerName: 'Frase', width: 500, editable: true, sortable: false , flex: 1 },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Excluir',
        width: 100,
        cellClassName: 'actions',
    },
];

const emptyRow = { id: 0, order: 0, name: '', phrase: '' };


export default function Speeches() {
    return (
        <Box sx={{maxWidth: '1488px', margin: 'auto'}}>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}} gutterBottom>
                Editar Falas
            </Typography>
            <SortableGird
                columns={columns}
                api={speechesApi}
                emptyRow={emptyRow}
                newButtonLabel="Adicionar Nova Fala"
            />
        </Box>
    );
}
