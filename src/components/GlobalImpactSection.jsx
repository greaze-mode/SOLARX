import { useState, useEffect } from "react";
import axios from "axios";
import { Target, AlertTriangle, Loader2, Globe, BarChart3 } from "lucide-react";
import KeyImpactMetricsScroller from "../components/KeyImpactMetricsScroller";
import { API_URL } from "../services/api";
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
 * Shuffles array elements randomly
 * @param {Array} arr - Array to shuffle
 * @returns {Array} - New shuffled array
 */
const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

/**
 * Component to display an SDG Goal tile in the grid
 */
const SdgGoalTile = ({ icon, startupCount }) => (
  <div className="aspect-square shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
    <img
      src={icon} // Use the SDG wheel logo as background
      className="w-full h-full object-cover rounded-md"
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
 * Displays SDG alignment, regional impact, and key metrics
 */
const GlobalImpactSection = () => {
  const [sdgStartupCounts, setSdgStartupCounts] = useState({});
  const [impactMetrics, setImpactMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect for component visibility
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    /**
     * Fetches SDG, impact metrics, and regional data from the API
     */
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch startup data first
        const fullRes = await axios.get(`${API_URL}/startups?populate=*`);

        const sdgCounts = {};
        const allStartups = fullRes?.data?.data || [];
        allStartups.forEach((startup) => {
          const startupSdgs = startup.SDG || [];
          startupSdgs.forEach((sdgNumber) => {
            sdgCounts[sdgNumber] = (sdgCounts[sdgNumber] || 0) + 1;
          });
        });

        setSdgStartupCounts(sdgCounts);

        // Process impact metrics
        const firstStartupForMetrics = fullRes?.data?.data?.[0] || {};
        const allMetricsRaw = [
          ...(firstStartupForMetrics.Environmental_Impact_Metrics || []),
          ...(firstStartupForMetrics.Social_Impact_Metrics || []),
          ...(firstStartupForMetrics.Economic_Impact_Metrics || []),
          ...(firstStartupForMetrics.Technology_And_Scalability_Metrics || []),
        ];

        const selectedMetrics = shuffleArray(allMetricsRaw)
          .slice(0, Math.min(20, allMetricsRaw.length))
          .map((metric) => ({
            label: metric.Title || "Untitled Metric",
            value: metric.Metric || "N/A",
          }));
        setImpactMetrics(selectedMetrics);
      } catch (err) {
        console.error("Error fetching global impact data:", err);
        setError(err.message || "Unknown error fetching impact data.");
        setSdgStartupCounts([]);
        setImpactMetrics([]);
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
          <p className="mt-3 text-gray-600">
            Loading Global Impact Highlights...
          </p>
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
            Could Not Load Impact Data
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (sdgStartupCounts.length === 0 && impactMetrics.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Impact Information Available
          </h3>
          <p className="text-gray-500 text-sm">
            SDG alignment, specific impact metrics, or regional data have not
            yet been provided.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`pt-20 bg-white relative overflow-hidden transition-opacity duration-200 w-full ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full relative z-10 bg-gradient-to-r from-orange-200 to-orange-500 py-20">
        <div className="absolute inset-0 bg-[url('/imgs/bg_impact_metrics.png')] bg-no-repeat bg-center bg-cover opacity-10"></div>
        <div
          className="text-center mb-16 transform transition-all duration-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
              Global Impact
            </span>
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Driving sustainable change through innovative solutions aligned with
            global goals and measurable outcomes.
          </p>
        </div>

        <div className="md:px-20">
          <div className="px-4 sm:px-6 lg:px-8 mb-20">
            {sdgStartupCounts && (
              <div
                className={`bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-orange-100/60 transform transition-all duration-200 hover:-translate-y-1 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-shrink-0 p-3.5 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl shadow-lg">
                    <Target size={30} className="text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    SDG Alignment
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 text-base">
                  Our commitment to the UN's Sustainable Development Goals:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {allSdgs.map((sdg) => (
                    <SdgGoalTile
                      key={sdg.number}
                      icon={sdg.icon}
                      startupCount={sdgStartupCounts[sdg.number] || 0}
                    />
                  ))}
                  {/* Final 'Goals' tile */}
                  <div className="relative flex flex-col justify-center items-center p-4 bg-white aspect-square shadow-lg rounded-md">
                    <img
                      src={sdgLogo}
                      alt="Sustainable Development Goals"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {impactMetrics.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-[url('/imgs/bg_impact_metrics.png')] bg-no-repeat bg-center bg-cover opacity-10"></div>
            <div className="relative z-10">
              <KeyImpactMetricsScroller
                metrics={impactMetrics}
                isVisible={isVisible}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GlobalImpactSection;
