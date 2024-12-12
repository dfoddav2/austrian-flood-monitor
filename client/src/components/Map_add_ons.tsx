"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import austrianRivers from "./austrian_rivers.json"; 

type CityCoordinates = {
  [key: string]: [number, number];
};

const MapWithRivers: React.FC = () => {
  const cityCoordinates: CityCoordinates = {
    Vienna: [48.2082, 16.3719],
    Krems_an_der_Donau: [48.3833, 15.5667],
    Salzburg: [47.7997, 13.0378],
    Innsbruck: [47.2672, 11.4194],
    Graz: [47.0700, 15.4397],
  };

  const riverStyle = {
    color: "#0000FF", 
    weight: 2,
    opacity: 0.7,
  };

  return (
    <MapContainer
      center={[47.5162, 14.5501]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Rivers">
          <GeoJSON data={austrianRivers as any} style={riverStyle} />
        </LayersControl.Overlay>
      </LayersControl>

      {Object.entries(cityCoordinates).map(([cityName, coordinates]) => (
        <Marker key={cityName} position={coordinates}>
          <Popup>{cityName}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithRivers;
