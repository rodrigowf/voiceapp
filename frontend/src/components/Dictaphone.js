import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import Box from "@mui/material/Box";

export const chipStyle = {
    display: 'flex',
    width: 'fit-content',
    fontSize: '1rem',
    whiteSpace: 'break-spaces',
    height: 'auto',
    padding: '3px',
    margin: '3px 15px 3px 8px',
    '& .MuiChip-label': { whiteSpace: 'break-spaces' }
};

const Dictaphone = (props) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if(!listening && transcript !== "") {
            props.onRecog(transcript);
        }
    }, [listening]); // Only re-run the effect if count changes

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" gutterBottom component="div" sx={{ display: 'flex', margin: '3px 8px 3px 15px' }}>
                Mic: {listening ? 'ON' : 'OFF'}
            </Typography>

            <ButtonGroup variant="contained" size="small" sx={{ margin: '0 8px 0 8px' }}>
                {listening ?
                    (<Button
                        onClick={SpeechRecognition.stopListening}
                        variant="contained" size="small" color="secondary">
                        Stop
                    </Button>) :
                    (<Button
                        onClick={SpeechRecognition.startListening}
                        variant="contained" size="small" color="success">
                        Start
                    </Button>)}
                <Button
                    onClick={resetTranscript}
                    variant="outlined" size="small" sx={{ color: '#64748B', borderColor: '#64748B' }}>
                    Clean
                </Button>
            </ButtonGroup>
            <Chip
                label={transcript}
                color={listening ? 'secondary' : 'success'}
                sx={chipStyle}
            />
        </Box>
    );
};
export default Dictaphone;
