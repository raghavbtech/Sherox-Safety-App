import {set,getMany,delMany} from 'idb-keyval';

export const triggerEmergency=async ({plateNumber='',source='manual'})=>{
    console.log('triggerEmergency() called with:', { plateNumber, source });
    const timestamp=new Date().toISOString();
    const isOnline=navigator.onLine;

    let location={lat:null,lng:null};
    try{
        const pos=await new Promise((res,rej) => 
            navigator.geolocation.getCurrentPosition(res,rej)
        );
        location={
            lat:pos.coords.latitude,
            lng:pos.coords.longitude
        };
    } catch{
        console.warn("Location access denied or unavailable");
    }
    
    
    const emergencyData={
        timestamp,
        source,
        plateNumber,
        location
    };


    if(isOnline){
        console.log("Emergency Sent to Backend: ",emergencyData);
        //TODO:call API here
    }
    else{
        const key=`emergency-${timestamp}`;
        await set(key,emergencyData);
        const savedKeys=JSON.parse(localStorage.getItem('emergency-keys')|| '[]');
        savedKeys.push(key);
        localStorage.setItem('emergency-keys',JSON.stringify(savedKeys));
        console.log('Emergency saved offline: ',emergencyData);
    }
};