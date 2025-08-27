"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Madhya Pradesh bounds (used in both components)
const mpBounds = [
  [21.2, 74.0], // SW
  [26.9, 82.0], // NE
];

// Load cache from localStorage
const coordCache = JSON.parse(localStorage.getItem("coordCache") || "{}");

// Get lat/lng from pin using Nominatim with caching
const getCoordinates = async (pin) => {
  if (coordCache[pin]) return coordCache[pin]; // return cached result

  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=India&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
      coordCache[pin] = result;
      localStorage.setItem("coordCache", JSON.stringify(coordCache)); // persist cache
      return result;
    }
  } catch (err) {
    console.error("Error fetching coordinates for pin:", pin, err);
  }
  return null;
};

// Call your backend API for data
const fetchPinDataFromAPI = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/v1/admin/mapVisualize", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch pin data");

    const response = await res.json();
    console.log("Fetched pin data:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching pin data:", error);
    return [];
  }
};

// Heatmap Layer
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatPoints = points.map((p) => [p.lat, p.lng, p.intensity]);

    const heatOptions = {
      radius: 50,
      blur: 35,
      maxZoom: 12,
      gradient: {
        0.0: "blue",
        0.2: "cyan",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    };

    const heatLayer = L.heatLayer(heatPoints, heatOptions);
    heatLayer.addTo(map);

    // Fit map to Madhya Pradesh bounds
    map.fitBounds(mpBounds);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

const CrimeMap = () => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  const center = [22.7196, 75.8577]; // Indore approx
  const zoom = 7;

  useEffect(() => {
    async function fetchAndProcessData() {
      setLoading(true);

      const pinData = await fetchPinDataFromAPI();
      const maxCases = Math.max(1, ...pinData.map((item) => item.cases));

      // Fetch coordinates in parallel with caching
      const results = await Promise.all(
        pinData.map(async (item) => {
          const coords = await getCoordinates(item.pin);
          if (!coords) return null;

          const baseIntensity = item.cases / maxCases;
          const adjustedIntensity = Math.pow(baseIntensity, 0.7) * 15; // Boosted

          return { ...item, ...coords, intensity: adjustedIntensity };
        })
      );

      setMapData(results.filter(Boolean)); // remove nulls
      setLoading(false);
    }

    fetchAndProcessData();
  }, []);

  return (
    <Card className="shadow-xl border-gray-300 mx-auto max-w-6xl min-h-screen">
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
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            bounds={mpBounds}
            maxBounds={mpBounds}        // prevents panning outside MP
            maxBoundsViscosity={1.0}     // hard lock
            className="h-full w-full"
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!loading && <HeatmapLayer points={mapData} />}

            {/* Interactive transparent markers for popups */}
            {!loading &&
              mapData.map((point, idx) => (
                <CircleMarker
                  key={idx}
                  center={[point.lat, point.lng]}
                  radius={8}
                  color="transparent"
                  fillColor="transparent"
                  fillOpacity={0}
                >
                  <Popup>
                    <div className="text-sm">
                      <p><b>Pin:</b> {point.pin}</p>
                      <p><b>Cases:</b> {point.cases}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrimeMap;
