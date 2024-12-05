"use client";

import React, {
  useRef,
  useEffect,
  useState,
  use,
  useInsertionEffect,
} from "react";
import { useTheme } from "next-themes";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Import marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set default icon options to ensure markers display correctly
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  latitude: number | null;
  longitude: number | null;
}

const Map: React.FC<MapProps> = ({ latitude, longitude }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [zoom] = useState(12);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to create or update the tile layer
  const updateTileLayer = () => {
    if (!map.current) return;

    // Decide tile layer URL based on theme
    const tileLayerUrl =
      theme === "dark"
        ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
        : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}";

    // Remove existing tile layer if it exists
    if (tileLayerRef.current) {
      map.current.removeLayer(tileLayerRef.current);
    }

    // Add new tile layer
    tileLayerRef.current = L.tileLayer(tileLayerUrl, {
      ext: "png",
      // attribution:
      //   '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
      //   '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> ' +
      //   '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tileLayerRef.current.addTo(map.current);
  };

  // Initial map setup
  useEffect(() => {
    if (map.current || !mapContainer.current || !mounted) return; // Prevent multiple initializations

    // Set initial center
    const initialLat = latitude || 52.507932;
    const initialLng = longitude || 13.338414;

    // Initialize the map
    map.current = L.map(mapContainer.current, {
      center: [initialLat, initialLng],
      zoom: zoom,
    });

    // Add tile layer based on theme
    updateTileLayer();

    // Add a marker at the center
    if (latitude && longitude) {
      markerRef.current = L.marker([initialLat, initialLng])
        .addTo(map.current)
        .bindPopup("You are here")
        .openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, latitude, longitude]);

  // Update map center and marker position when props change
  useEffect(() => {
    if (!map.current) return;

    if (latitude && longitude) {
      const newLatLng: [number, number] = [latitude, longitude];
      map.current.setView(newLatLng, zoom);

      if (markerRef.current) {
        markerRef.current
          .setLatLng(newLatLng)
          .bindPopup("You are here")
          .openPopup();
      } else {
        // If marker doesn't exist, create it
        markerRef.current = L.marker(newLatLng)
          .addTo(map.current)
          .bindPopup("You are here")
          .openPopup();
      }
    }
  }, [latitude, longitude, zoom]);

  // Update tile layer when theme changes
  useEffect(() => {
    if (!map.current || !mounted) return;
    updateTileLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <div>
      <div ref={mapContainer} className="rounded-lg h-52 w-full" />
    </div>
  );
};

export default Map;
