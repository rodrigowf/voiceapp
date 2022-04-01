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

import { getPhrases, getActions, getAssociations, setAssociation, deleteAssociation } from "../scripts/api";

function createData(command_id, control_id) {
    return { command_id, control_id };
}

let rowsInit = [
    createData(3, 1)
];

const Relations = () => {
    const [rows, setRows] = useState(rowsInit);
    const [commands, setCommands] = useState([]);
    const [controls, setControls] = useState([]);
    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowKey: null
    });

    useEffect(() => {
        getAssociations().then((data)=>{
            setRows(data);
        });
        getPhrases().then((data)=>{
            setCommands(data);
        });
        getActions().then((data)=>{
            setControls(data);
        });
    }, []);

    const onEdit = (rowKey) => {
        setInEditMode({
            status: true,
            rowKey: rowKey
        });
    };

    const onDelete = (command_id, control_id, key) => {
        deleteAssociation({command_id: command_id, control_id: control_id});
        let newrows = rows.slice();
        newrows.splice(key, 1);
        setRows(newrows);
    };

    const onNew = () => {
        setRows(rows.concat(createData(0,0)));
    }

    const valueChanged = (event) => {
        event.preventDefault();

        let newrows = rows.slice();

        const key = inEditMode.rowKey;

        if (event.type === 'submit') {
            const command_id = event.target.elements.namedItem('command_id').value;
            const control_id = event.target.elements.namedItem('control_id').value;
            if(command_id && control_id) {
                newrows[key] = {command_id: command_id, control_id: control_id};
            }
        } else {
            const fieldName = event.target.name;
            const fieldValue = event.target.value;
            if(fieldName && fieldValue) {
                newrows[key][fieldName] = fieldValue;
            }
        }

        if(newrows[key].command_id !== 0 && newrows[key].control_id !== 0) {
            setAssociation(newrows[key]);
            setInEditMode({
                status: false,
                rowKey: null
            });
        }
        setRows(newrows);
    };


    return (
        <React.Fragment>
            <form action="#"
                  onSubmit={valueChanged}
                  onBlur={valueChanged}>
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
                                <TableCell>Comando</TableCell>
                                <TableCell>Controle</TableCell>
                                <TableCell align="right">Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, key) => (
                                <TableRow
                                    key={key}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell scope="row" padding="checkbox" align="left">
                                        <Checkbox
                                            color="primary"
                                            checked={false}
                                            onChange={()=>{}}
                                        />
                                        { inEditMode.status && inEditMode.rowKey === key ? (
                                            <input style={{display: 'none'}} name="key" id="key" defaultValue={key} />
                                            ) : ''
                                        }
                                    </TableCell>
                                    <TableCell align="left"
                                               onClick={()=>{onEdit(key)}}>
                                        { inEditMode.status && inEditMode.rowKey === key ? (
                                                <TextField
                                                    variant="standard"
                                                    name="command_id" id="command_id"
                                                    defaultValue={row.command_id}
                                                />
                                            ) :
                                            row.command_id
                                        }
                                    </TableCell>
                                    <TableCell align="left"
                                               onClick={()=>{onEdit(key)}}>
                                        { inEditMode.status && inEditMode.rowKey === key ? (
                                            <TextField
                                                variant="standard"
                                                name="control_id" id="control_id"
                                                defaultValue={row.control_id}
                                            />
                                        ) :
                                            row.control_id
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            aria-label="upload picture" component="span"
                                            onClick={()=>{onDelete(row.command_id, row.control_id, key)}}
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
export default Relations;
