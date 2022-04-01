import React, {useEffect, useState} from 'react';
import { DataGrid, GridToolbarContainer, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SortableGridRow, { reOrderRows } from "../components/SortableGridRow";

import { getPhrases, setPhrase, deletePhrase, reorderPhrases } from "../scripts/api";


const doubleClickEvent = document.createEvent('MouseEvents');
doubleClickEvent.initEvent('dblclick', true, true);

function createData(id, order, name, phrase) {
    return { id, order, name, phrase };
}

export default function Phrases() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOverlay, setLoadingOverlay] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPhrases().then( (data) => {
            setRows(data);
            setLoading(false);
            setLoadingOverlay(true);
        }, () => {
            setLoading(false);
        })
    }, []);

    const handleDeleteClick = (id) => (event) => {
        event.stopPropagation();
        setLoading(true);
        deletePhrase({id: id}).then( ({result, retrows}) => {
            setRows(retrows);
            setLoading(false);
        }, () => {
            setLoading(false);
        });
    };

    const onSubmit = (newrow) => {
        if(newrow.name !== '' && newrow.phrase !== '') {
            setLoading(true);
            setPhrase(newrow).then((retrow) => {
                let newRows = rows.map((row) => (row.id === newrow.id ? retrow : row) );
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

        reorderPhrases({ interval: [begin, end], dropOrder: dropOrder }).then( ({result, retrows}) => {
            retrows.sort((a, b) => (a.order - b.order));
            setRows(retrows);
            setLoading(false);
        }, () => {
            setRows(originals);
            setLoading(false);
        } );
    };

    const EditToolbar = () => {
        const handleClick = () => {
            setLoading(true);

            const order = rows[rows.length - 1].order + 1;
            setRows(rows.concat(createData(0, order, '', '')));

            setTimeout(() => { // Wait for the grid to render with the new row
                document.querySelector('[data-id="0"] > div').dispatchEvent(doubleClickEvent);
                setLoading(false);
            });
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Adicionar Nova Frase
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

    const columns = [
        // { field: 'order', headerName: '#', type: 'number', editable: false },
        { field: 'name', headerName: 'Nome', width: 300, editable: true },
        { field: 'phrase', headerName: 'Frase', width: 500, editable: true, flex: 1 },
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
                Editar Frases
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
