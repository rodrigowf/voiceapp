import React, { useState } from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import { Box, Typography, Select } from "@mui/material";

import SortableGird from "../components/SortableGrid";
import { speechesApi, actionsApi, associationsApi } from "../scripts/api";


export default function Associations() {
    const [phrases, setPhrases] = useState([]);
    const [actions, setActions] = useState([]);

    const preload = async () => {
        const phrs = await speechesApi.getList();
        setPhrases(phrs);
        const acts = await actionsApi.getList();
        setActions(acts);
    };

    const SelectEditInputCell = (props) => {
        const { id, value, field } = props;
        const apiRef = useGridApiContext();

        const handleChange = async (event) => {
            await apiRef.current.setEditCellValue({ id, field, value: parseInt(event.target.value) });
            apiRef.current.stopCellEditMode({ id, field });
        };

        let items = [];
        if (field === 'action_id') {
            items = actions;
        } else if (field === 'speech_id') {
            items = phrases;
        }

        return (
            <Select
                value={value}
                onChange={handleChange}
                size="big"
                sx={{ height: 1, flexGrow: 1 }}
                native
                autoFocus
            >
                {items.map((item) => (
                    <option value={parseInt(item.id)} key={parseInt(item.id)}>
                        {item.name}
                    </option>
                ))}
            </Select>
        );
    };

    const renderSelectEditInputCell = (params) => {
        return <SelectEditInputCell {...params} />;
    };

    const renderSelectCell = (params) => {
        const { id, value, field, children } = params;
        let content = null;
        if (field === 'action_id') {
            content = value ? actions.find((el)=>(el.id === parseInt(value))).name : children;
        } else if (field === 'speech_id') {
            content = value ? phrases.find((el)=>(el.id === parseInt(value))).name: children;
        }
        return content;
    }

    const columns = [
        // { field: 'order', headerName: '#', type: 'number', editable: false },
        {
            field: 'speech_id',
            headerName: 'Fala',
            renderCell: renderSelectCell,
            renderEditCell: renderSelectEditInputCell,
            width: 400,
            editable: true,
            sortable: false ,
            flex: 1
        },
        {
            field: 'action_id',
            headerName: 'Ação',
            renderCell: renderSelectCell,
            renderEditCell: renderSelectEditInputCell,
            width: 400,
            editable: true,
            sortable: false ,
            flex: 1
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Excluir',
            width: 100,
            cellClassName: 'actions',
        },
    ];

    const emptyRow = { id: 0, order: 0, speech_id: 1, action_id: 1 };

    return (
        <Box sx={{maxWidth: '1488px', margin: 'auto'}}>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}} gutterBottom>
                Editar Associações
            </Typography>
            <SortableGird
                columns={columns}
                api={associationsApi}
                emptyRow={emptyRow}
                preload={preload}
                newButtonLabel="Adicionar Nova Associação"
            />
        </Box>
    );
}
