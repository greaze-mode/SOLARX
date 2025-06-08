import React, { useState, useEffect, useRef } from "react";
import { MapPin, Globe, Zap, Cpu } from "lucide-react"; // Example icons

const GlobalPresence = ({ companyId }) => {
  const [darkMode, setDarkMode] = useState(false); // Keep for demo or if you have a site-wide dark mode
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLocations, setMapLocations] = useState({
    currentOperations: [],
    expansionTargets: [],
    partnerLocations: [], // Kept for potential future use or if API adds it
  });
  const [operationalRegions, setOperationalRegions] = useState([]); // For text display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startupData, setStartupData] = useState({
    sectorFocus: [],
    technologyTypes: []
  });

  // Fetch sector focus and technology types data
  useEffect(() => {
    const fetchStartupData = async () => {
      if (!companyId) {
        return;
      }
      
      try {
        // Fetch startup details including sector focus and technology types
        const baseUrl = import.meta.env.VITE_API_URL;
        const apiUrl = `${baseUrl}/api/startups?filters[id][$eq]=${companyId}&populate=Sector_Focus&populate=Technology_Types`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error?.message || 
            `API request failed: ${response.status} ${response.statusText}`;
          console.error("Error fetching startup data:", errorMessage);
          
          // Use fallback data if API request fails
          setStartupData({
            sectorFocus: [
              "Rural Electrification",
              "Clean Water Access",
              "Sustainable Agriculture",
              "Community Health",
              "Digital Literacy",
            ],
            technologyTypes: [
              "Decentralized Solar Grids",
              "Water Purification Systems",
              "IoT for Agriculture",
              "Telemedicine Platforms",
              "Offline Educational Content Delivery",
            ]
          });
          return;
        }
        
        const result = await response.json();
        console.log("Startup Data API Response:", result);
        
        if (result && result.data && result.data.length > 0) {
          const startup = result.data[0].attributes;
          
          // Extract sector focus data
          const sectorFocus = startup.Sector_Focus?.data?.map(item => 
            item.attributes?.Name || item.attributes?.Title || "Unnamed Sector"
          ) || [];
          
          // Extract technology types data
          const technologyTypes = startup.Technology_Types?.data?.map(item => 
            item.attributes?.Name || item.attributes?.Title || "Unnamed Technology"
          ) || [];
          
          // If we got empty arrays from the API, use fallback data
          const finalSectorFocus = sectorFocus.length > 0 ? sectorFocus : [
            "Rural Electrification",
            "Clean Water Access",
            "Sustainable Agriculture",
            "Community Health",
            "Digital Literacy",
          ];
          
          const finalTechnologyTypes = technologyTypes.length > 0 ? technologyTypes : [
            "Decentralized Solar Grids",
            "Water Purification Systems",
            "IoT for Agriculture",
            "Telemedicine Platforms",
            "Offline Educational Content Delivery",
          ];
          
          setStartupData({
            sectorFocus: finalSectorFocus,
            technologyTypes: finalTechnologyTypes
          });
          
          console.log("Processed startup data:", { 
            sectorFocus: finalSectorFocus, 
            technologyTypes: finalTechnologyTypes 
          });
        } else {
          console.log("No startup data found for this ID.");
          // Set fallback data if no startup data is found
          setStartupData({
            sectorFocus: [
              "Rural Electrification",
              "Clean Water Access",
              "Sustainable Agriculture",
              "Community Health",
              "Digital Literacy",
            ],
            technologyTypes: [
              "Decentralized Solar Grids",
              "Water Purification Systems",
              "IoT for Agriculture",
              "Telemedicine Platforms",
              "Offline Educational Content Delivery",
            ]
          });
        }
      } catch (err) {
        console.error("Error processing startup data:", err);
        // Set fallback data if an error occurs
        setStartupData({
          sectorFocus: [
            "Rural Electrification",
            "Clean Water Access",
            "Sustainable Agriculture",
            "Community Health",
            "Digital Literacy",
          ],
          technologyTypes: [
            "Decentralized Solar Grids",
            "Water Purification Systems",
            "IoT for Agriculture",
            "Telemedicine Platforms",
            "Offline Educational Content Delivery",
          ]
        });
      }
    };
    
    fetchStartupData();
  }, [companyId]);

  useEffect(() => {
    const fetchGlobalPresenceData = async () => {
      if (!companyId) {
        setError("Company ID is required to fetch global presence data.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // The endpoint filters by startups.id, which implies global-presences is a collection
        // and each item in it can be linked to multiple startups.
        // We expect the response to be an array of global-presence entries.
        // If a startup can only have one global-presence entry, the API design might differ.
        const baseUrl = import.meta.env.VITE_API_URL;
        const apiUrl = `${baseUrl}/api/global-presences?populate=Presence&filters[startups][id][$eq]=${companyId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.error?.message ||
            `API request failed: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("Global Presence API Response:", result);

        if (result && result.data && result.data.length > 0) {
          // Assuming the first entry is the relevant one for this startup,
          // or that the filter ensures only one relevant entry.
          const presenceData = result.data[0];

          const newMapLocations = {
            currentOperations: [],
            expansionTargets: [],
            partnerLocations: [], // Reset or initialize
          };
          const regionsSet = new Set(); // To store unique region names derived from locations

          if (presenceData.Presence && Array.isArray(presenceData.Presence)) {
            presenceData.Presence.forEach((item) => {
              if (
                item.Location &&
                typeof item.Location.lat === "number" &&
                typeof item.Location.lng === "number"
              ) {
                const locationDetail = {
                  lat: item.Location.lat,
                  lng: item.Location.lng,
                  // Name could be derived or fixed if API doesn't provide it per point
                  name: item.Type, // Using Type as a placeholder name, ideally API gives a specific name
                };

                if (item.Type === "Current Operations") {
                  newMapLocations.currentOperations.push({
                    ...locationDetail,
                    type: "current",
                  });
                  regionsSet.add(item.Location.country || "Region (Current)"); // Placeholder if country not available
                } else if (item.Type === "Expansion Targets") {
                  newMapLocations.expansionTargets.push({
                    ...locationDetail,
                    type: "expansion",
                  });
                  regionsSet.add(item.Location.country || "Region (Expansion)"); // Placeholder
                }
                // Add other types like 'Partner Locations' if they exist in API
              }
            });
          }
          setMapLocations(newMapLocations);
          setOperationalRegions(Array.from(regionsSet)); // Example: use actual region names if available
        } else {
          console.log("No global presence data found for this startup.");
          setMapLocations({
            currentOperations: [],
            expansionTargets: [],
            partnerLocations: [],
          });
          setOperationalRegions([]);
          // setError('No global presence data available for this startup.'); // Optional: set an error/message
        }
      } catch (err) {
        console.error("Error fetching global presence data:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalPresenceData();
  }, [companyId]);

  useEffect(() => {
    // Leaflet map initialization logic (same as your original, slightly adapted)
    const loadLeaflet = async () => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
        document.head.appendChild(cssLink);
      }

      if (!window.L) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.async = true;
        script.onload = () => initializeMap();
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (
        mapRef.current &&
        window.L &&
        !mapInstanceRef.current &&
        (mapLocations.currentOperations.length > 0 ||
          mapLocations.expansionTargets.length > 0)
      ) {
        if (mapInstanceRef.current) {
          // Clear previous map instance if re-initializing
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = window.L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: false, // Often better UX to disable scroll hijack
        }).setView([20, 0], 2); // Default view

        window.L.tileLayer(
          darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 18,
          }
        ).addTo(map);

        const addMarkers = (locations, color, fillColor, size = 8) => {
          locations.forEach((location) => {
            const marker = window.L.circleMarker([location.lat, location.lng], {
              radius: size,
              fillColor: fillColor,
              color: color,
              weight: 1.5,
              opacity: 0.9,
              fillOpacity: 0.7,
            }).addTo(map);
            marker.bindPopup(
              `<b>${location.name}</b><br>Lat: ${location.lat.toFixed(
                2
              )}, Lng: ${location.lng.toFixed(2)}`
            );
          });
        };

        addMarkers(
          mapLocations.currentOperations,
          darkMode ? "#e95a00" : "#f97316",
          darkMode ? "#ff8c00" : "#fdba74",
          8
        ); // Orange
        addMarkers(
          mapLocations.expansionTargets,
          darkMode ? "#2563eb" : "#3b82f6",
          darkMode ? "#60a5fa" : "#93c5fd",
          6
        ); // Blue
        addMarkers(
          mapLocations.partnerLocations,
          darkMode ? "#059669" : "#10b981",
          darkMode ? "#34d399" : "#6ee7b7",
          6
        ); // Green

        // Fit bounds if there are markers
        const allPoints = [
          ...mapLocations.currentOperations,
          ...mapLocations.expansionTargets,
          ...mapLocations.partnerLocations,
        ];
        if (allPoints.length > 0) {
          const bounds = window.L.latLngBounds(
            allPoints.map((p) => [p.lat, p.lng])
          );
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
          }
        }

        mapInstanceRef.current = map;
      } else if (
        mapInstanceRef.current &&
        mapLocations.currentOperations.length === 0 &&
        mapLocations.expansionTargets.length === 0
      ) {
        // If map exists but no locations, clear it or show a message
        mapInstanceRef.current.eachLayer((layer) => {
          if (!!layer.toGeoJSON) {
            // Check if it's a marker/vector layer
            mapInstanceRef.current.removeLayer(layer);
          }
        });
        mapInstanceRef.current.setView([20, 0], 2); // Reset view
      }
    };

    if (!loading && !error) {
      // Only load/initialize map if data is ready and no error
      loadLeaflet();
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // Reload map if locations or dark mode changes
  }, [mapLocations, darkMode, loading, error]);

  const InfoCard = ({ title, items }) => {
    const getIcon = () => {
      switch (title) {
        case "Technology Types":
          return <Cpu className="w-6 h-6 mr-2 text-orange-500" />;
        case "Sector Focus":
          return <Globe className="w-6 h-6 mr-2 text-orange-500" />;
        default:
          return <Zap className="w-6 h-6 mr-2 text-orange-500" />;
      }
    };

    return (
      <div
        className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 border border-gray-700 hover:border-orange-500"
            : "bg-white border border-gray-200 hover:border-orange-300"
        }`}
      >
        <div className="flex items-center mb-4">
          {getIcon()}
          <h3
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </h3>
        </div>
        {items && items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={index}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  darkMode
                    ? "bg-gray-700 text-orange-300"
                    : "bg-orange-50 text-orange-700"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            No {title.toLowerCase()} specified yet.
          </p>
        )}
      </div>
    );
  };

  return (
    <section
      className={`py-16 relative transition-colors duration-300 px-[69px] w-full ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="">
        <div className="flex flex-col md:flex-row items-center justify-between md:justify-start mb-8 space-y-3 md:space-y-0 md:space-x-3 w-full">
          <div className="w-1/5 md:w-16 hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          <h1 className="text-3xl md:text-5xl font-bold mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Our Global Footprint
            </span>
          </h1>
          <div className="block md:hidden w-1/3 md:w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
        </div>

        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p
              className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Loading global presence...
            </p>
          </div>
        )}
        {error && !loading && (
          <div
            className={`border px-4 py-3 rounded-lg relative max-w-2xl mx-auto mb-8 ${
              darkMode
                ? "bg-red-900 border-red-700 text-red-300"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div
              className={`lg:col-span-2 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div
                className={`p-5 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`text-2xl font-bold flex items-center ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <MapPin className="w-7 h-7 mr-3 text-orange-500" />{" "}
                  Operational Map
                </h3>
              </div>
              <div className="relative">
                <div
                  ref={mapRef}
                  className="h-96 md:h-[500px] w-full z-10"
                  style={{ background: darkMode ? "#374151" : "#f0f0f0" }}
                >
                  {/* Map will render here. Show placeholder if no locations. */}
                  {mapLocations.currentOperations.length === 0 &&
                    mapLocations.expansionTargets.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p
                          className={`text-lg ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Map data not available or no locations specified.
                        </p>
                      </div>
                    )}
                </div>
                {(mapLocations.currentOperations.length > 0 ||
                  mapLocations.expansionTargets.length > 0 ||
                  mapLocations.partnerLocations.length > 0) && (
                  <div
                    className={`absolute bottom-3 right-3 p-3 rounded-lg z-20 shadow-md text-xs ${
                      darkMode
                        ? "bg-gray-900/80 border border-gray-700 backdrop-blur-sm"
                        : "bg-white/80 border border-gray-200 backdrop-blur-sm"
                    }`}
                  >
                    <h4
                      className={`font-bold mb-1.5 ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Legend
                    </h4>
                    <div className="space-y-1.5">
                      {mapLocations.currentOperations.length > 0 && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1.5 ring-1 ring-offset-1 ring-orange-600 ring-offset-transparent"></div>
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            Current Operations
                          </span>
                        </div>
                      )}
                      {mapLocations.expansionTargets.length > 0 && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5 ring-1 ring-offset-1 ring-blue-600 ring-offset-transparent"></div>
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            Expansion Targets
                          </span>
                        </div>
                      )}
                      {mapLocations.partnerLocations.length > 0 && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5 ring-1 ring-offset-1 ring-green-600 ring-offset-transparent"></div>
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            Partner Locations
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* <InfoCard
                title="Operational Regions"
                items={operationalRegions}
                icon={<Globe />}
                cardColor="text-orange-500"
              /> */}
              <InfoCard
                title="Sector Focus"
                items={startupData.sectorFocus}
              />
              <InfoCard
                title="Technology Types"
                items={startupData.technologyTypes}
              />
            </div>
          </div>
        )}

        {/* <div className="text-center mt-8">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-orange-500"
                : "bg-gray-200 text-gray-800 hover:bg-orange-500 hover:text-white"
            }`}
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default GlobalPresence;
