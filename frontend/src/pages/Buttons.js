import React, {useEffect, useState} from 'react';
import { Box, Typography, IconButton, Icon, Grid } from "@mui/material";

import { actionsApi, executeAction } from "../scripts/api";


export default function Buttons() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        actionsApi.getList().then( (data) => {
            setRows(data);
            setLoading(false);
        }, () => {
            setLoading(false);
        });
    }, []);

    const handleClick = (id) => {
        setLoading(true);
        executeAction(id).then(()=>{
            setLoading(false);
        }, () => {
            setLoading(false);
        });
    };

    return (
        <Box sx={{maxWidth: '1488px', margin: 'auto', width: 'fit-content'}}>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}} gutterBottom>
                Executar Ações
            </Typography>
            <Grid direction="row" spacing={2} sx={{margin:2, width: 'fit-content'}}>
                {rows.map((action)=>( action.icon && action.icon !== '' &&
                    <IconButton
                        key={action.id}
                        onClick={()=>{handleClick(action.id)}}
                        sx={buttonStyle(action.type)}
                        color="default" size="100px"
                        aria-label={action.name}>
                            <Icon sx={{fontSize:'3.5em', margin:1}}>{action.icon}</Icon>
                    </IconButton>
                ))}
            </Grid>
        </Box>
    );
}

const buttonStyle = (type) => {
    let color = 'black';
    let bgcolor = 'blue';
    let hoverColor = 'lightblue';

    switch (type) {
        case 'Console':
            color = '#3e091b';
            bgcolor = '#ff99bb';
            hoverColor = '#ffd3e1';
            break;
        case 'HotKey':
            color = '#1a2b49';
            bgcolor = '#9bc0ff';
            hoverColor = '#cedffe';
            break;
        case 'Browser':
            color = '#0c3c1b';
            bgcolor = '#c7f7d4';
            hoverColor = '#dfffe8';
            break;
        case 'MQTT':
            color = '#453216';
            bgcolor = '#ffda99';
            hoverColor = '#ffeecd';
            break;
    }

    return {
        backgroundColor: bgcolor,
        color: color,
        '&:hover': {
            backgroundColor: hoverColor,
        },
        margin: 1.1
    }
};
