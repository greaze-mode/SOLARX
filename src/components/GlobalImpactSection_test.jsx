import { useState, useEffect } from "react";
import { Target, AlertTriangle, Loader2 } from "lucide-react";
import sdgIcon1 from "../../public/imgs/sdgs/SDG_01.jpg";
import sdgIcon2 from "../../public/imgs/sdgs/SDG_02.jpg";
import sdgIcon3 from "../../public/imgs/sdgs/SDG_03.jpg";
import sdgIcon4 from "../../public/imgs/sdgs/SDG_04.jpg";
import sdgIcon5 from "../../public/imgs/sdgs/SDG_05.jpg";
import sdgIcon6 from "../../public/imgs/sdgs/SDG_06.jpg";
import sdgIcon7 from "../../public/imgs/sdgs/SDG_07.jpg";
import sdgIcon8 from "../../public/imgs/sdgs/SDG_08.jpg";
import sdgIcon9 from "../../public/imgs/sdgs/SDG_09.png";
import sdgIcon10 from "../../public/imgs/sdgs/SDG_10.jpg";
import sdgIcon11 from "../../public/imgs/sdgs/SDG_11.jpg";
import sdgIcon12 from "../../public/imgs/sdgs/SDG_12.jpg";
import sdgIcon13 from "../../public/imgs/sdgs/SDG_13.jpg";
import sdgIcon14 from "../../public/imgs/sdgs/SDG_14.jpg";
import sdgIcon15 from "../../public/imgs/sdgs/SDG_15.jpg";
import sdgIcon16 from "../../public/imgs/sdgs/SDG_16.jpg";
import sdgIcon17 from "../../public/imgs/sdgs/SDG_17.jpg";
import sdgLogo from "../../public/imgs/sdgs/SDG_LOGO.png"; // Replace with actual path to SDG wheel logo

import axios from "axios";

const allSdgs = [
  { number: 1, title: "NO POVERTY", color: "#E5243B", icon: sdgIcon1 },
  { number: 2, title: "ZERO HUNGER", color: "#DDA63A", icon: sdgIcon2 },
  {
    number: 3,
    title: "GOOD HEALTH AND WELL-BEING",
    color: "#4C9F38",
    icon: sdgIcon3,
  },
  { number: 4, title: "QUALITY EDUCATION", color: "#C5192D", icon: sdgIcon4 },
  { number: 5, title: "GENDER EQUALITY", color: "#FF3A21", icon: sdgIcon5 },
  {
    number: 6,
    title: "CLEAN WATER AND SANITATION",
    color: "#26BDE2",
    icon: sdgIcon6,
  },
  {
    number: 7,
    title: "AFFORDABLE AND CLEAN ENERGY",
    color: "#FCC30B",
    icon: sdgIcon7,
  },
  {
    number: 8,
    title: "DECENT WORK AND ECONOMIC GROWTH",
    color: "#A21942",
    icon: sdgIcon8,
  },
  {
    number: 9,
    title: "INDUSTRY, INNOVATION AND INFRASTRUCTURE",
    color: "#FD6925",
    icon: sdgIcon9,
  },
  {
    number: 10,
    title: "REDUCED INEQUALITIES",
    color: "#DD1367",
    icon: sdgIcon10,
  },
  {
    number: 11,
    title: "SUSTAINABLE CITIES AND COMMUNITIES",
    color: "#FD9D24",
    icon: sdgIcon11,
  },
  {
    number: 12,
    title: "RESPONSIBLE CONSUMPTION AND PRODUCTION",
    color: "#BF8B2E",
    icon: sdgIcon12,
  },
  { number: 13, title: "CLIMATE ACTION", color: "#3F7E44", icon: sdgIcon13 },
  { number: 14, title: "LIFE BELOW WATER", color: "#0A97D9", icon: sdgIcon14 },
  { number: 15, title: "LIFE ON LAND", color: "#56C02B", icon: sdgIcon15 },
  {
    number: 16,
    title: "PEACE, JUSTICE AND STRONG INSTITUTIONS",
    color: "#00689D",
    icon: sdgIcon16,
  },
  {
    number: 17,
    title: "PARTNERSHIPS FOR THE GOALS",
    color: "#19486A",
    icon: sdgIcon17,
  },
];

/**
 * Component to display an SDG Goal tile in the grid
 */
const SdgGoalTile = ({ number, title, color, Icon, startupCount }) => (
  <div className="aspect-square shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
    <img
      src={Icon} // Use the SDG wheel logo as background
    />
    {startupCount > 0 && (
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-orange-500 rounded-full flex items-center justify-center text-base font-bold ring-2 ring-orange-600 z-10">
        {startupCount}
      </div>
    )}
  </div>
);

/**
 * Global Impact Section Component
 * Displays SDG alignment in a grid format
 */
const GlobalImpactSection = () => {
  const [sdgStartupCounts, setSdgStartupCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = import.meta.env.VITE_API_URL;
        const fullRes = await axios.get(`${baseUrl}/api/startups?populate=*`);
        const allStartups = fullRes?.data?.data || [];

        const sdgCounts = {};
        allStartups.forEach((startup) => {
          const startupSdgs = startup.SDG || [];
          startupSdgs.forEach((sdgNumber) => {
            sdgCounts[sdgNumber] = (sdgCounts[sdgNumber] || 0) + 1;
          });
        });
        setSdgStartupCounts(sdgCounts);
      } catch (err) {
        console.error("Error fetching global impact data:", err);
        setError(err.message || "Unknown error fetching impact data.");
        setSdgStartupCounts({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
          <p className="mt-3 text-gray-600">Loading SDG Alignment...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-red-50">
        <div className="max-w-2xl mx-auto text-center p-6 bg-white rounded-xl shadow-lg border border-red-200">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Could Not Load SDG Data
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-20 bg-gray-50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Our Commitment to Global Goals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are dedicated to supporting startups that align with the United
            Nations Sustainable Development Goals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allSdgs.map((sdg) => (
            <SdgGoalTile
              key={sdg.number}
              number={sdg.number}
              title={sdg.title}
              color={sdg.color}
              Icon={sdg.icon}
              startupCount={sdgStartupCounts[sdg.number] || 0}
            />
          ))}
          {/* Final 'Goals' tile */}
          <div className="relative flex flex-col justify-center items-center p-4 bg-white aspect-square shadow-lg">
            <img
              src={sdgLogo}
              alt="Sustainable Development Goals"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
