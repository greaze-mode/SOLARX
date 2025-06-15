import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Fullscreen,
  Minimize,
  AlertTriangle,
  Globe as GlobeIconJsx,
  CheckCircle,
  Cpu,
  XCircle,
  Loader2,
} from "lucide-react";
import * as countryCodes from "country-codes-list";

const getCountryNameFromCode = (code) => {
  if (!code || typeof code !== "string") return "Unknown Country";
  const country = countryCodes.findOne("countryCode", code.toUpperCase());
  return country ? country.countryNameEn : "Unknown Country";
};

const STARTUPS_API_URL = `${
  import.meta.env.VITE_API_URL
}/api/startups?populate=*&pagination[pageSize]=100`;

const GLOBE_RADIUS = 1;

// Add region color constants
const REGION_COLORS = {
  APAC: 0x05bcf4, // Cyan
  MENA: 0xff9800, // Orange
  ROA: 0x4cef50, // Green
  EUROPE: 0x2196f3, // Blue
  LAC: 0x9c27b0, // Purple
  NA: 0xf44336, // Red
  DEFAULT: 0x9e9e9e, // Grey for other regions
};

// Add region names mapping
const REGION_NAMES = {
  APAC: "Asia-Pacific (APAC)",
  MENA: "Middle East & North Africa (MENA)",
  ROA: "Rest of Africa (RoA)",
  EUROPE: "Europe",
  LAC: "Latin America & the Caribbean (LAC)",
  NA: "North America",
  DEFAULT: "Other Regions",
};

const getRegionColor = (region) => {
  let color;

  switch (region) {
    case REGION_NAMES.APAC:
      color = REGION_COLORS.APAC;
      break;
    case REGION_NAMES.MENA:
      color = REGION_COLORS.MENA;
      break;
    case REGION_NAMES.ROA:
      color = REGION_COLORS.ROA;
      break;
    case REGION_NAMES.EUROPE:
      color = REGION_COLORS.EUROPE;
      break;
    case REGION_NAMES.LAC:
      color = REGION_COLORS.LAC;
      break;
    case REGION_NAMES.NA:
      color = REGION_COLORS.NA;
      break;
    default:
      color = REGION_COLORS.DEFAULT;
      break;
  }

  return color;
};

const extractRichTextToString = (richTextArray) => {
  let textContent = "";
  if (Array.isArray(richTextArray)) {
    richTextArray.forEach((block) => {
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (child.text) {
            textContent += child.text + " ";
          }
        });
      }
    });
  }
  return textContent.trim();
};

