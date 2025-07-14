import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  Polyline,
  InfoWindow
} from '@react-google-maps/api';
import { mockSafeData } from '../utils/mockSafetyData';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const getScoreColor = (locationName) => {
  const data = mockSafeData[locationName];
  if (!data) return '#999'; // gray for unknown

  const score = data.lighting * 2 - data.crimes * 3;

  if (score > 5) return 'green';
  if (score > 0) return 'yellow';
  return 'red';
};

const RoutePlanner = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [requestRoute, setRequestRoute] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRequestRoute(true);
    setDirections(null);
    setActivePopup(null);
  };

  const handleDirectionsCallback = (response) => {
    if (response && response.status === 'OK') {
      setDirections(response);
      setRequestRoute(false);
    } else {
      console.error('Directions request failed', response);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDqq5Z8m3RQ12kAD_nOdzNSR7C32Nklr20">
      <div style={{ padding: '1rem' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            style={{ marginRight: '1rem' }}
          />
          <input
            type="text"
            placeholder="Enter Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="submit" style={{ marginLeft: '1rem' }}>Get Route</button>
        </form>
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {requestRoute && origin && destination && (
          <DirectionsService
            options={{
              destination,
              origin,
              travelMode: 'DRIVING'
            }}
            callback={handleDirectionsCallback}
          />
        )}

        {directions && directions.routes[0].legs[0].steps.map((step, index) => {
          const path = [
            { lat: step.start_location.lat(), lng: step.start_location.lng() },
            { lat: step.end_location.lat(), lng: step.end_location.lng() }
          ];

          const stepText = step.instructions.replace(/<[^>]+>/g, '');
          const matchingKey = Object.keys(mockSafeData).find(key =>
            stepText.includes(key)
          );
          const color = getScoreColor(matchingKey);
          const data = mockSafeData[matchingKey];
          const score = data ? data.lighting * 2 - data.crimes * 3 : 'N/A';
          const level = score === 'N/A' ? 'Unknown' : score > 5 ? 'Safe 🟢' : score > 0 ? 'Medium 🟡' : 'Unsafe 🔴';

          return (
            <React.Fragment key={index}>
              <Polyline
                path={path}
                onClick={() =>
                  setActivePopup({
                    lat: step.end_location.lat(),
                    lng: step.end_location.lng(),
                    label: matchingKey || 'Unknown',
                    score,
                    level
                  })
                }
                options={{
                  strokeColor: color,
                  strokeOpacity: 0.8,
                  strokeWeight: 6
                }}
              />
              {activePopup &&
                activePopup.label === (matchingKey || 'Unknown') && (
                  <InfoWindow
                    position={{ lat: step.end_location.lat(), lng: step.end_location.lng() }}
                    onCloseClick={() => setActivePopup(null)}
                  >
                    <div style={{ fontSize: '14px' }}>
                      <strong>🛣️ {activePopup.label}</strong><br />
                      🔢 SafeScore: {activePopup.score}<br />
                      🔒 Level: {activePopup.level}
                    </div>
                  </InfoWindow>
              )}
            </React.Fragment>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default RoutePlanner;
