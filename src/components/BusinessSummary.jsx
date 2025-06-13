import React, { useState, useEffect } from "react";
import { parseRichText } from "../utils/strapiHelper";
import { API_URL } from "../services/api";

export default function BusinessSummary({ companyId }) {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;

      setLoading(true);
      try {
        const url = `${API_URL}/startups?filters[id][$eq]=${companyId}&populate[0]=Business_Summary&populate[1]=Business_Summary.USP&pagination[pageSize]=100`;
        const response = await fetch(url);
        const result = await response.json();

        if (result?.data?.length > 0) {
          const startup = result.data[0];
          const bs = startup.Business_Summary;

          const summaryText = parseRichText(bs?.Brief_Summary || []);
          const features = (bs?.USP || []).map((usp) => ({
            title: usp.USP_Title,
            description: parseRichText(usp.USP_Description),
          }));

          setBusinessData({
            companyName: startup.Name || "Company",
            summary: summaryText || "No summary provided.",
            features: features,
          });
        } else {
          setBusinessData(null);
        }
      } catch (error) {
        console.error("Error fetching business summary:", error);
        setBusinessData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    businessData && (
      <div id="summary" className="w-full bg-gradient-to-r from-orange-200 to-orange-500 py-16 px-[69px] relative">
        <div className="absolute inset-0 bg-[url('/imgs/bg_impact_metrics.png')] bg-no-repeat bg-center bg-cover opacity-30"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between md:justify-start mb-8 space-y-3 md:space-y-0 md:space-x-3 w-full">
            <div className="w-1/5 md:w-16 hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <h1 className="text-3xl md:text-5xl font-bold mb-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                Business Summary
              </span>
            </h1>
            <div className="block md:hidden w-1/3 md:w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}

          {!loading && businessData && (
            <div className="bg-white rounded-xl shadow-2xl border border-orange-200 p-8 mb-6 bg-gradient-to-br from-white to-orange-50">
              <p className="text-lg text-gray-700 mb-8 whitespace-pre-line">
                {businessData.summary}
              </p>

              {businessData.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                  {businessData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="border border-orange-300 rounded-lg p-6 transition-all hover:shadow-[0px_0px_15px_3px_rgba(234,88,12,1)]"
                    >
                      <h2 className="text-2xl font-semibold text-orange-500 mb-4 flex items-center gap-2">
                        <svg
                          className="w-6 h-6 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {feature.title}
                      </h2>
                      <p className="text-gray-700 whitespace-pre-line">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
}
