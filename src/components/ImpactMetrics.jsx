import React, { useEffect, useState } from "react";
import axios from "axios";
import KeyImpactMetricsScroller from "./KeyImpactMetricsScroller";

const CATEGORIES = {
  Environmental_Impact_Metrics: "Environmental Impact",
  Social_Impact_Metrics: "Social Impact",
  Economic_Impact_Metrics: "Economic Impact",
  Technology_And_Scalability_Metrics: "Technology & Scalability",
};

const getIconForMetric = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("co2") || lower.includes("carbon")) {
    return (
      <svg
        className="h-5 w-5 text-orange-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (lower.includes("energy") || lower.includes("power")) {
    return (
      <svg
        className="h-5 w-5 text-orange-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg
      className="h-5 w-5 text-orange-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
    </svg>
  );
};

const MetricCard = ({ metric, index }) => {
  const [value, ...subtitleParts] = metric.Metric.split(" ");
  const subtitle = subtitleParts.join(" ");
  const progress = 75 + ((index * 5) % 25);

  return (
    <div className="bg-white rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 mb-2">
      <div className="flex items-center gap-3 px-6 py-4 bg-orange-100 rounded-t-2xl">
        <div className="bg-white p-2 rounded-full shadow-inner">
          {getIconForMetric(metric.Title)}
        </div>
        <h3 className="text-md font-semibold text-gray-800">{metric.Title}</h3>
      </div>
      <div className="px-6 py-6">
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className="text-base font-medium text-gray-600">{subtitle}</div>
        </div>
      </div>
    </div>
  );
};

const MetricsSection = ({ title, metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="rounded-xl shadow-lg p-6 border border-orange-400 bg-white mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-16 h-1 bg-orange-500 rounded-full" />
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex space-x-4">
          {metrics.map((metric, index) => (
            <div key={metric.id} className="flex-shrink-0 w-64">
              <MetricCard metric={metric} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ImpactMetrics({ companyId }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL;
        const url = `${baseUrl}/api/startups?filters[id][$eq]=${companyId}&populate[0]=Environmental_Impact_Metrics&populate[1]=Social_Impact_Metrics&populate[2]=Economic_Impact_Metrics&populate[3]=Technology_And_Scalability_Metrics`;
        const res = await axios.get(url);
        const startup = res.data.data[0];

        const structured = [];
        // for (const key in CATEGORIES) {
        //   structured[key] = startup[key] || [];
        // }

        // console.log("Raw metrics data:", startup);
        Object.entries(startup).forEach(([key, value]) => {
          if (!CATEGORIES[key]) return; // Skip if not a recognized category
          value.forEach((item) => {
            structured.push({
              label: item.Title,
              value: item.Metric,
              id: item.id,
            });
          });
        });

        if (structured.length === 0) {
          // console.warn("No metrics found for company:", companyId);
          setMetrics(null);
        } else {
          setMetrics(structured);
        }

        // console.log(`Loaded metrics for company ${companyId}:`, structured);

        // console.log(`Metrics for:`, structured);
      } catch (err) {
        console.error("Error loading metrics:", err);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [companyId]);

  return (
    metrics && (
      <div className="w-full bg-gradient-to-r from-orange-200 to-orange-500 pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-[url('/imgs/bg_impact_metrics.png')] bg-no-repeat bg-center bg-cover opacity-20"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-3 w-full">
            <div className="flex items-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-1">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                  Impact Metrics
                </span>
              </h1>
            </div>
          </div>
          <div className="flex justify-center mb-10">
            <div className="w-1/6  hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-orange-500 rounded-full"></div>
            </div>
          ) : Object.values(metrics).every((arr) => arr.length === 0) ? (
            <div className="rounded-xl shadow-sm p-8 text-center text-gray-700">
              No impact metrics available for this company.
            </div>
          ) : (
            <>
              <KeyImpactMetricsScroller metrics={metrics} />
            </>
          )}
        </div>
      </div>
    )
  );
}
