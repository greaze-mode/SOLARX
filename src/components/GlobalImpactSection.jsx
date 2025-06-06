import React, { useState, useEffect } from "react";
import axios from "axios";
import { Target, AlertTriangle, Loader2, Globe, BarChart3 } from "lucide-react";
import KeyImpactMetricsScroller from "../components/KeyImpactMetricsScroller";

/**
 * Shuffles array elements randomly
 * @param {Array} arr - Array to shuffle
 * @returns {Array} - New shuffled array
 */
const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

/**
 * Component to display an SDG Goal
 */
const SdgGoalDisplay = ({ number, title, color, iconChar }) => (
  <div
    className={`group flex items-center space-x-2.5 px-3.5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-default ${color} text-white transform hover:scale-105 min-w-[170px]`}
    title={`SDG ${number}: ${title}`}
  >
    <div className="flex-shrink-0 w-6 h-6 bg-white/25 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-white/40">
      {iconChar || number}
    </div>
    <span className="text-xs sm:text-sm font-medium truncate group-hover:text-clip group-hover:whitespace-normal">
      {title}
    </span>
  </div>
);

/**
 * Global Impact Section Component
 * Displays SDG alignment, regional impact, and key metrics
 */
const GlobalImpactSection = () => {
  const [sdgData, setSdgData] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState([]);
  const [regionalImpactData, setRegionalImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect for component visibility
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Define colors for the regional list
  const REGION_COLORS = {
    "Asia-Pacific": "bg-sky-500",
    LAC: "bg-lime-500",
    MENA: "bg-amber-500",
    Africa: "bg-purple-500",
    Other: "bg-slate-400",
  };
  const REGIONS_OF_INTEREST = ["Asia-Pacific", "LAC", "MENA", "Africa"];

  useEffect(() => {
    /**
     * Fetches SDG, impact metrics, and regional data from the API
     */
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Define SDG colors based on number
        const sdgColors = {
          1: "bg-red-600",
          2: "bg-yellow-600",
          3: "bg-green-500",
          4: "bg-blue-500",
          5: "bg-pink-500",
          6: "bg-blue-400",
          7: "bg-yellow-500",
          8: "bg-red-500",
          9: "bg-indigo-500",
          10: "bg-pink-400",
          11: "bg-orange-500",
          12: "bg-yellow-700",
          13: "bg-green-600",
          14: "bg-blue-600",
          15: "bg-green-700",
          16: "bg-gray-700",
          17: "bg-blue-800",
        };

        // Fetch startup data first
        const baseUrl = import.meta.env.VITE_API_URL;
        const fullRes = await axios.get(
          `${baseUrl}/api/startups?populate=*`,
        );

        // Get the SDG numbers from the startup data
        const startupSdgNumbers = fullRes?.data?.data?.[0]?.SDG || [];

        // Create a new endpoint in Strapi to fetch SDG data
        // For now, we'll use the data from the startup's SDG field
        // and create a mapping function to extract the titles
        
        // This function extracts the SDG title from the format "Title:Number"
        const extractSdgInfo = (sdgNumber) => {
          // Try to find the SDG in the startup's attributes
          const sdgAttributes = fullRes?.data?.data?.[0]?.attributes || {};
          
          // Look for a field that might contain SDG information
          for (const key in sdgAttributes) {
            if (key.toLowerCase().includes('sdg') && Array.isArray(sdgAttributes[key])) {
              // Check each SDG entry
              for (const sdgEntry of sdgAttributes[key]) {
                // If it's a string with the format "Title:Number"
                if (typeof sdgEntry === 'string' && sdgEntry.includes(':')) {
                  const [title, number] = sdgEntry.split(':').map(s => s.trim());
                  if (number == sdgNumber) {
                    return title;
                  }
                }
              }
            }
          }
          
          // Fallback mapping if we can't find the SDG in the attributes
          const fallbackTitles = {
            1: "No Poverty",
            2: "Zero Hunger",
            3: "Good Health And Well Being",
            4: "Quality Education",
            5: "Gender Equality",
            6: "Clean Water And Sanitation",
            7: "Affordable And Clean Energy",
            8: "Decent Work and Economic Growth",
            9: "Industry, Innovation And Infrastructure",
            10: "Reduced Inequalities",
            11: "Sustainable Cities And Communities",
            12: "Responsible Consumption And Production",
            13: "Climate Action",
            14: "Life Below Water",
            15: "Life On Land",
            16: "Peace, Justice And Strong Institutions",
            17: "Partnerships For The Goals",
          };
          
          return fallbackTitles[sdgNumber] || `SDG ${sdgNumber}`;
        };

        // Map the SDGs that are associated with the startup
        const mappedSdgs = startupSdgNumbers.map((number) => {
          return {
            number,
            title: extractSdgInfo(number),
            color: sdgColors[number] || "bg-gray-500",
            iconChar: String(number),
          };
        });

        setSdgData(mappedSdgs);

        // Process impact metrics
        const firstStartupForMetrics = fullRes?.data?.data?.[0] || {};
        const allMetricsRaw = [
          ...(firstStartupForMetrics.Environmental_Impact_Metrics || []),
          ...(firstStartupForMetrics.Social_Impact_Metrics || []),
          ...(firstStartupForMetrics.Economic_Impact_Metrics || []),
          ...(firstStartupForMetrics.Technology_And_Scalability_Metrics || []),
        ];

        const selectedMetrics = shuffleArray(allMetricsRaw)
          .slice(0, Math.min(10, allMetricsRaw.length))
          .map((metric) => ({
            label: metric.Title || "Untitled Metric",
            value: metric.Metric || "N/A",
          }));
        setImpactMetrics(selectedMetrics);

        if (fullRes?.data?.data && Array.isArray(fullRes.data.data)) {
          const allStartups = fullRes.data.data;
          const counts = {};
          allStartups.forEach((startup) => {
            const startupRegions = startup.Regions;
            if (Array.isArray(startupRegions)) {
              startupRegions.forEach((region) => {
                if (REGIONS_OF_INTEREST.includes(region)) {
                  counts[region] = (counts[region] || 0) + 1;
                }
              });
            }
          });
          const processedRegionalData = Object.entries(counts)
            .map(([regionName, count]) => ({
              name: regionName,
              count: count,
              color: REGION_COLORS[regionName] || REGION_COLORS["Other"],
            }))
            .sort((a, b) => b.count - a.count);
          setRegionalImpactData(
            processedRegionalData.length > 0 ? processedRegionalData : null,
          );
        } else {
          setRegionalImpactData(null);
        }
      } catch (err) {
        console.error("Error fetching global impact data:", err);
        setError(err.message || "Unknown error fetching impact data.");
        setSdgData([]);
        setImpactMetrics([]);
        setRegionalImpactData(null);
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

  if (
    sdgData.length === 0 &&
    impactMetrics.length === 0 &&
    !regionalImpactData
  ) {
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

        <div className="flex flex-row space-y-20 px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8 mb-20">
            {/* Left Column: SDGs and Metrics */}
            <div className="col-span-1 flex flex-col justify-start space-y-8">
              {sdgData.length > 0 && (
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
                  <p className="text-gray-600 mb-6 text-sm">
                    Commitment to the UN's Sustainable Development Goals:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {sdgData.map((sdg, idx) => (
                      <SdgGoalDisplay key={idx} {...sdg} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Regional Impact List */}
            <div className="col-span-1 flex flex-col justify-start space-y-8">
              {regionalImpactData && regionalImpactData.length > 0 && (
                <div
                  className={`bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-green-100/60 transform transition-all duration-200 hover:-translate-y-1 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      Regional Focus
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">
                    Distribution of startups across key operational regions:
                  </p>
                  <ul className="space-y-3">
                    {regionalImpactData.map((regionData, index) => (
                      <li
                        key={index}
                        className={`flex items-center justify-between p-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200
                                            ${
                                              index % 2 === 0
                                                ? "bg-gray-50"
                                                : "bg-white"
                                            }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`flex-shrink-0 w-4 h-4 rounded-full ${regionData.color} ring-2 ring-offset-1 ring-white/50`}
                          ></span>
                          <span className="text-sm font-medium text-gray-700">
                            {regionData.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {regionData.count} startup
                          {regionData.count !== 1 ? "s" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Placeholder if no regional data but other data exists and not loading */}
              {(!regionalImpactData || regionalImpactData.length === 0) &&
                (sdgData.length > 0 || impactMetrics.length > 0) &&
                !loading && (
                  <div
                    className={`bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100/60 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0 p-3.5 bg-gray-200 rounded-xl shadow">
                        <Globe size={30} className="text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-700">
                        Regional Focus
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm text-center py-10">
                      Regional distribution data is currently unavailable.
                    </p>
                  </div>
                )}
            </div>
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
