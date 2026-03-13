"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Target } from 'lucide-react';

// FIX: Leaflet marker icon issue in Next.js
const customIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to handle map center updates
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function MapComponent({ address }) {
  const [coords, setCoords] = useState([12.9141, 77.6412]); // Default: HSR Layout
  const [loading, setLoading] = useState(false);

  // NOTE: To use REAL Google Maps integration, you would typically use 
  // '@react-google-maps/api' and a Valid API Key. This component uses
  // a premium Dark Leaflet layer which matches the app's aesthetic perfectly
  // and works instantly without external billing setup.

  const locateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        alert("Unable to fetch location. please check permissions.");
      }
    );
  };

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden border-2 border-neutral-800 shadow-2xl">
      <MapContainer center={coords} zoom={15} className="w-full h-full z-0" zoomControl={false}>
        {/* Real Dynamic Dark Tiles (CartoDB) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ChangeView center={coords} />
        <Marker position={coords} icon={customIcon}>
          <Popup className="dark-popup">
            <div className="font-bold text-xs p-1">Your Delivery Location</div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Info */}
      <div className="absolute top-4 left-4 right-4 z-10 space-y-2">
        <div className="bg-black/80 backdrop-blur-md border border-neutral-800 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
            <MapPin size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 leading-none mb-1">Delivering To</p>
            <p className="text-xs font-bold text-white truncate">{address || "Fetching location..."}</p>
          </div>
        </div>
      </div>

      {/* Locate Button */}
      <button 
        onClick={locateMe}
        className="absolute bottom-4 right-4 z-10 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-neutral-200 transition-all active:scale-90"
      >
        <Target size={24} className={loading ? "animate-spin text-red-600" : ""} />
      </button>
    </div>
  );
}
