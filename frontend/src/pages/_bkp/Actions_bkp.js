import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { getActions, setActions, deleteActions } from "../scripts/api";
import {Typography} from "@mui/material";


const types = [
	{ value: 1, label: 'Console' },
	{ value: 2, label: 'HotKey' },
	{ value: 3, label: 'Browser' },
	{ value: 4, label: 'MQTT' }
];

function createData(id, name, type, program, parameters) {
    return { id, name, type, program, parameters };
}

let rowsInit = [
    createData(1, 'play vlc', 2, 'vlc', 'playpause'),
    createData(2, 'Play chrome', 2, 'chrome', 'space'),
];


const Actions = () => {
    const [rows, setRows] = useState(rowsInit);
    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowId: null
    });

    useEffect(() => {
        getActions().then((data)=>{
            setRows(data);
        })
    }, []);

    const onEdit = (rowId) => {
        setInEditMode({
            status: true,
            rowId: rowId
        });
    };

    const onDelete = (id) => {
        deleteActions({id: id});
        let newrows = rows.slice();
        const idx = rows.findIndex(el => el.id === id );
        newrows.splice(idx, 1);
        setRows(newrows);
    };

    const onNew = () => {
        setRows(rows.concat(createData(null, '', 1, '', '')));
    }

    const onSubmit = (event) => {
        event.preventDefault();

        let newrows = rows.slice();
        const idx = rows.findIndex(el => el.id === inEditMode.rowId );

        if (event.type === 'submit') {
            const id = inEditMode.rowId;
            const name = event.target.elements.namedItem('name').value;
            const type = event.target.elements.namedItem('type').value;
            const program = event.target.elements.namedItem('program').value;
            const parameters = event.target.elements.namedItem('parameters').value;
            newrows[idx] = createData(id, name, type, program, parameters);
        } else {
            const fieldName = event.target.name;
            const fieldValue = event.target.value;
            newrows[idx][fieldName] = fieldValue;
        }

        if(newrows[idx].name !== '' && newrows[idx].phrase !== '') {
            setActions(newrows[idx]);
            setInEditMode({
                status: false,
                rowId: null
            });
        }
        setRows(newrows);
    };


    return (
        <React.Fragment>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}}>Editar Controles de Automação</Typography>
            <form action="#"
                  onSubmit={onSubmit}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <caption>
                            <Button variant="contained" color="success" align="right"
                                    onClick={onNew}>
                                Novo
                            </Button>
                        </caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell colSpan={1}>Nome</TableCell>
                                <TableCell colSpan={1}>Tipo</TableCell>
                                <TableCell colSpan={2}>Programa / Device</TableCell>
                                <TableCell colSpan={1}>Parâmetros</TableCell>
                                <TableCell align="right">Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell scope="row" padding="checkbox" align="left">
                                        <Checkbox
                                            color="primary"
                                            checked={false}
                                            onChange={()=>{}}
                                        />
                                        { inEditMode.status && inEditMode.rowId === row.id ? (
                                            <input style={{display: 'none'}} name="id" id="id" defaultValue={row.id} />
                                        ) : ''
                                        }
                                    </TableCell>
                                    <TableCell align="left" colSpan={1}
                                               onClick={()=>{onEdit(row.id)}}>
                                        { inEditMode.status && inEditMode.rowId === row.id ? (
                                                <TextField
                                                    sx={{ width: '50%' }}
                                                    variant="standard"
                                                    name="name" id="name"
                                                    defaultValue={row.name}
                                                />
                                            ) :
                                            row.name
                                        }
                                    </TableCell>
                                    <TableCell align="left" colSpan={1}
                                               onClick={()=>{onEdit(row.id)}}>
                                        { inEditMode.status && inEditMode.rowId === row.id ? (
                                                <FormControl fullWidth>
                                            		<InputLabel id="type-label">Tipo</InputLabel>
                                            		<Select
                                                		labelId="type-label"
                                                		name="type" id="type"
                                                		defaultValue={row.type}
                                                		label="Tipo"
                                            		>
                                                		{types.map((tp) => (
                                                    		<MenuItem value={tp.value}>{tp.label}</MenuItem>
                                                		))}
                                            		</Select>
                                        		</FormControl>
                                            ) :
                                            types[row.type - 1]['label']
                                        }
                                    </TableCell>
                                    <TableCell align="left" colSpan={2}
                                               onClick={()=>{onEdit(row.id)}}>
                                        { inEditMode.status && inEditMode.rowId === row.id ? (
                                                <TextField
                                                    sx={{ width: '100%' }}
                                                    variant="standard"
                                                    name="program" id="program"
                                                    defaultValue={row.program}
                                                />
                                            ) :
                                            row.program
                                        }
                                    </TableCell>
                                    <TableCell align="left" colSpan={1}
                                               onClick={()=>{onEdit(row.id)}}>
                                        { inEditMode.status && inEditMode.rowId === row.id ? (
                                                <TextField
                                                    sx={{ width: '100%' }}
                                                    variant="standard"
                                                    name="parameters" id="parameters"
                                                    defaultValue={row.parameters}
                                                />
                                            ) :
                                            row.parameters
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            aria-label="delete" component="span"
                                            onClick={()=>{onDelete(row.id)}}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <input type="submit" style={{display:'none', position: 'absolute', left: '-9999px'}}/>
            </form>

        </React.Fragment>
    );
};
export default Actions;
