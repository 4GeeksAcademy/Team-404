import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const Mapa = () => (
    <APIProvider apiKey={AIzaSyBWuBaficPm3aUL - DXQUMK8EUZn8Qttdqs}>
        <Map
            style={{ width: '100vw', height: '100vh' }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
        />
    </APIProvider>
);

export default Mapa