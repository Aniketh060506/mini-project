import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Tourist } from '@/services/api';

const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const colorMap: Record<string, string> = {
  safe: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
  offline: '#F97316',
};

const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center[0], center[1], map]);
  return null;
};

const MapView = ({ tourists, height = '400px' }: { tourists: Tourist[], height?: string }) => {
  const center: [number, number] = tourists.length > 0 
    ? [tourists[0].lat || 31.0167, tourists[0].lng || 78.1833] 
    : [31.0167, 78.1833];

  return (
    <div className="rounded-xl overflow-hidden border border-border dark:border-[#222] transition-colors" style={{ height }}>
      <MapContainer center={center} zoom={10} style={{ width: '100%', height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {tourists.length === 1 && <MapRecenter center={center} />}
        {tourists.filter(t => t.lat && t.lng).map(t => (
          <Marker key={t.id} position={[t.lat, t.lng]} icon={createIcon(colorMap[t.alertStatus] || colorMap.safe)}>
            <Popup>
              <div className="text-sm">
                <strong>{t.name}</strong><br/>
                ID: {t.id}<br/>
                Status: {t.alertStatus}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
export default MapView;
