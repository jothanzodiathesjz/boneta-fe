import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { Button } from 'primereact/button';

// Set default icon for Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationMarkerProps {
  onCoordsChange?: (coords: LatLngExpression) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onCoordsChange}) => {
  // const [position, setPosition] = useState<LatLngExpression | null>(current_coords);
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);
  const handleCoordsChange = useCallback((coords: LatLngExpression) => {
    setCurrentPosition(coords);
      onCoordsChange && onCoordsChange(coords);
  }, [onCoordsChange]);

  useEffect(() => {
    if (navigator.geolocation && currentPosition === null) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // console.log("Geolocation success:", latitude, longitude);
          setCurrentPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting geolocation:", error.message);
          alert(`Error getting geolocation: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [currentPosition]);

  const map = useMapEvents({
    dblclick(e) {
        handleCoordsChange(e.latlng);
        // console.log("New coordinates:", e.latlng);
        // onCoordsChange && onCoordsChange(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    locationfound(e) {
      if (!currentPosition) { // Only update if position is null
        setCurrentPosition(e.latlng);
        handleCoordsChange(e.latlng);
        // console.log("New coordinates:", e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
    locationerror(error) {
      console.error("Error getting location: ", error.message);
      alert(`Error getting location: ${error.message}`);
    }
  });

  useEffect(() => {
    if (!currentPosition) {
      map.locate({ setView: true, maxZoom: 16 });
    }
  }, [map, currentPosition]);

  return currentPosition && (
    <Marker  position={currentPosition}>
      <Popup>You are here: now </Popup>
    </Marker>
  );
};

interface MapComponentProps {
  onCoordsChange?: (coords: LatLngExpression) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onCoordsChange }) => {
 

  return (
    <MapContainer
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '30vh', width: '100%' ,zIndex:2}}
    
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>Your current location</Popup>
        </Marker>
      )} */}
      <LocationMarker 
      onCoordsChange={onCoordsChange} />
    </MapContainer>
  );
};

export default MapComponent;
