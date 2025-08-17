import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [17, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -35], // point from which the popup should open
});

const MapComponent = () => {
  // Example coordinates → You can replace with dynamic latitude & longitude
  const position = [22.72, 75.85]; // Bhopal, MP

  return (
    <div className="w-full h-[500px] rounded-2xl shadow-lg border overflow-hidden">
      <MapContainer center={position} zoom={13} className="w-full h-full">
        {/* Map UI */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Marker with popup */}
        <Marker position={position} icon={customIcon}>
          <Popup>
            📍 This is the location <br /> (Lat: {position[0]}, Lng: {position[1]})
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
