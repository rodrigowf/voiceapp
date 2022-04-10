import React, {useEffect, useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import Box from "@mui/material/Box";
import MicIcon from '@mui/icons-material/Mic';

const keyword = 'computador';
const maxInterval = 2300;


const urlAudioRec = '/sound/wpp_chat_notify.m4a';
const urlAudioStop = '/sound/scifi.wav';
const urlAudioDone = '/sound/correct-answer-tone.wav';

const audioRec = new Audio(urlAudioRec);
const audioStop = new Audio(urlAudioStop);
const audioDone = new Audio(urlAudioDone);


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

const ContSpeechmic = (props) => {
    const {
        transcript,
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const startListening = () => SpeechRecognition.startListening({ continuous: true });

    const [hasSound, setHasSound] = useState(false);
    const [recognizing, setRecognizing] = useState(false);
    const [lastTimeout, setLastTimeout] = useState(null);


    useEffect(() => {
        setHasSound(true);
        setTimeout(()=>{setHasSound(false)}, 500)
    }, [transcript]); // Only re-run the effect if count changes


    const onRecognition = () => {
        setRecognizing(false);
        setLastTimeout(null);
        audioStop.play();
        props.onRecog(transcript).then(()=>{
            audioDone.play();
        });
    }

    useEffect(() => {
        if(!recognizing) { // testa se recognition tem que iniciar (detecção de palavra chave)
            const lastWord = transcript.split(" ").pop();
            if(lastWord === keyword) {
                resetTranscript();
                setRecognizing(true);
                audioRec.play();
                setLastTimeout(setTimeout(onRecognition, maxInterval));
            }
        }
        else if(lastTimeout !== null) {
            clearTimeout(lastTimeout);
            setLastTimeout(setTimeout(onRecognition, maxInterval)); // intervalo desde quando usuario para de falar até chamar final da detecção
        }

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
                    sx={recognizing ? iconRedStyle : {border: '1px solid indianred'}}
                    className={hasSound ? 'hasSound' : ''}>
                    <MicIcon />
                </IconButton>) :
                (<IconButton
                    onClick={startListening}
                    sx={{border: '1px solid lightgrey'}}>
                    <MicIcon />
                </IconButton>)
            }
            <Chip
                label={recognizing ? transcript : ''}
                sx={chipStyle}
                color={recognizing ? 'error' : 'default'}
            />
        </Box>
    );
};
export default ContSpeechmic;
