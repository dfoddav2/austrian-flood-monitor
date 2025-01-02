"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import proj4 from "proj4";
import "proj4leaflet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Marker clusters
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Import marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { eden } from "@/utils/api";

// Set default icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

//Create custom marker
// const Icon = L.icon({
//   iconUrl: "/images/pin.png",
//   iconSize: [38, 50],
//   iconAnchor: [22, 50],
//   popupAnchor: [-3, -76],
// });

const MapWithRivers: React.FC = () => {
  // Map and component refs
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  // const markerRef = useRef<L.Marker | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const overlaysRef = useRef<{ [key: string]: L.Layer }>({});
  const layerControlRef = useRef<L.Control.Layers | null>(null);
  // const legendRef = useRef<L.Control | null>(null);

  // States and refs for layers
  const hq30LayerRef = useRef<L.TileLayer.WMS | null>(null); // HQ30
  const hq100LayerRef = useRef<L.TileLayer.WMS | null>(null); // HQ100
  const wfsLayerGroupRef = useRef<L.MarkerClusterGroup | null>(null); // Water levels
  const userReportsLayerGroupRef = useRef<L.MarkerClusterGroup | null>(null); // User reports
  const [showHQ30, setShowHQ30] = useState(false);
  const [showHQ100, setShowHQ100] = useState(false);
  const [showWaterLevels, setShowWaterLevels] = useState(false);
  const [showReports, setShowReports] = useState(true);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define the EPSG:31287 projection
  proj4.defs(
    "EPSG:31287",
    "+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +k_0=1 +x_0=400000 +y_0=400000 +ellps=bessel +units=m +no_defs"
  );

  // Function to create or update the base tile layer
  const updateTileLayer = () => {
    if (!map.current) return;

    const tileLayerUrl =
      theme === "dark"
        ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
        : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}";

    if (baseTileLayerRef.current) {
      // Update the existing base tile layer's URL
      baseTileLayerRef.current.setUrl(tileLayerUrl);
    } else {
      // Add new base tile layer
      baseTileLayerRef.current = L.tileLayer(tileLayerUrl, {
        ext: "png",
        zIndex: 1,
      }).addTo(map.current!);
    }
  };

  // ------------------------
  // ---- [Water levels] ----
  // ------------------------
  // Function to fetch and add WFS data
  const fetchWFSData = async () => {
    const wfsUrl =
      "https://gis.lfrz.gv.at/wmsgw/?key=a64a0c9c9a692ed7041482cb6f03a40a&SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=inspire:pegelaktuell&OUTPUTFORMAT=application/json";
    const response = await fetch(wfsUrl);
    const data = await response.json();

    interface Feature {
      properties: {
        messstelle: string;
        internet: string;
        wert: string;
        einheit: string;
        wertw_cm: string;
        zeitpunkt: string;
        gewaesser: string;
      };
      geometry: {
        coordinates: [number, number];
      };
    }

    // Filter out features where both 'wert' and 'wertw_cm' are missing or empty
    const filteredFeatures = data.features.filter((feature: Feature) => {
      const { wert, wertw_cm } = feature.properties;
      return (
        (wert !== null && wert !== "") ||
        (wertw_cm !== null && wertw_cm.trim() !== "")
      );
    });

    // Reproject the GeoJSON features
    const reprojectedFeatures = filteredFeatures.map((feature: Feature) => {
      const [x, y] = feature.geometry.coordinates;

      // Reproject coordinates from EPSG:31287 to EPSG:4326
      const [lon, lat] = proj4("EPSG:31287", "EPSG:4326", [x, y]);

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: [lon, lat],
        },
      };
    });

    const reprojectedData = {
      ...data,
      features: reprojectedFeatures,
    };

    // Create or clear the MarkerClusterGroup for the GeoJSON data
    if (!wfsLayerGroupRef.current) {
      wfsLayerGroupRef.current = L.markerClusterGroup();
    } else {
      wfsLayerGroupRef.current.clearLayers();
    }

    // Add GeoJSON layer to the map
    L.geoJSON(reprojectedData, {
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const {
            messstelle, // Measurement station
            internet,
            wert, // Measured value
            einheit, // Unit
            wertw_cm, // Water level in cm
            zeitpunkt, // Timestamp
            gewaesser, // Water body
          } = feature.properties;

          // Format the timestamp
          const formattedTimestamp = zeitpunkt
            ? new Date(zeitpunkt).toLocaleTimeString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A";

          // Build popup content with English labels
          let popupContent = `<strong>Measurement Station:</strong> ${messstelle}<br>`;

          if (gewaesser && gewaesser.trim() !== "") {
            popupContent += `<strong>Water Body:</strong> ${gewaesser}<br>`;
          }

          if (wert !== null && wert !== "") {
            popupContent += `<strong>Measured Value:</strong> ${wert} ${
              einheit !== null ? einheit : ""
            }<br>`;
          }

          if (wertw_cm && wertw_cm.trim() !== "") {
            popupContent += `<strong>Water Level (cm):</strong> ${wertw_cm}<br>`;
          }

          popupContent += `<strong>Timestamp:</strong> ${formattedTimestamp}<br>`;

          popupContent += `<a href="${internet}" target="_blank">More Info</a>`;

          layer.bindPopup(popupContent);
        }
      },
    }).addTo(wfsLayerGroupRef.current);

    // Add to and update the overlays and layer control
    overlaysRef.current["Water Levels"] = wfsLayerGroupRef.current!;
    if (map.current && layerControlRef.current) {
      layerControlRef.current.addOverlay(
        wfsLayerGroupRef.current!,
        "Water Levels"
      );
    }
  };

  // ----------------------------
  // ---- [Internal reports] ----
  // ----------------------------
  //Reports - internal data
  const fetchReports = async () => {
    interface Report {
      title: string;
      description: string;
      createdAt: string;
      latitude: number;
      longitude: number;
    }

    let reports: Report[] | [] = [];
    await eden.reports["get-map-report-info"]
      .get()
      .then((response) => {
        if (response.status !== 200) {
          console.error("Error fetching reports", response);
          return;
        } else {
          // console.log("Reports fetched", response.data);
          reports = response.data;
        }
      })
      .catch((error) => {
        console.error("Error fetching reports", error);
      });

    // Create or clear the MarkerClusterGroup for the reports
    if (!userReportsLayerGroupRef.current) {
      userReportsLayerGroupRef.current = L.markerClusterGroup();
    }
    userReportsLayerGroupRef.current.clearLayers();

    // Add markers for each report
    reports.forEach((report) => {
      const marker = L.marker([report.latitude, report.longitude], {
        // icon: Icon,
      }).bindPopup(`<h3>${report.title}</h3><p>${report.description}</p>`);
      marker.addTo(userReportsLayerGroupRef.current!);
    });

    // Add to and update the overlays and layer control
    overlaysRef.current["User Reports"] = userReportsLayerGroupRef.current!;
    if (layerControlRef.current) {
      layerControlRef.current.addOverlay(
        userReportsLayerGroupRef.current!,
        "User Reports"
      );
    }
  };

  // Initial map setup
  useEffect(() => {
    if (map.current || !mapContainer.current || !mounted) return; // Prevent multiple initializations

    const initializeMap = async () => {
      // Set initial center and zoom, set map
      map.current = L.map(mapContainer.current!, {
        center: [47.5162, 14.5501],
        zoom: 7,
      });

      // Add tile layer based on theme
      updateTileLayer();

      // HQ30 WMS Layer
      hq30LayerRef.current = L.tileLayer.wms(
        "https://inspire.lfrz.gv.at/000801/wms",
        {
          layers: "Hochwasserueberflutungsflaechen HQ30", // Replace with the actual layer name
          version: "1.3.0",
          format: "image/png",
          transparent: true,
          attribution: "© Umweltbundesamt",
          zIndex: 2,
        }
      );

      // HQ100 WMS Layer
      hq100LayerRef.current = L.tileLayer.wms(
        "https://inspire.lfrz.gv.at/000801/wms",
        {
          layers: "Hochwasserueberflutungsflaechen HQ100", // Replace with the actual layer name
          version: "1.3.0",
          format: "image/png",
          transparent: true,
          attribution: "© Umweltbundesamt",
          zIndex: 3,
        }
      );

      // ----------------------------------------------------------------------------
      // TODO: Legends?
      // Add the legend to the map
      // legend.addTo(map.current!);
      // const legend = L.control({ position: "bottomright" });

      // legend.onAdd = function (map) {
      //   const div = L.DomUtil.create("div", "info legend");
      //   div.innerHTML += "<h4>Flood Risk</h4>";
      //   // div.innerHTML += '<i style="background:find color;"></i> HQ100 <br>';
      //   // div.innerHTML += '<i style="background:find color ;"></i> HQ30 <br>';
      //   div.innerHTML += "<h4>Water Levels</h4>";
      //   div.innerHTML += '<i style="background: #00008B;"></i>Water levels<br>';
      //   return div;
      // };

      // legendRef.current = legend;
      // legend.addTo(map.current);
      // ----------------------------------------------------------------------------

      // Here we can add overlays to the map that we want to show by default, otherwise handled by `useEffect` initializations
      // hq30LayerRef.current?.addTo(map.current);
      // hq100LayerRef.current?.addTo(map.current);

      // Store overlays for layer control
      overlaysRef.current = {
        "HQ30 Flood Areas": hq30LayerRef.current,
        "HQ100 Flood Areas": hq100LayerRef.current,
      };

      // Initialize layer control without the WFS layer
      layerControlRef.current = L.control
        .layers({}, overlaysRef.current)
        .addTo(map.current!);

      // Fetch and add WFS Water level and Internal Reports data
      await fetchWFSData();
      await fetchReports();
      // wfsLayerGroupRef.current!.addTo(map.current!); // Not adding by default, handled by toggle and `useEffect`
      userReportsLayerGroupRef.current!.addTo(map.current!);
    };

    initializeMap();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Update base tile layer when theme changes
  useEffect(() => {
    if (!map.current || !mounted) return;
    updateTileLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    if (!map.current) return;

    //HQ30 layer
    if (showHQ30 && hq30LayerRef.current) {
      hq30LayerRef.current.addTo(map.current);
    } else if (!showHQ30 && hq30LayerRef.current) {
      map.current.removeLayer(hq30LayerRef.current);
    }

    //HQ100 layer
    if (showHQ100 && hq100LayerRef.current) {
      hq100LayerRef.current.addTo(map.current);
    } else if (!showHQ100 && hq100LayerRef.current) {
      map.current.removeLayer(hq100LayerRef.current);
    }

    //Water level layers
    if (showWaterLevels && wfsLayerGroupRef.current) {
      wfsLayerGroupRef.current.addTo(map.current);
    } else if (!showWaterLevels && wfsLayerGroupRef.current) {
      map.current.removeLayer(wfsLayerGroupRef.current);
    }

    //User reports
    if (showReports && userReportsLayerGroupRef.current) {
      userReportsLayerGroupRef.current.addTo(map.current);
    } else if (!showReports && userReportsLayerGroupRef.current) {
      map.current.removeLayer(userReportsLayerGroupRef.current);
    }
  }, [showHQ30, showHQ100, showWaterLevels, showReports]);

  return (
    <div>
      <div className="flex justify-items-start my-2">
        <ToggleGroup type="multiple" className="space-x-2" variant="outline">
          <ToggleGroupItem
            value="userReports"
            aria-label="Toggle User Reports"
            onClick={() => setShowReports(!showReports)}
            data-state={showReports ? "on" : "off"}
          >
            Reports
          </ToggleGroupItem>
          <ToggleGroupItem
            value="waterLevels"
            aria-label="Toggle Water Levels"
            onClick={() => setShowWaterLevels(!showWaterLevels)}
            data-state={showWaterLevels ? "on" : "off"}
          >
            Water Levels
          </ToggleGroupItem>
          <ToggleGroupItem
            value="hq100"
            aria-label="Toggle HQ100"
            onClick={() => setShowHQ100(!showHQ100)}
            data-state={showHQ100 ? "on" : "off"}
          >
            HQ100
          </ToggleGroupItem>
          <ToggleGroupItem
            value="hq30"
            aria-label="Toggle HQ30"
            onClick={() => setShowHQ30(!showHQ30)}
            data-state={showHQ30 ? "on" : "off"}
          >
            HQ30
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="relative">
        <div ref={mapContainer} className="rounded-lg h-96 w-full" />
      </div>
    </div>
  );
};

export default MapWithRivers;
