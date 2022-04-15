import React, {useEffect, useState} from 'react';
import { DataGrid, GridToolbarContainer, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, LinearProgress } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SortableGridRow, { reOrderRows } from "../components/SortableGridRow";


export default function SortableGird(props) {
    const { columns, api, emptyRow, newButtonLabel, preload } = props;
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOverlay, setLoadingOverlay] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if(preload) await preload();
            api.getList().then( (data) => {
                setRows(data);
                setLoading(false);
                setLoadingOverlay(true);
            }, () => {
                setLoading(false);
            })
        };
        fetchData();
    }, []);

    const handleDeleteClick = (id) => (event) => {
        event.stopPropagation();
        setLoading(true);
        api.delItem({id: id}).then( ({result, retrows}) => {
            setRows(retrows);
            setLoading(false);
        }, () => {
            setLoading(false);
        });
    };

    const handleSubmit = (newrow) => {
        if(newrow.name !== '' && newrow.program !== '') {
            setLoading(true);
            api.setItem(newrow).then((retrow) => {
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

    const handleReorder = (rowId, dropId) => {
        setLoading(true);
        const originals = rows.slice();
        reOrderRows(rowId, dropId, rows, setRows);
        const rowPos = rows.findIndex(el => el.id === rowId );
        const rowOrder = rows[rowPos].order;
        const dropPos = rows.findIndex(el => el.id === dropId );
        const dropOrder = rows[dropPos].order;
        const begin = Math.min(rowOrder, dropOrder);
        const end = Math.max(rowOrder, dropOrder);
        api.ordList({ interval: [begin, end], dropOrder: dropOrder }).then( ({result, retrows}) => {
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

        const handleAddClick = () => {
            setLoading(true);
            emptyRow.order = rows[rows.length - 1].order + 1;
            setRows(rows.concat(emptyRow));
            setTimeout(() => { // Wait for the grid to render with the new row
                document.querySelector('[data-id="0"] > div').dispatchEvent(doubleClickEvent);
                setLoading(false);
            });
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
                    {newButtonLabel ? newButtonLabel : 'Adicionar Nova'}
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

    const actColIdx = columns.findIndex((el)=>(el.type === 'actions' ));
    columns[actColIdx].getActions = ActionsBar;

    return (
        <div style={{ display: 'flex', flexGrow: 1 }}>
            <DataGrid
                columns={columns}
                rows={rows}
                loading={loading}
                autoHeight={true}
                processRowUpdate={handleSubmit}
                components={ loadingOverlay ?
                    { Toolbar: EditToolbar, Row: SortableGridRow, LoadingOverlay: LinearProgress } :
                    { Toolbar: EditToolbar, Row: SortableGridRow }
                }
                componentsProps={{ row: { handleReorder } }}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </div>
    );
}
