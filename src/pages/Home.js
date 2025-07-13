import React, { useEffect } from 'react';
import NumberPlateScanner from '../components/NumberPlateScanner';
import VoiceWakerWord from '../components/VoiceWakeWord';
import {getMany,delMany, del,get} from 'idb-keyval';






const Home=()=>{
    
useEffect(()=>{
    const syncEmergencyData=async()=>{
        const keys=JSON.parse(localStorage.getItem('emergency-keys')|| '[]');

        for(const key of keys){
            const data=await get(key);
            if(data){
                console.log(`Syncing emergency:`,data);
                // TODO: replace this with an actual API call
                await del(key);   
            }
        }
        localStorage.removeItem('emergency-keys');
        console.log('Synced and cleared offline emergencies')
    };
    window.addEventListener('online',syncEmergencyData);

    return ()=> window.removeEventListener('online',syncEmergencyData);
},[]);
    return(
        <div>
            <h1>Sherox Safety Dashboard</h1>
            <NumberPlateScanner/>
            <VoiceWakerWord/>
        </div>
    );
};

export default Home;