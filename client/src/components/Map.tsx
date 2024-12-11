import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const cityCoordinates = {
  Vienna: [48.2082, 16.3719],
  Krems_an_der_Donau: [48.3833, 15.5667],
  Salzburg: [47.7997, 13.0378],
  Innsbruck: [47.2672, 11.4194],
  Graz: [47.0700, 15.4397],
};

const Map = () => {
  return (
    <MapContainer center={[47.5162, 14.5501]} zoom={7} style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.entries(cityCoordinates).map(([cityName, coordinates]) => (
        <Marker key={cityName} position={coordinates}>
          <Popup>{cityName}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;