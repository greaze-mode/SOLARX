import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../services/api";

export default function StatsSection() {
  const [stats2, setStats] = useState([]);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `USD ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `USD ${(amount / 1000).toFixed(1)}K`;
    return `USD ${amount.toFixed(0)}`;
  };

  useEffect(() => {
    setStats([]);

    const getStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/startups?populate[0]=funding&pagination[pageSize]=100`);

        // console.log("Response from API:", res.data);

        if (res && res.data && res.data.data) {
          const regionsCount = () => {
            const uniqueRegions = new Set();
            res.data.data.forEach((startup) => {
              if (startup && startup.Regions) {
                uniqueRegions.add(startup.Regions);
              }
            });

            return uniqueRegions.size;
          };

          const totalFunding = () => {
            let total = 0;
            res.data.data.forEach((startup) => {
              if (startup && startup.funding && startup.funding) {
                startup.funding.forEach((funding) => {
                  if (funding && funding.Amount_Raised) {
                    total += parseInt(funding.Amount_Raised);
                  }
                });
              }
            });
            return formatCurrency(total);
          };
          const statsData = {
            startupsCount: res.data.data.length,
            regionsCount: regionsCount(),
            funding: totalFunding(),
          }; // length of array

          setStats(statsData);
        } else {
          // console.error("Unexpected response structure:", res.data);
          setStats([]);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats([]);
      }
    };

    getStats();
  }, []);

  const stats = [
    {
      id: 1,
      value: `${stats2.startupsCount}` || "0",
      label: "Innovative Startups",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      value: stats2.regionsCount || "0",
      label: "Global Regions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      value: `${stats2.funding || "USD 0"}`,
      label: "Funding Facilitated",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      value: "500K+",
      label: "Lives Impacted",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="stats"
      className="bg-gradient-to-r from-orange-200 to-orange-500 py-20 relative pb-32 w-full px-20"
    >
      {/* Background Blurs */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_impact_metrics.png')] bg-no-repeat bg-center bg-cover opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-orange-100/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 sm:bottom-40 right-5 sm:right-10 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-orange-100/30 rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-orange-600 text-shadow">
            Our Reach and Impact
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-orange-500 mx-auto rounded-full mt-4 sm:mt-4"></div>
          <p className="text-base sm:text-xl text-gray-900 max-w-3xl mx-auto pt-4">
            Transforming the solar energy landscape with innovative solutions
            across the globe
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md sm:shadow-lg hover:scale-105 transition-all text-center border border-orange-100 hover:border-orange-300"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 orange-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                <div className="scale-60 sm:scale-75 md:scale-90">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
