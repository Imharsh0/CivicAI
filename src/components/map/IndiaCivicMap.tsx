import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CivicIssue } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { MapPin, List, Map as MapIcon, ExternalLink, Navigation, Crosshair, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import { useCity } from '../../contexts/CityContext';

interface IndiaCivicMapProps {
  issues: CivicIssue[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}


export const IndiaCivicMap: React.FC<IndiaCivicMapProps> = ({
  issues,
  centerLat,
  centerLng,
  zoom = 12,
}) => {
  const { currentCity } = useCity();
  const navigate = useNavigate();

  const lat = centerLat !== undefined ? centerLat : (currentCity?.latitude || 28.6139);
  const lng = centerLng !== undefined ? centerLng : (currentCity?.longitude || 77.2090);

  // Refs for Leaflet map instance and layers
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [viewState, setViewState] = useState({
    latitude: lat,
    longitude: lng,
    zoom: zoom,
  });

  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      zoom: zoom,
    }));
  }, [lat, lng, zoom]);

  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [isMapError, setIsMapError] = useState(false);

  // Priority to color mapping
  const priorityColors: Record<string, string> = {
    P1: '#e11d48', // rose-600
    P2: '#f59e0b', // amber-500
    P3: '#eab308', // yellow-500
    P4: '#0ea5e9', // sky-500
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || viewMode !== 'map') return;

    try {
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: zoom,
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors | CivicAI GPS Engine',
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;

        // Auto invalidate size after initial render to avoid gray tile issues
        setTimeout(() => {
          map.invalidateSize();
        }, 250);
      } else {
        mapInstanceRef.current.setView([lat, lng], zoom);
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 150);
      }
    } catch (err) {
      console.warn('Leaflet map initialization error, falling back to list mode:', err);
      setIsMapError(true);
      setViewMode('list');
    }

    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [lat, lng, zoom, viewMode]);

  // Update Markers when issues or viewMode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || viewMode !== 'map') return;

    markersLayerRef.current.clearLayers();

    issues.forEach((issue) => {
      if (!issue.latitude || !issue.longitude) return;

      const color = priorityColors[issue.priority_level] || '#0ea5e9';

      // Custom SVG pin marker
      const customIcon = L.divIcon({
        className: 'custom-civic-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 10px;
              font-weight: 800;
              font-family: sans-serif;
            ">${issue.priority_level}</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([issue.latitude, issue.longitude], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'civic-popup p-1 text-slate-900';
      popupContent.innerHTML = `
        <div style="font-family: Inter, sans-serif; font-size: 12px; max-width: 230px;">
          <div style="font-size: 10px; font-weight: 700; color: #0d9488; text-transform: uppercase;">Ticket: ${issue.id}</div>
          <div style="font-weight: 700; color: #0f172a; margin-top: 2px; margin-bottom: 2px; font-size: 13px;">${issue.issue_type}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${issue.location_text}</div>
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px;">
            <span style="background: ${color}25; color: ${color}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}40;">
              ${issue.priority_level} • ${issue.priority_score}/100
            </span>
            <span style="font-size: 10px; color: #334155; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
              ${issue.status}
            </span>
          </div>
          <button id="view-issue-${issue.id}" style="
            width: 100%;
            background: #0f766e;
            color: white;
            border: none;
            padding: 5px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          ">View Ticket Details →</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-issue-${issue.id}`);
        if (btn) {
          btn.onclick = () => navigate(`/issue/${issue.id}`);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [issues, viewMode, navigate]);

  // Real GPS Geolocation Trigger
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring real-time GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        setUserLocation({ lat: userLat, lng: userLng });
        setIsLocating(false);
        setLocationStatus(`GPS Pin Active (±${accuracy}m accuracy)`);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([userLat, userLng], 15, { duration: 1.5 });

          // Remove previous user marker if any
          if (userLocationMarkerRef.current) {
            mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
          }

          // Create GPS beacon marker
          const userIcon = L.divIcon({
            className: 'user-gps-marker',
            html: `
              <div style="position: relative; width: 24px; height: 24px;">
                <div style="position: absolute; inset: 0; border-radius: 50%; background: #0284c7; opacity: 0.35; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                <div style="position: absolute; inset: 4px; border-radius: 50%; background: #0284c7; border: 2.5px solid white; box-shadow: 0 0 8px rgba(2,132,199,0.8);"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(mapInstanceRef.current);
          userMarker.bindPopup('<strong style="font-family: Inter; font-size: 11px;">📍 Your Current GPS Location</strong>').openPopup();
          userLocationMarkerRef.current = userMarker;
        }
      },
      (err) => {
        console.warn('GPS error:', err.message);
        setIsLocating(false);
        setLocationStatus('GPS permission denied or unavailable.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col transition-all">
      {/* Header Controls Bar */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-800">
              Civic GPS Geo-Map
            </span>
            <span className="text-[11px] text-slate-500 ml-2 font-mono">
              ({issues.length} Issues Mapped)
            </span>
          </div>
        </div>

        {/* GPS Locate & View Controls */}
        <div className="flex items-center gap-2">
          {viewMode === 'map' && (
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                userLocation
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
              title="Pinpoint current GPS position"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-600' : 'text-rose-500'}`} />
              <span className="hidden sm:inline">
                {isLocating ? 'Locating...' : userLocation ? 'GPS Located' : 'Find My GPS'}
              </span>
            </button>
          )}

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Locations</span>
            </button>
          </div>
        </div>
      </div>

      {/* GPS Status Banner if active */}
      {locationStatus && (
        <div className="bg-sky-50/80 px-4 py-1.5 border-b border-sky-100 text-[11px] text-sky-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-sky-600 shrink-0" />
            <span>{locationStatus}</span>
          </div>
          <button
            onClick={() => setLocationStatus('')}
            className="text-sky-600 font-bold hover:underline"
          >
            ×
          </button>
        </div>
      )}

      {/* Map or Fallback List */}
      {viewMode === 'map' && !isMapError ? (
        <div className="relative w-full h-96 sm:h-[480px] bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Priority Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg text-[11px] space-y-1.5 max-w-[190px]">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-100">
              Priority Color Codes
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0" />
              <span className="text-slate-700 font-medium">P1 Critical (85–100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-700 font-medium">P2 High (70–84)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
              <span className="text-slate-700 font-medium">P3 Medium (50–69)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
              <span className="text-slate-700 font-medium">P4 Low (&lt;50)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback Location List View */
        <div className="p-4 max-h-[480px] overflow-y-auto divide-y divide-slate-100">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => navigate(`/issue/${issue.id}`)}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer px-3 rounded-2xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {issue.id}
                  </span>
                  <PriorityBadge level={issue.priority_level} showScore={false} />
                  <StatusBadge status={issue.status} />
                </div>
                <h4 className="text-xs font-bold text-slate-900">{issue.issue_type}</h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{issue.location_text}</span>
                  {issue.latitude && issue.longitude && (
                    <span className="font-mono text-slate-400 text-[10px]">
                      ({issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)})
                    </span>
                  )}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
