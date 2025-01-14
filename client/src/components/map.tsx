import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { riverData } from './data/riverData';
import { riverHistoryData } from './data/riverHistoryData';
import WaterLevelChart from '../components/WaterLevelChart';

const cityCoordinates = {
  Vienna: [48.2082, 16.3719],
  Krems_an_der_Donau: [48.3833, 15.5667],
  Salzburg: [47.7997, 13.0378],
  Innsbruck: [47.2672, 11.4194],
  Graz: [47.0700, 15.4397],
  Linz: [48.3069, 14.2858],
  Klagenfurt: [46.6249, 14.305],
  Villach: [46.6103, 13.8558],
  St_Poelten: [48.2047, 15.6267],
  Dornbirn: [47.4125, 9.7417],
  Bregenz: [47.5031, 9.7471],
  Wiener_Neustadt: [47.8153, 16.2465],
  Eisenstadt: [47.8452, 16.5253],
  Leoben: [47.3811, 15.0921],
  Wels: [48.1654, 14.0352],
  Steyr: [48.0427, 14.4213],
  Amstetten: [48.1213, 14.8725],
  Feldkirch: [47.2446, 9.5997],
  Hallein: [47.6833, 13.1000],
  Kufstein: [47.5831, 12.1665],
  Lienz: [46.8309, 12.7574],
  Tulln_an_der_Donau: [48.3316, 16.0557],
};

const getWaterLevelColor = (level: number) => {
  if (level < 2) return '#2563eb'; // Low water - blue
  if (level < 4) return '#059669'; // Normal water - green
  return '#dc2626'; // High water - red
};

const Map = () => {
  const [selectedRiver, setSelectedRiver] = useState<number | null>(null);

  useEffect(() => {
    // Fix for default marker icons in React Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Cleanup function
    return () => {
      // Find all map containers and remove them
      const containers = document.querySelectorAll('.leaflet-container');
      containers.forEach(container => {
        // @ts-ignore
        if (container._leaflet_id) {
          // @ts-ignore
          container._leaflet = null;
          // @ts-ignore
          container._leaflet_id = null;
        }
      });
    };
  }, []);

  const handleViewHistoricalData = (e: React.MouseEvent, riverId: number) => {
    e.stopPropagation(); // Prevent the popup from closing
    setSelectedRiver(riverId);
  };

  const selectedRiverHistory = selectedRiver !== null && riverHistoryData
    ? riverHistoryData.find(history => history.id === selectedRiver)?.yearlyData
    : null;

  return (
    <div className="h-screen flex flex-col relative">
      <div className="flex-1">
        <MapContainer
          center={[47.5162, 14.5501]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          key="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Cities */}
          {Object.entries(cityCoordinates).map(([cityName, coordinates]) => (
            <Marker key={cityName} position={coordinates as [number, number]}>
              <Popup>{cityName.replace(/_/g, ' ')}</Popup>
            </Marker>
          ))}

          {/* Rivers */}
          {riverData.map((river) => (
            <CircleMarker
              key={river.id}
              center={[river.lat, river.lng]}
              radius={10}
              pathOptions={{
                fillColor: getWaterLevelColor(river.waterLevel),
                fillOpacity: 0.7,
                color: getWaterLevelColor(river.waterLevel),
                weight: 1
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{river.name}</h3>
                  <p>Water Level: {river.waterLevel}m</p>
                  <p className="text-sm text-gray-600">{river.description}</p>
                  <button
                    onClick={(e) => handleViewHistoricalData(e, river.id)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Historical Data
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {selectedRiverHistory && (
        <WaterLevelChart
          data={selectedRiverHistory}
          onClose={() => setSelectedRiver(null)}
        />
      )}

      <div className="bg-white p-4 border-t">
        <div className="flex items-center gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span>Low Water Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
            <span>Normal Water Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span>High Water Level</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;