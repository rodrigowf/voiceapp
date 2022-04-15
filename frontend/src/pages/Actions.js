import React from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import { Box, Typography, Autocomplete, TextField, Icon } from "@mui/material";
import SortableGird from "../components/SortableGrid";
import { actionsApi } from "../scripts/api";

import jsonData from "./json_materialicons.json";


const types = ['Console', 'HotKey', 'Browser', 'MQTT'];

// const items = ['star', 'add_circle', 'abc', 'ac_unit'];
const items = jsonData.icons.map((icon)=>(icon.name));
items.push("", "0");


const IconEditInputCell = (props) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const handleChange = async (event) => {
        await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
        // apiRef.current.stopCellEditMode({ id, field });
    };

    return (
        <Autocomplete
            disablePortal
            id="icon-search"
            options={items}
            sx={{ height: 1, flexGrow: 1 }}
            value={value}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField {...params}/>
            )}
            renderOption={(props, option) => (
                <li {...props}>
                    <Icon sx={{mr:'5px'}}>{option}</Icon>
                    {option}
                </li>
            )}
        />
    );
};

const renderIconEditInputCell = (params) => {
    return <IconEditInputCell {...params} />;
};

const renderIconCell = (params) => {
    const { value } = params;
    return (<Icon>{value}</Icon>);
}


const columns = [
    // { field: 'order', headerName: '#', type: 'number', editable: false },
    { field: 'name', headerName: 'Nome', width: 200, editable: true, sortable: false  },
    {
        field: 'icon', headerName: '　　　Icone',
        renderCell: renderIconCell,
        renderEditCell: renderIconEditInputCell,
        width: 150, align: 'center', editable: true, sortable: false
    },
    { field: 'type', headerName: '　　Tipo', type: 'singleSelect', valueOptions: types, align: 'center', width: 100, editable: true, sortable: false  },
    { field: 'target', headerName: 'Destino', width: 240, editable: true, sortable: false, flex: 2 },
    { field: 'value', headerName: 'Valor', width: 400, editable: true, sortable: false, flex: 3 },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Excluir',
        width: 100,
        cellClassName: 'actions',
    },
];

const emptyRow = { id: 0, order: 0, name: null, icon: '', type: types[1], target: null, value: '' };


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
