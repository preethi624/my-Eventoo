import { useMapEvents, Marker, MapContainer, TileLayer } from "react-leaflet";
import { useState } from "react";

interface LocationPickerProps {
  onAddressSelect: (addressData: any) => void;
}

function LocationMarker({ onAddressSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Fetch address from OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await response.json();

      if (data && data.address) {
        const addressInfo = {
          address: data.display_name || "",
          city: data.address.city || data.address.town || data.address.village || "",
          state: data.address.state || "",
          pincode: data.address.postcode || "",
        };

        // Send to parent (form)
        onAddressSelect(addressInfo);
      }
    },
  });

  return position ? <Marker position={position}></Marker> : null;
}

export default function LocationPicker({ onAddressSelect }: LocationPickerProps) {
  return (
    <MapContainer
      center={[8.5241, 76.9366]} // Trivandrum default
      zoom={13}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker onAddressSelect={onAddressSelect} />
    </MapContainer>
  );
}
