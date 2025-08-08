"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Setup Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Severity → Marker color
const iconColors = {
  High: "red",
  Medium: "orange",
  Low: "green",
};

// Utility delay function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Get lat/lng from pin using Nominatim
const getCoordinates = async (pin) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=India&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    console.error("Error fetching coordinates for pin:", pin, err);
  }
  return null;
};

// 🔁 Call your backend API for data
const fetchPinDataFromAPI = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/v1/admin/mapVisualize", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch pin data");
    }

    const response = await res.json();
    console.log("Fetched pin data:", response.data);
    return response.data || []; // Adjust according to API structure
  } catch (error) {
    console.error("Error fetching pin data:", error);
    return [];
  }
};

const CrimeMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);

      const pinData = await fetchPinDataFromAPI();
      const results = [];

      for (const item of pinData) {
        const coords = await getCoordinates(item.pin);
        if (coords) {
          results.push({ ...item, ...coords });
        }
        await delay(1000); // wait 1 second between API calls
      }

      setLocations(results);
      setLoading(false);
    }

    fetchLocations();
  }, []);

  return (
    <Card className="shadow-xl border-gray-300 mx-auto max-w-6xl">
      <CardHeader>
        <CardTitle className="text-blue-700 text-2xl font-bold text-center mb-2">
          MP Cybercrime Heatmap
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Crime severity visualization across Madhya Pradesh
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[550px] rounded-lg overflow-hidden border shadow relative">
          {loading && (
            <div className="absolute inset-0 z-[100] bg-white/70 flex items-center justify-center">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          <MapContainer
            center={[23.2599, 78.0000]}
            zoom={7.3}
            scrollWheelZoom={true}
            className="h-full w-full"
            maxBounds={[[20.5, 74], [27.5, 82]]}
            maxBoundsViscosity={1.0}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {!loading &&
              locations.map((loc, idx) => (
                <Marker
                  key={idx}
                  position={[loc.lat, loc.lng]}
                  icon={L.icon({
                    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${iconColors[loc.severity]}-dot.png`,
                    iconSize: [32, 32],
                  })}
                >
                  <Popup>
                    <strong>PIN:</strong> {loc.pin} <br />
                    <strong>Severity:</strong> {loc.severity} <br />
                    <strong>Cases:</strong> {loc.cases}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrimeMap;