const latLngToVector3 = (lat, lng, radius = GLOBE_RADIUS) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- Component ---
const SolarXGlobalReach = () => {
  const globeContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeMeshRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const markersGroupRef = useRef(null);
  const individualMarkersRef = useRef([]);
  const scrollPositionRef = useRef(0);

  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isThreeJsReady, setIsThreeJsReady] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [globeDataPoints, setGlobeDataPoints] = useState([]);
  const [allStartups, setAllStartups] = useState([]);

  const [regionSummary, setRegionSummary] = useState([]);
  const [sectorSummary, setSectorSummary] = useState([]);
  const [technologySummary, setTechnologySummary] = useState([]);

  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsComponentLoading(true);
      setApiError(null);
      try {
        const startupsResponse = await fetch(STARTUPS_API_URL);

        if (!startupsResponse.ok) {
          throw new Error(
            `Startups API Error: ${startupsResponse.status} ${startupsResponse.statusText}`
          );
        }

        const startupsResult = await startupsResponse.json();
        const fetchedStartups = startupsResult.data || [];
        setAllStartups(fetchedStartups);

        const points = [];
        if (fetchedStartups.length > 0) {
          fetchedStartups.forEach((startup) => {
            const hqLocation = startup.HQ_Location;
            if (startup.Regions === REGION_NAMES.ROA) {
              console.log(startup, getRegionColor(startup.Regions));
            }

            if (
              hqLocation &&
              typeof hqLocation.lat === "number" &&
              typeof hqLocation.lng === "number"
            ) {
              // console.log(
              //   `Processing startup: ${startup.Name} (ID: ${startup.id}) (country code: ${startup.Country})`
              // );
              points.push({
                id: `startup-hq-${startup.id}`,
                lat: hqLocation.lat,
                lng: hqLocation.lng,
                color: getRegionColor(startup.Regions || "DEFAULT"),
                startupId: startup.id,
                startupDocumentId: startup.documentId || "N/A",
                startupName: startup.Name || "N/A",
                startupLocationString: startup.HQ_Location_Name || "N/A",
                startupLogo: startup.Company_Logo.url || "",
                startupCountry:
                  getCountryNameFromCode(startup.Country) || "N/A",
                startupRegions: startup.Regions || "N/A",
                startupSectors:
                  startup.Sector_Tags?.map((t) =>
                    typeof t === "string" ? t.split("|").pop().trim() : ""
                  )
                    .filter(Boolean)
                    .join(", ") || "N/A",
                startupTech:
                  startup.Technology_Tags?.map((t) =>
                    typeof t === "string" ? t.split("|").pop().trim() : ""
                  )
                    .filter(Boolean)
                    .join(", ") || "N/A",
                startupDescription:
                  extractRichTextToString(startup.Description) ||
                  "No description available.",
              });
            } else {
              // console.warn(
              //   `Startup ID ${startup.id} (${startup.Name}) missing or invalid HQ_Location data.`
              // );
            }
          });
        }
        setGlobeDataPoints(points);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiError(error.message || "Failed to fetch startup data.");
      } finally {
        setIsComponentLoading(false);
      }
    };
    fetchData();
  }, []);

  // Summaries processing
  useEffect(() => {
    if (allStartups.length === 0) {
      setRegionSummary([]);
      setSectorSummary([]);
      setTechnologySummary([]);
      return;
    }
    const createSummary = (tagArrayField) => {
      const counts = {};
      allStartups.forEach((s) => {
        const tags = s[tagArrayField];
        if (tags) {
          if (!Array.isArray(tags)) {
            counts[tags] = (counts[tags] || 0) + 1;
          } else if (Array.isArray(tags)) {
            tags.forEach((tag) => {
              const tagName =
                typeof tag === "string"
                  ? tag.split("|").pop().trim()
                  : "Unknown";
              counts[tagName] = (counts[tagName] || 0) + 1;
            });
          }
        }
      });
      return Object.entries(counts)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / allStartups.length) * 100),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };
    setRegionSummary(createSummary("Regions"));
    setSectorSummary(createSummary("Sector_Tags"));
    setTechnologySummary(createSummary("Technology_Tags"));
  }, [allStartups]);

  // --- Three.js Setup and Animation Loop ---
  useEffect(() => {
    if (
      isComponentLoading ||
      !globeContainerRef.current ||
      rendererRef.current
    ) {
      return;
    }

    const container = globeContainerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    if (width === 0 || height === 0) {
      // Fallback if clientWidth/Height is 0 initially
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) {
        // console.warn(
        //   "Globe container has zero dimensions. Cannot initialize Three.js canvas."
        // );
        return;
      }
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    const indiaPosition = latLngToVector3(20.5937, 78.9629, 3.5);
    camera.position.set(indiaPosition.x, indiaPosition.y, indiaPosition.z);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xcccccc, 0.8));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "//unpkg.com/three-globe/example/img/earth-day.jpg",
      (earthTexture) => {
        const globeMaterial = new THREE.MeshPhongMaterial({
          map: earthTexture,
          shininess: 5,
        });
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);
        globeMeshRef.current = globe;

        const atmosphereMaterial = new THREE.ShaderMaterial({
          vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0); gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 0.4; }`,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(GLOBE_RADIUS * 1.04, 64, 64),
          atmosphereMaterial
        );
        scene.add(atmosphere);
        // atmosphereMeshRef.current = atmosphere; // Not strictly needed to store if not manipulating later
        setIsThreeJsReady(true);
      },
      undefined,
      (error) => {
        console.error("Error loading globe texture:", error);
        const fallbackMaterial = new THREE.MeshPhongMaterial({
          color: 0x4488bb,
          shininess: 5,
        });
        const globe = new THREE.Mesh(globeGeometry, fallbackMaterial);
        scene.add(globe);
        globeMeshRef.current = globe;
        setIsThreeJsReady(true);
      }
    );

    markersGroupRef.current = new THREE.Group();
    scene.add(markersGroupRef.current);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMarkerClick = (event) => {
      if (
        !rendererRef.current ||
        !cameraRef.current ||
        individualMarkersRef.current.length === 0
      )
        return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(
        individualMarkersRef.current,
        false
      );
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData && clickedObject.userData.id) {
          setSelectedMarkerData(clickedObject.userData);
          setIsInfoPanelOpen(true);
          if (controlsRef.current) controlsRef.current.autoRotate = false;
        }
      }
    };
    const currentRendererEl = renderer.domElement; // Capture for cleanup
    currentRendererEl.addEventListener("click", onMarkerClick);

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      const time = Date.now() * 0.0025;
      individualMarkersRef.current.forEach((marker) => {
        if (marker.userData.isPulsing) {
          const baseScale = marker.userData.baseScale || 1;
          marker.scale.setScalar(
            baseScale *
              (1 + 0.25 * Math.sin(time + (marker.userData.id.length % 10)))
          ); // Modulo for variety
        }
      });
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        // Check refs before rendering
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleWindowResize = () => {
      if (
        !cameraRef.current ||
        !rendererRef.current ||
        !globeContainerRef.current
      )
        return;

      let newWidth = isFullscreen ? window.innerWidth : 0;
      let newHeight = isFullscreen ? window.innerHeight : 0;

      if (!isFullscreen && globeContainerRef.current) {
        newWidth = globeContainerRef.current.clientWidth;
        newHeight = globeContainerRef.current.clientHeight;
      }
      if (newWidth === 0 || newHeight === 0) return; // Avoid division by zero if container not ready

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleWindowResize);
    if (isFullscreen) handleWindowResize(); // Initial resize if starting in fullscreen

    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener("resize", handleWindowResize);
      currentRendererEl.removeEventListener("click", onMarkerClick); // Use captured element

      controlsRef.current?.dispose(); // Optional chaining

      rendererRef.current?.dispose(); // Optional chaining

      sceneRef.current?.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        // This is the crucial part: check for material and dispose it.
        // This handles both single materials and arrays of materials.
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      if (
        container &&
        rendererRef.current?.domElement &&
        container.contains(rendererRef.current.domElement)
      ) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      globeMeshRef.current = null;
      // atmosphereMeshRef.current = null;
      markersGroupRef.current = null;
      individualMarkersRef.current = [];
      setIsThreeJsReady(false);
    };
  }, [isComponentLoading, isFullscreen]); // Only re-run if loading state or fullscreen state changes

  // Effect to update markers
  useEffect(() => {
    if (!isThreeJsReady || !markersGroupRef.current || !globeMeshRef.current)
      return;

    individualMarkersRef.current.forEach((marker) => {
      marker.geometry.dispose();
      // marker.material.dispose(); // If material is unique per marker and complex
    });
    markersGroupRef.current.clear();
    individualMarkersRef.current = [];

    globeDataPoints.forEach((point) => {
      const position = latLngToVector3(
        point.lat,
        point.lng,
        GLOBE_RADIUS + 0.01
      );
      const markerRadius = 0.015; // Slightly smaller for potentially more markers
      const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 16);

      const markerMaterial = new THREE.MeshPhongMaterial({
        color: point.color,
        emissive: point.color,
        emissiveIntensity: 0.5, // Brighter emissive
        shininess: 20,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.lookAt(globeMeshRef.current.position); // Ensures consistent orientation
      marker.userData = { ...point, isPulsing: false, baseScale: 1 };
      markersGroupRef.current.add(marker);
      individualMarkersRef.current.push(marker);
    });
  }, [isThreeJsReady, globeDataPoints]);

  // --- UI Event Handlers ---
  const toggleFullscreen = () => {
    if (isFullscreen) {
      closeInfoPanel();
    }
    setIsFullscreen(!isFullscreen);
  };
  const closeInfoPanel = () => {
    setIsInfoPanelOpen(false);
    setSelectedMarkerData(null);
    if (controlsRef.current) controlsRef.current.autoRotate = true;
  };

  // --- Render Helper Components ---
  const InfoPanel = ({ data, onClose }) => {
    if (!data) return null;
    return (
      <div
        className={`fixed md:absolute top-0 right-0 h-full md:h-auto md:max-h-[calc(100%-2rem)] md:top-4 md:right-4 w-full max-w-md md:w-80 lg:w-96 bg-white/95 backdrop-blur-md shadow-2xl rounded-none md:rounded-lg z-50 p-5 sm:p-6 overflow-y-auto transition-transform transform ${
          isInfoPanelOpen
            ? "translate-x-0"
            : "translate-x-full md:translate-x-[110%]"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className="text-lg sm:text-xl font-bold text-gray-900 truncate"
            title={data.startupName}
          >
            <span>{data.startupName}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div>
          <img
            src={data.startupLogo}
            alt={`${data.startupName} Logo`}
            className="w-full shadow-xl my-4"
          />
        </div>
        <div className="space-y-2.5 text-sm">
          <p>
            <strong className="text-gray-800">
              <span>Location: </span>
            </strong>
            <span>{data.startupLocationString}</span>
          </p>
          {/* {data.startupCountry !== "N/A" && (
            <p>
              <strong className="text-gray-800">
                <span>Country: </span>
              </strong>
              <span>{data.startupCountry}</span>
            </p>
          )} */}
          {data.startupRegions !== "N/A" && (
            <p>
              <strong className="text-gray-800">
                <span>Region: </span>
              </strong>
              <span>{data.startupRegions}</span>
            </p>
          )}
          {data.startupSectors !== "N/A" && (
            <p>
              <strong className="text-gray-800">
                <span>Sector(s): </span>
              </strong>
              <span>{data.startupSectors}</span>
            </p>
          )}
          {data.startupTech !== "N/A" && (
            <p>
              <strong className="text-gray-800">
                <span>Technology: </span>
              </strong>
              <span>{data.startupTech}</span>
            </p>
          )}
          {data.startupDescription &&
            data.startupDescription !== "No description available." && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <strong className="text-gray-800 block mb-1">
                  <span>Description:</span>
                </strong>
                <p className="text-gray-800 max-h-28 sm:max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                  <span>{data.startupDescription}</span>
                </p>
              </div>
            )}
        </div>
        {data.startupId !== "N/A" && (
          <div className="mt-5 sm:mt-6 text-center">
            <a
              href={`/startup/${data.startupDocumentId}`}
              className="inline-block bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View Startup Profile</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  const SummaryCard = ({ title, data, icon }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center text-orange-600 mb-3 bg-gray-100 p-4 rounded-t-xl">
        {React.cloneElement(icon, { size: 22, className: "mr-2" })}
        <h4 className="text-lg sm:text-xl font-semibold text-gray-700">
          <span>{title}</span>
        </h4>
      </div>
      {data.length > 0 ? (
        <ul className="space-y-1.5 text-sm p-5 sm:p-6 ">
          {data.map((item) => (
            <li
              key={item.name}
              className="flex justify-between items-center text-gray-600 py-1"
            >
              <span className="truncate pr-2" title={item.name}>
                <span>{item.name}</span>
              </span>
              <span className="font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                <span>
                  {item.count} ({item.percentage}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 pt-2">
          {isComponentLoading ? "Loading data..." : "No data available."}
        </p>
      )}
    </div>
  );

  // Add Legend component before the main render
  const RegionLegend = () => (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-10">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        <span>Region Colors</span>
      </h4>
      <div className="space-y-2">
        {Object.entries(REGION_COLORS).map(([region, color]) => (
          <div key={region} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: `#${color.toString(16).padStart(6, "0")}`,
              }}
            />
            <span className="text-xs text-gray-600">
              <span>{REGION_NAMES[region]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <>
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-gray-900 z-[1000] flex items-center justify-center"
          ref={isFullscreen ? globeContainerRef : null} // Three.js canvas will re-target here
        >
          {/* This div will either be empty initially or contain the re-rendered canvas */}
          <button
            onClick={toggleFullscreen}
            title="Exit Fullscreen"
            className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-[1001] bg-white/20 hover:bg-white/30 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all"
          >
            <Minimize size={20} sm={24} />
          </button>
          <InfoPanel data={selectedMarkerData} onClose={closeInfoPanel} />
        </div>
      )}

      <section
        id="reach"
        className={`py-12 sm:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 transition-all duration-300 ${
          isFullscreen ? "hidden" : ""
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-3 sm:mb-4">
              Global Reach & Impact
            </h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
            <p className="text-md sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Explore startup headquarters and our collective impact across
              regions, sectors, and technologies.
            </p>
          </header>

          {(isComponentLoading ||
            (!isThreeJsReady && !apiError && allStartups.length > 0)) && (
            <div className="flex justify-center items-center min-h-[300px] md:min-h-[450px] bg-gray-100 rounded-xl p-6 my-8">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 animate-spin" />
              <p className="ml-3 text-orange-600 text-lg">
                {isComponentLoading
                  ? "Loading Impact Data..."
                  : "Initializing Interactive Globe..."}
              </p>
            </div>
          )}
          {apiError && (
            <div className="text-center text-red-700 p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg my-8 shadow">
              <AlertTriangle className="inline-block mr-2 h-6 w-6" />
              <span className="font-semibold">Could not load data:</span>{" "}
              {apiError}
            </div>
          )}

          {!apiError &&
            !isComponentLoading && ( // Only render grid when data is ready and no error
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-20 items-start">
                {/* Globe Section */}
                <div className="lg:col-span-3 bg-gradient-to-br from-gray-700 to-gray-900 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl shadow-2xl">
                  <div className="bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-0">
                        Startup Headquarters
                      </h3>
                      <button
                        onClick={toggleFullscreen}
                        title="Toggle Fullscreen"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                        disabled={!isThreeJsReady}
                      >
                        <Fullscreen size={16} sm={18} />
                        <span className="ml-1.5">Fullscreen</span>
                      </button>
                    </div>
                    <div
                      ref={!isFullscreen ? globeContainerRef : null}
                      className="w-full h-[400px] md:h-[450px] lg:h-[500px] rounded-md sm:rounded-lg overflow-hidden relative cursor-grab bg-gray-800/50 notranslate"
                    >
                      {!isThreeJsReady && !isComponentLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                          <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-2" />
                          <p className="text-orange-300 text-sm">
                            Preparing Interactive Globe...
                          </p>
                        </div>
                      )}
                      {isThreeJsReady && <RegionLegend />}
                      {/* Canvas will be appended here by Three.js */}
                    </div>
                  </div>
                </div>

                {/* Info and Summaries */}
                <div className="col-span-1 lg:col-span-2 space-y-6 md:space-y-8">
                  {isInfoPanelOpen && selectedMarkerData && !isFullscreen && (
                    // InfoPanel is rendered conditionally in its original position when not fullscreen
                    // It is absolutely positioned relative to the screen in fullscreen mode
                    <div className="bg-white rounded-xl shadow-xl border-t-4 border-orange-500">
                      {/* Re-render InfoPanel here for non-fullscreen to keep it in layout flow */}
                      <InfoPanel
                        data={selectedMarkerData}
                        onClose={closeInfoPanel}
                        isFullScreen={isFullscreen}
                      />
                    </div>
                  )}
                  <SummaryCard
                    title="Regional Focus"
                    data={regionSummary}
                    icon={<GlobeIconJsx />}
                  />
                  <SummaryCard
                    title="Sector Impact"
                    data={sectorSummary}
                    icon={<CheckCircle />}
                  />
                  <SummaryCard
                    title="Key Technologies"
                    data={technologySummary}
                    icon={<Cpu />}
                  />
                </div>
              </div>
            )}
        </div>
      </section>
    </>
  );
};

export default SolarXGlobalReach;
