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

import { getPhrases, setPhrase, deletePhrase } from "../scripts/api";
import {Box, Typography} from "@mui/material";

function createData(id, name, phrase) {
    return { id, name, phrase };
}

let rowsInit = [
    createData(1, 'Acender Luz', 'acenda a Luz'),
    createData(2, 'Play', 'toca a música'),
];

const Commands_old = () => {
    const [rows, setRows] = useState(rowsInit);
    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowId: null
    });

    useEffect(() => {
        getPhrases().then((data)=>{
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
        deletePhrase({id: id});
        let newrows = rows.slice();
        const idx = rows.findIndex(el => el.id === id );
        newrows.splice(idx, 1);
        setRows(newrows);
    };

    const onNew = () => {
        setRows(rows.concat({id: null, name: '', phrase: ''}));
    }

    const phraseChanged = (event) => {
        event.preventDefault();

        let newrows = rows.slice();
        const idx = rows.findIndex(el => el.id === inEditMode.rowId );

        if (event.type === 'submit') {
            const id = inEditMode.rowId;
            const name = event.target.elements.namedItem('name').value;
            const phrase = event.target.elements.namedItem('phrase').value;
            newrows[idx] = {id: id, name: name, phrase: phrase};
        } else {
            const fieldName = event.target.name;
            const fieldValue = event.target.value;
            newrows[idx][fieldName] = fieldValue;
        }

        //console.log(newrows[idx]);

        if(newrows[idx].name !== '' && newrows[idx].phrase !== '') {
            setPhrase(newrows[idx]);
            setInEditMode({
                status: false,
                rowId: null
            });
        }
        setRows(newrows);
    };


    return (
        <React.Fragment>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}}>Editar Comandos de Voz</Typography>
            <form action="#"
                  onSubmit={phraseChanged}
                  onBlur={phraseChanged}>
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
                                <TableCell colSpan={3}>Frase</TableCell>
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
                                    <TableCell align="left" colSpan={3}
                                               onClick={()=>{onEdit(row.id)}}>
                                        { inEditMode.status && inEditMode.rowId === row.id ? (
                                            <TextField
                                                sx={{ width: '100%' }}
                                                variant="standard"
                                                name="phrase" id="phrase"
                                                defaultValue={row.phrase}
                                            />
                                        ) :
                                            row.phrase
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            aria-label="upload picture" component="span"
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
export default Commands_old;
