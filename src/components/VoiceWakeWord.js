import React,{useEffect} from "react";

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
                // Later: call emergency backend or save to IndexedDB
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