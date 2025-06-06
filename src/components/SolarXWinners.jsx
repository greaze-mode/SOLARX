import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { API_URL } from "../services/api";
import CompanyCard from "./CompanyCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderStyles.css";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { getLocationFromLatLong } from "../utils/strapiHelper";
import Bottleneck from "bottleneck";

const REGIONS_OPTIONS = [
  "All Regions",
  "Asia-Pacific",
  "LAC",
  "MENA",
  "Africa",
];

const limiter = new Bottleneck({
  minTime: 500, // 500ms between each request (2 per second)
  maxConcurrent: 1, // Queue requests one at a time
});

const throttledGetLocation = limiter.wrap(async (lat, lng) => {
  try {
    const location = await getLocationFromLatLong(lat, lng);
    return location || "Something";
  } catch (e) {
    console.warn("Failed to get location from lat/long", e);
    return "Something";
  }
});

const shuffleArray = (array) => {
  if (!Array.isArray(array) || array.length === 0) return array;

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const transformStartupData = async (rawStartup) => {
  let location = "Location not specified";
  if (rawStartup.HQ_Location?.lat && rawStartup.HQ_Location?.lng) {
    try {
      location = await getLocationFromLatLong(
        rawStartup.HQ_Location.lat,
        rawStartup.HQ_Location.lng
      );
    } catch (e) {
      console.warn("Failed to get location from lat/long", e);
    }
  }

  return {
    id: rawStartup.id,
    documentId: rawStartup.documentId,
    name: rawStartup.Name || "Unnamed Startup",
    regions: rawStartup.Regions || [],
    location,
    description:
      rawStartup.Description?.[0]?.children?.[0]?.text ||
      "No description available",
    categories: shuffleArray(rawStartup.Sector_Tags)?.slice(0, 2) || [
      "General",
    ],
    logo: rawStartup.Company_Logo?.formats?.small?.url || "",
    coverImage: rawStartup.Cover_Image?.formats?.small?.url || "",
  };
};

export default function SolarXWinners() {
  const sliderRef = useRef(null);
  const [startups, setStartups] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      setLoading(true);
      setError(null);
      setStartups([]);

      try {
        const response = await axios.get(
          `${API_URL}/startups?populate[0]=Company_Logo&populate[1]=Cover_Image`
        );

        if (response && response.data && response.data.data) {
          const rawStartups = response.data.data;
          console.log("Fetched raw companies data:", rawStartups);

          if (rawStartups.length === 0) {
            setStartups([]);
          } else {
            const cleanedStartups = await Promise.all(
              rawStartups.map(transformStartupData)
            );
            console.log("Cleaned startups data:", cleanedStartups);
            setStartups(cleanedStartups);
          }
        } else {
          console.warn(
            "No data in API response for SolarXWinners, or structure is unexpected."
          );
          setStartups([]);
        }
      } catch (err) {
        console.error("Error fetching or processing companies:", err);
        setError("Failed to load SolarX Winners. Please try again later.");
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndProcess();
  }, []);

  const filteredCompanies = useMemo(() => {
    if (selectedRegion === "All Regions") {
      return startups;
    }
    return startups.filter(
      (company) => company.regions && company.regions.includes(selectedRegion)
    );
  }, [startups, selectedRegion]);

  const sliderSettings = useMemo(() => {
    const numItems = filteredCompanies.length;

    const calculateResponsiveSettings = (maxSlidesForView) => {
      const slidesToShow = Math.min(maxSlidesForView, Math.max(1, numItems)); // Ensure at least 1 slide is shown
      return {
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        infinite: numItems > slidesToShow,
      };
    };

    const desktopResponsiveConfig = calculateResponsiveSettings(3);

    return {
      dots: true,
      arrows: false,
      speed: 500,
      initialSlide: 0,
      autoplay: desktopResponsiveConfig.infinite,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      swipeToSlide: true,
      ...desktopResponsiveConfig,
      responsive: [
        {
          breakpoint: 1024, // lg
          settings: calculateResponsiveSettings(2), // Max 2 for large tablets
        },
        {
          breakpoint: 768, // md
          settings: calculateResponsiveSettings(2), // Max 2 for smaller tablets
        },
        {
          breakpoint: 640, // sm
          settings: calculateResponsiveSettings(1), // 1 slide for mobile
        },
      ],
    };
  }, [filteredCompanies.length]);

  const showSliderNavButtons = sliderSettings.infinite;

  if (loading) {
    return (
      <section
        id="winners"
        className="max-w-screen-2xl mx-auto min-w-full bg-gradient-to-b from-white via-orange-50 to-white py-16 md:py-24 relative flex justify-center items-center min-h-[500px]"
      >
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="winners"
        className="max-w-screen-2xl mx-auto min-w-full bg-gradient-to-b from-white via-orange-50 to-white py-16 md:py-24 relative"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md mb-8 text-center shadow-md max-w-lg mx-auto">
            <div className="flex justify-center mb-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="font-semibold text-lg mb-1">
              Oops! Something went wrong.
            </p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="winners"
      className="max-w-screen-2xl mx-auto min-w-full bg-gradient-to-b from-white via-orange-50 to-white pt-16 md:pt-24 relative"
    >
      <div className="px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
            Meet Our <span className="text-orange-600">SolarX Winners</span>
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto my-8">
            Discover innovative startups driving change in the solar energy
            sector.
          </p>
        </div>

        {/* Region Badge Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-2">
          {REGIONS_OPTIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                ${
                  selectedRegion === region
                    ? "bg-orange-600 text-white shadow-lg hover:bg-orange-700 transform scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-50 shadow-sm hover:shadow-md border border-gray-300 hover:border-orange-400"
                }`}
            >
              {region}
            </button>
          ))}
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 p-6 rounded-md mb-8 text-center shadow-md max-w-lg mx-auto min-h-[200px] flex flex-col justify-center items-center">
            <p className="text-xl font-semibold mb-2">No Startups Found</p>
            <p className="text-sm">
              {selectedRegion === "All Regions"
                ? "There are currently no startups to display."
                : `No startups found for the "${selectedRegion}" region.`}
            </p>
            <p className="text-sm mt-1">
              Try selecting a different region or check back later.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            {showSliderNavButtons && (
              <div className="flex justify-end items-centerpx-1 sm:px-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => sliderRef.current?.slickPrev()}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 shadow-md hover:shadow-lg transition-all border border-gray-200"
                    aria-label="Previous slide"
                  >
                    <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={() => sliderRef.current?.slickNext()}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 shadow-md hover:shadow-lg transition-all border border-gray-200"
                    aria-label="Next slide"
                  >
                    <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
            )}

            <div className="slider-container -mx-2 sm:-mx-3">
              <Slider
                ref={sliderRef}
                {...sliderSettings}
                className="company-slider"
              >
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id} // Using company.id as the primary unique key
                    className="px-2 sm:px-3 h-full card-container"
                  >
                    <CompanyCard {...company} />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
