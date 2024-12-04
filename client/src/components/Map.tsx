import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
    return (
        <MapContainer center={[47.5162, 14.5501]} zoom={7} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[48.2082, 16.3719]}>
                <Popup>Vienna</Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
