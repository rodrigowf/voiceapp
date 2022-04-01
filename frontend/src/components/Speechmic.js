import React, {useEffect, useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import Box from "@mui/material/Box";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';


export const chipStyle = {
    display: 'flex',
    width: 'fit-content',
    fontSize: '1rem',
    whiteSpace: 'break-spaces',
    height: 'auto',
    padding: '3px',
    margin: '3px 15px 3px 12px',
    '& .MuiChip-label': { whiteSpace: 'break-spaces' }
};

const iconRedStyle = {
    '&:hover': {
        backgroundColor: '#a32424',
    },
    backgroundColor: '#d32f2f',
    color: 'white',
    transition: '0.5s',
    boxShadow: '0px 0px 0px 0px rgb(0 0 0 / 0%)',

    '&.hasSound': {
        transition: '0.5s',
        boxShadow: '0px 0px 0px 10px rgb(0 0 0 / 10%)',
}
}

const Speechmic = (props) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const [hasSound, setHasSound] = useState(false);

    useEffect(() => {
        if(!listening && transcript !== "") {
            props.onRecog(transcript);
        }
    }, [listening]); // Only re-run the effect if count changes

    useEffect(() => {
        setHasSound(true);
        setTimeout(()=>{setHasSound(false)}, 500)
    }, [transcript]); // Only re-run the effect if count changes

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <Box sx={{ display: 'flex', padding: '10px' }}>
            {listening ?
                (<IconButton
                    onClick={SpeechRecognition.stopListening}
                    variant="contained" color="error"
                    sx={iconRedStyle}
                    className={hasSound ? 'hasSound' : ''}>
                    <MicIcon />
                </IconButton>) :
                (<IconButton
                    onClick={SpeechRecognition.startListening}
                    sx={{border: '1px solid lightgrey'}}>
                    <MicIcon />
                </IconButton>)
            }
            <Chip
                label={transcript}
                sx={chipStyle}
                color={listening ? 'error' : 'default'}
            />
        </Box>
    );
};
export default Speechmic;
