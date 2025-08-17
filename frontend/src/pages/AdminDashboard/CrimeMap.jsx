import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Custom Marker Icon (acha dikhne ke liye)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // marker image
  iconSize: [38, 38], 
  iconAnchor: [19, 38], 
  popupAnchor: [0, -30],
});

export default function SimpleMap() {
  // ✅ Example Coordinates (Indore ka location)
  const position = [22.7196, 75.8577]; 

  return (
    <div className="h-[400px] w-full">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        {/* ✅ Simple OpenStreetMap Standard tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* ✅ Custom Marker */}
        <Marker position={position} icon={customIcon}>
          <Popup>📍 You are here!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
