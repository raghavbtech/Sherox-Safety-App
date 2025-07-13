import React,{useEffect} from "react";
import { triggerEmergency } from "../utils/emergencyHandler";

const VoiceWakeWord=()=>{
    useEffect(()=>{
        const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            alert('Speech Recognition not supported in this browser.');
            return;
        }

        const recognition=new SpeechRecognition();
        recognition.continous=true;
        recognition.interimResults=false;
        recognition.lang='en-US';

        recognition.onresult=(event)=>{
            const transcript=event.results[event.results.length-1][0].transcript;
            console.log('Heard: ',transcript);
            if(transcript.toLowerCase().includes('help me sherox')){
                alert('Emergency Triggered!');
                triggerEmergency({source:'voice'})
            }
        };

        recognition.start();
        return()=>{
            recognition.stop();
        };
    },[]);

    return <h2> Listening for "Help me Sherox"...</h2>
};

export default VoiceWakeWord;