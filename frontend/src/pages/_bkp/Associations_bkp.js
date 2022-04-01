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

import { getPhrases, getActions, getAssociations, setAssociation, deleteAssociation } from "../scripts/api";
import {Typography} from "@mui/material";


function createData(command_id, control_id) {
    return { command_id, control_id };
}
function createRow(command_id, control_id, command_name, control_name) {
    return { command_id, control_id, command_name, control_name };
}

let rowsInit = [
    createRow(3, 1, ' ', ' ')
];

const Associations = () => {
    const [rows, setRows] = useState(rowsInit);
    const [newCommand, setNewCommand] = useState(null);
    const [newControl, setNewControl] = useState(null);
    const [commands, setCommands] = useState([]);
    const [controls, setControls] = useState([]);
    const [inEditMode, setInEditMode] = useState(false);

    useEffect(() => {
        getPhrases().then((cmds)=>{
            setCommands(cmds);
            getActions().then((ctrls)=>{
                setControls(ctrls);
                getAssociations().then((data)=>{
                    let newRows = data.map((pair) => {
                        let cmd_id = cmds.findIndex(el => el.id === pair.command_id );
                        let ctrl_id = ctrls.findIndex(el => el.id === pair.control_id );
                        return createRow(pair.command_id, pair.control_id, cmds[cmd_id].name, ctrls[ctrl_id].name);
                    });
                    setRows(newRows);
                });
            });
        });
    }, []);

    const onDelete = (command_id, control_id, key) => {
        deleteAssociation(createData(command_id, control_id));
        let newrows = rows.slice();
        newrows.splice(key, 1);
        setRows(newrows);
    };

    const onNew = () => {
        setInEditMode(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if(newControl && newCommand) {
            let newrows = rows.slice();
            setInEditMode(false);
            const newrel = createData(newCommand, newControl);
            const cmd_id = commands.findIndex(el => el.id === newrel.command_id );
            const ctrl_id = controls.findIndex(el => el.id === newrel.control_id );
            const newrow = createRow(newrel.command_id, newrel.control_id, commands[cmd_id].name, controls[ctrl_id].name);
            newrows.push(newrow);
            setRows(newrows);
            setAssociation(newrel);
        }
    };


    return (
        <React.Fragment>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}}>Editar Relações entre voz e controle</Typography>
            <form action="#"
                  onSubmit={handleSubmit}
                  onBlur={handleSubmit}>
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
                                    </TableCell>
                                    <TableCell align="left">
                                        {row.command_name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {row.control_name}
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
                            { inEditMode ? (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell scope="row" padding="checkbox" align="left">
                                        <Checkbox
                                            color="primary"
                                            checked={false}
                                            onChange={()=>{}}
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <FormControl fullWidth>
                                            <InputLabel id="command-label">Comando</InputLabel>
                                            <Select
                                                labelId="command-label"
                                                id="command_id"
                                                value={newCommand}
                                                label="Comando"
                                                onChange={(e) => {setNewCommand(e.target.value)}}
                                            >
                                                {commands.map((cmd) => (
                                                    <MenuItem value={cmd.id}>{cmd.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="left">
                                        <FormControl fullWidth>
                                            <InputLabel id="control-label">Controle</InputLabel>
                                            <Select
                                                labelId="control-label"
                                                id="control_id"
                                                value={newControl}
                                                label="Controle"
                                                onChange={(e) => {setNewControl(e.target.value)}}
                                            >
                                                {controls.map((ctrl) => (
                                                    <MenuItem value={ctrl.id}>{ctrl.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            aria-label="upload picture" component="span"
                                            onClick={()=>{}}
                                            disabled="disabled"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ) : '' }
                        </TableBody>
                    </Table>
                </TableContainer>
                <input type="submit" style={{display:'none', position: 'absolute', left: '-9999px'}}/>
            </form>
        </React.Fragment>
    );
};
export default Associations;
