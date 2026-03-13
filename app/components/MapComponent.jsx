"use client";

import { useEffect, useRef } from "react";

function getRiderPos(userLat, userLng, progress) {
  const startLat = userLat + 0.009;
  const startLng = userLng - 0.006;
  return {
    lat: startLat + (userLat - startLat) * progress,
    lng: startLng + (userLng - startLng) * progress,
  };
}

export default function MapComponent({ userLat, userLng, deliveryProgress }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [userLat, userLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 20 }
      ).addTo(map);

      const userIcon = L.divIcon({
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 6px rgba(59,130,246,0.3)"></div>`,
        className: "",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>Your Location</b>")
        .openPopup();

      const riderIcon = L.divIcon({
        html: `<div style="width:36px;height:36px;border-radius:50%;background:#ef4444;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(239,68,68,0.5);">🏍</div>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const riderPos = getRiderPos(userLat, userLng, deliveryProgress);
      const riderMarker = L.marker([riderPos.lat, riderPos.lng], { icon: riderIcon }).addTo(map);
      riderMarker.bindTooltip("Delivery Rider", { permanent: false });

      const startPos = getRiderPos(userLat, userLng, 0);
      L.polyline(
        [[startPos.lat, startPos.lng], [userLat, userLng]],
        { color: "#ef4444", weight: 3, dashArray: "8 6", opacity: 0.7 }
      ).addTo(map);

      mapInstanceRef.current = map;
      riderMarkerRef.current = riderMarker;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!riderMarkerRef.current) return;
    const pos = getRiderPos(userLat, userLng, deliveryProgress);
    riderMarkerRef.current.setLatLng([pos.lat, pos.lng]);
  }, [deliveryProgress, userLat, userLng]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
    </>
  );
}
