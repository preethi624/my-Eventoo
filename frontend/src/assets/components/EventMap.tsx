import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure you include this

type EventMapProps = {
  latitude?: number;
  longitude?: number;
  title?: string;
};

const EventMap: React.FC<EventMapProps> = ({
  latitude,
  longitude ,
  title = 'Kochi Event',
}) => {
  const lat = latitude ?? 9.9312;
  const lng = longitude ?? 76.2673;
  useEffect(() => {
    // Fix leaflet's default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    });
  }, []);

  if (lat===undefined || lng===undefined) {
    return <div>Loading map...</div>;
  }

  return (
    <div
      style={{
        height: '200px',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        marginTop: '15px',
      }}
    >
      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default EventMap;
