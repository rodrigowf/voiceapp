import React, {useState} from 'react';
import ContSpeechmic, {chipStyle} from "../components/ContSpeechmic";
import {Box, Typography} from "@mui/material";
import Chip from "@mui/material/Chip";

import { sendPhrase } from "../scripts/api";
import {wait} from "@testing-library/user-event/dist/utils";
// import Speechmic from "../components/Speechmic";

const Listen = () => {

    const [history, setHistory] = useState([]);
    const [phrase, setPhrase] = useState("");
    const [color, setColor] = useState("default");


    const onRecog = (transcription) => {
        let hist = history.slice();
        if (phrase !== "") {
            hist.push({text: phrase, color: color});
            setHistory(hist);
        }
        setPhrase(transcription);
        setColor('default');
        sendPhrase(transcription).then((result)=> {
            if("best_match" in result) {
                setColor('success');
                setPhrase(transcription + '  ->  ' + result.best_match.name);
                console.log('sucesso');
            } else {
                setColor('error');
                console.log('falha');
            }
            console.log(color);
            console.log(result);
        });
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{display: 'block', textAlign: 'center'}}>Reconhecimento de Fala</Typography>
            <Box>
                {history.map((el) => {
                    return (<Chip
                        label={el.text}
                        color={el.color}
                        sx={chipStyle}
                    />);
                })}
                {phrase !== '' ?
                    (<Chip
                        label={phrase}
                        color={color}
                        sx={chipStyle}
                    />) : ''}
            </Box>
            <ContSpeechmic onRecog={onRecog}/>
        </Box>
    );
};
export default Listen;