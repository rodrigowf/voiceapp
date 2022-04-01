import React, {useEffect, useState} from 'react';
import { DataGrid, useGridApiContext, GridCell, GridToolbarContainer, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography, Button, LinearProgress, Select, MenuItem } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SortableGridRow, { reOrderRows } from "../components/SortableGridRow";

import {
    getPhrases,
    getActions,
    getAssociations,
    setAssociation,
    deleteAssociation,
    reorderAssociations,
    deletePhrase
} from "../scripts/api";


function createData(id, order, phrase_id, action_id) {
    return { id, order, phrase_id, action_id };
}

export default function Associations() {
    const [phrases, setPhrases] = useState([]);
    const [actions, setActions] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOverlay, setLoadingOverlay] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPhrases().then((phrs)=>{
            setPhrases(phrs);
            getActions().then((acts)=>{
                setActions(acts);
                getAssociations().then((data)=>{
                    setRows(data);
                    setLoading(false);
                    setLoadingOverlay(true);
                }, () => {
                    setLoading(false);
                })
            }, () => {
                setLoading(false);
            })
        }, () => {
            setLoading(false);
        });
    }, []);

    const handleDeleteClick = (id) => (event) => {
        event.stopPropagation();
        setLoading(true);
        deleteAssociation({id: id}).then( ({result, retrows}) => {
            setRows(retrows);
            setLoading(false);
        }, () => {
            setLoading(false);
        });
    };

    const onSubmit = (newrow) => {
        if(newrow.phrase_id && newrow.action_id) {
            setLoading(true);
            setAssociation(newrow).then((retrow) => {
                let newRows = rows.map((row) => ((row.id === newrow.id ) ? retrow : row) );
                setRows(newRows);
                setLoading(false);
            }, () => {
                let newRows = rows;
                setRows(newRows);
                setLoading(false);
            });
        }
        return newrow;
    };

    const onReOrderRow = (rowId, dropId) => {
        setLoading(true);
        const originals = rows.slice();
        reOrderRows(rowId, dropId, rows, setRows);

        const rowPos = rows.findIndex(el => el.id === rowId );
        const rowOrder = rows[rowPos].order;
        const dropPos = rows.findIndex(el => el.id === dropId );
        const dropOrder = rows[dropPos].order;

        const begin = Math.min(rowOrder, dropOrder);
        const end = Math.max(rowOrder, dropOrder);

        reorderAssociations({ interval: [begin, end], dropOrder: dropOrder }).then( ({result, retrows}) => {
            retrows.sort((a, b) => (a.order - b.order));
            setRows(retrows);
            setLoading(false);
        }, () => {
            setRows(originals);
            setLoading(false);
        } );
    };

    const doubleClickEvent = document.createEvent('MouseEvents');
    doubleClickEvent.initEvent('dblclick', true, true);

    const EditToolbar = () => {
        const handleClick = () => {
            setLoading(true);

            const order = rows[rows.length - 1].order + 1;
            setRows(rows.concat(createData(0, order, 1, 1)));

            setTimeout(() => { // Wait for the grid to render with the new row
                document.querySelector('[data-id="0"] > div').dispatchEvent(doubleClickEvent);
                setLoading(false);
            });
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Adicionar Nova Ação
                </Button>
            </GridToolbarContainer>
        );
    };

    const ActionsBar = ({ id }) => {
        return [
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
            />,
        ];
    };

    function SelectEditInputCell(props) {
        const { id, value, field } = props;
        const apiRef = useGridApiContext();

        const handleChange = async (event) => {
            await apiRef.current.setEditCellValue({ id, field, value: parseInt(event.target.value) });
            apiRef.current.stopCellEditMode({ id, field });
        };

        let items = [];
        if (field === 'action_id') {
            items = actions;
        } else if (field === 'phrase_id') {
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
    }

    function renderSelectEditInputCell(params) {
        return <SelectEditInputCell {...params} />;
    }

    const renderSelectCell = (params) => {
        const { id, value, field, children } = params;
        let content = null;
        if (field === 'action_id') {
            content = value ? actions.find((el)=>(el.id === parseInt(value))).name : children;
        } else if (field === 'phrase_id') {
            content = value ? phrases.find((el)=>(el.id === parseInt(value))).name: children;
        }
        return content;
    }

    const columns = [
        // { field: 'order', headerName: '#', type: 'number', editable: false },
        { field: 'phrase_id', headerName: 'Frase', renderCell: renderSelectCell, renderEditCell: renderSelectEditInputCell, width: 400, editable: true, flex: 1 },
        { field: 'action_id', headerName: 'Ação', renderCell: renderSelectCell, renderEditCell: renderSelectEditInputCell, width: 400, editable: true, flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Excluir',
            width: 100,
            cellClassName: 'actions',
            getActions: ActionsBar,
        },
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}} gutterBottom>
                Editar Associações
            </Typography>
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    autoHeight={true}
                    processRowUpdate={onSubmit}
                    components={ loadingOverlay ?
                        { Toolbar: EditToolbar, Row: SortableGridRow, LoadingOverlay: LinearProgress } :
                        { Toolbar: EditToolbar, Row: SortableGridRow }
                    }
                    componentsProps={{ row: { reOrderRow: onReOrderRow } }}
                    experimentalFeatures={{ newEditingApi: true }}
                />
            </div>
        </Box>
    );
}
