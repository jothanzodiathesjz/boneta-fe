import { useState, useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface LocationMarkerProps {
  onLocationFound: (coords: LatLngExpression) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onLocationFound }) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      onLocationFound(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationerror(error) {
      console.error("Error getting location: ", error.message);
      alert(`Error getting location: ${error.message}`);
    }
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default LocationMarker;
