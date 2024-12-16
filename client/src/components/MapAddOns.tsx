"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Import marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set default icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Import data
// import austrianRivers from "./austrian_rivers.json";

type CityCoordinates = {
  [key: string]: [number, number];
};

const MapWithRivers: React.FC = () => {
  const cityCoordinates: CityCoordinates = {
    Vienna: [48.2082, 16.3719],
    Krems_an_der_Donau: [48.3833, 15.5667],
    Salzburg: [47.7997, 13.0378],
    Innsbruck: [47.2672, 11.4194],
    Graz: [47.07, 15.4397],
  };

  // const riverStyle = {
  //   color: "#0000FF",
  //   weight: 2,
  //   opacity: 0.7,
  // };

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  // const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [zoom] = useState(7);

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
    const initialLat = 47.5162;
    const initialLng = 14.5501;

    // Initialize the map
    map.current = L.map(mapContainer.current, {
      center: [initialLat, initialLng],
      zoom: zoom,
    });

    // Add tile layer based on theme
    updateTileLayer();

    // TODO: Add marker at the city coordinates
    // Add markers for city coordinates
    Object.entries(cityCoordinates).forEach(([cityName, coordinates]) => {
      L.marker(coordinates as [number, number])
        .addTo(map.current!)
        .bindPopup(cityName);
    });

    // Add rivers GeoJSON data
    // L.geoJSON(austrianRivers as any, {
    //   style: riverStyle,
    // }).addTo(map.current!);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Update map center and marker position when props change
  // useEffect(() => {
  //   if (!map.current) return;

  //   if (latitude && longitude) {
  //     const newLatLng: [number, number] = [latitude, longitude];
  //     map.current.setView(newLatLng, zoom);

  //     if (markerRef.current) {
  //       markerRef.current.setLatLng(newLatLng);
  //       // .bindPopup("You are here")
  //       // .openPopup();
  //     } else {
  //       // If marker doesn't exist, create it
  //       markerRef.current = L.marker(newLatLng).addTo(map.current);
  //       // .bindPopup("You are here")
  //       // .openPopup();
  //     }
  //   }
  // }, [latitude, longitude, zoom]);

  // Update tile layer when theme changes
  useEffect(() => {
    if (!map.current || !mounted) return;
    updateTileLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <div>
      <div ref={mapContainer} className="rounded-lg h-96 w-screen" />
    </div>
  );
};

export default MapWithRivers;
