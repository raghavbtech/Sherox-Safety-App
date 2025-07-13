import React from 'react';
import NumberPlateScanner from '../components/NumberPlateScanner';
import VoiceWakerWord from '../components/VoiceWakeWord';


const Home=()=>{
    return(
        <div>
            <h1>Sherox Safety Dashboard</h1>
            <NumberPlateScanner/>
            <VoiceWakerWord/>
        </div>
    );
};

export default Home;