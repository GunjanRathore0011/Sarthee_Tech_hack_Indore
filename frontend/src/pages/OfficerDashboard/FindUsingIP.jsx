import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix marker icon issue in Leaflet + React
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png',
});

function FindUsingIP() {
  const [ip, setIp] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFind = async () => {
    if (!ip.trim()) {
      setError('Please enter an IP address');
      return;
    }
    setError('');
    setLoading(true);
    setData(null);

    try {
      const response = await axios.get(`http://localhost:4000/api/v1/tracking/checkIP?ip=${ip}`);
      setData(response.data);
    } catch (err) {
      setError('Could not fetch IP details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Find Details Using IP Address
      </h1>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Enter IP address"
          className="flex-grow p-2 border rounded text-sm"
        />

        <button
          onClick={handleFind}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition text-sm font-medium"
        >
          {loading ? 'Finding...' : 'Find'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {data && (
          <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-lg p-4 flex flex-col md:flex-row gap-6">


          {/* Left Side - IP Details */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">
              IP Details For: {data.ip}
            </h2>
            <p><strong>ASN:</strong> {data.data.ASN}</p>
            <p><strong>Hostname:</strong> {data.data.host}</p>
            <p><strong>ISP:</strong> {data.data.ISP}</p>
            <p><strong>Organization:</strong> {data.data.organization}</p>
            <p><strong>Country:</strong> {data.data.country_code}</p>
            <p><strong>State/Region:</strong> {data.data.region}</p>
            <p><strong>City:</strong> {data.data.city}</p>
            <p><strong>Latitude:</strong> {data.data.latitude}</p>
            <p><strong>Longitude:</strong> {data.data.longitude}</p>
            <p><strong>Fraud Score:</strong> {data.fraud_score}</p>
          </div>

          {/* Right Side - Map */}
          {data.data.latitude && data.data.longitude && (
            <div className="flex-1 h-64 rounded overflow-hidden">
              <MapContainer
                center={[data.data.latitude, data.data.longitude]}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: "110%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  // attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[data.data.latitude, data.data.longitude]}>
                  <Popup>
                    {data.data.city}, {data.data.region}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FindUsingIP;
