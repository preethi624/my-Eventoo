/*import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type EventMapProps = {
  venueName?: string; 
  title?: string;
};

const EventMap: React.FC<EventMapProps> = ({ venueName, title = "Event Location" }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    
    if (!venueName) return;

    
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    });
    console.log("venuename",venueName);
    

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(venueName)}`,
          {
            headers: {
              'User-Agent': 'eventManagement/1.0 (your@email.com)', 
              'Referer': window.location.origin,
            },
          }
        );
        const data = await response.json();
        console.log("data",data);
        
        if (data.length > 0) {
          setLat(parseFloat(data[0].lat));
          setLng(parseFloat(data[0].lon));
        } else {
          console.warn('No location found for', venueName);
        }
      } catch (error) {
        console.error("Error fetching coordinates", error);
      }
    };

    fetchCoordinates();
  }, [venueName]);

  
  if (!venueName || lat === null || lng === null) {
    return null;
  }

  return (
    <div style={{ height: '200px', width: '100%', borderRadius: '10px', overflow: 'hidden', marginTop: '15px' }}>
      <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
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

export default EventMap;*/

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

type EventMapProps = {
  venueName?: string; 
  title?: string;
};

const EventMap: React.FC<EventMapProps> = ({ venueName, title = "Event Location" }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    if (!venueName) return;

    // Fix Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    });

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
          params: {
            q: venueName,
              key: `${import.meta.env.VITE_REACT_APP_OPENCAGE_API_KEY}`, // Add your key to .env
            limit: 1,
            countrycode: "IN", // restrict search to India
          }
        });

        if (response.data.results.length > 0) {
          setLat(response.data.results[0].geometry.lat);
          setLng(response.data.results[0].geometry.lng);
        } else {
          console.warn("No location found for", venueName);
        }
      } catch (error) {
        console.error("Error fetching coordinates", error);
      }
    };

    fetchCoordinates();
  }, [venueName]);

  if (!venueName || lat === null || lng === null) return null;

  return (
    <div style={{ height: '200px', width: '100%', borderRadius: '10px', overflow: 'hidden', marginTop: '15px' }}>
      <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
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
