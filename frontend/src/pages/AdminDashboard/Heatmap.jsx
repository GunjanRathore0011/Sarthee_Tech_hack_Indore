import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const heatPoints = [
    [23.0225, 72.5714, 0.9],
    [23.03, 72.57, 0.8],
    [23.02, 72.58, 0.85],


    [22.30, 70.78, 0.6],
    [22.56, 70.92, 0.55],


    [22.72, 75.85, 0.6], // Indore
    [23.25, 77.41, 0.5], // Bhopal
    [22.8, 76.4, 0.45],


    // Western Maharashtra / Mumbai cluster
    [19.0760, 72.8777, 0.7],
    [19.2, 72.9, 0.5],
    [19.0, 72.8, 0.4],


    // smaller central India spread
    [21.15, 78.0, 0.35],
    [20.5, 75.9, 0.3]
];

function HeatLayer({ points, options }) {
    const map = useMap();


    useEffect(() => {
        if (!map) return;
        // Convert points to the format leaflet.heat expects: array of [lat, lng, intensity]
        const heat = L.heatLayer(points, options);
        heat.addTo(map);


        // cleanup on unmount
        return () => {
            map.removeLayer(heat);
        };
    }, [map, points, options]);


    return null;
}
function Heatmap() {
    const center = [22.0, 78.0];


    // heat options you can tune: radius, blur, maxZoom, gradient
    const heatOptions = {
        radius: 35, // pixel radius for each point
        blur: 25,
        maxZoom: 11,
        // gradient maps intensity (0..1) to color. You can tweak stops.
        gradient: {
            0.2: 'blue',
            0.4: 'cyan',
            0.6: 'lime',
            0.8: 'orange',
            1.0: 'red'
        }
    };
    return (
        <div>
            <div className="w-full h-[80vh] rounded-lg shadow-lg overflow-hidden">
                <MapContainer center={center} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    <HeatLayer points={heatPoints} options={heatOptions} />
                </MapContainer>
            </div>
        </div>
    )
}

export default Heatmap
