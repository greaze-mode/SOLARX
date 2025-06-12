import React, { useState, useEffect } from "react";
import { API_URL } from "../services/api";
import {
  Building2,
  DollarSign,
  Zap,
  Globe,
  ShieldCheck,
  FlaskConical,
  TrendingUp,
  Users,
  Lightbulb,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount >= 1000000) return `USD ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `USD ${(amount / 1000).toFixed(1)}K`;
  return `USD ${amount.toFixed(0)}`;
};

// Component for individual investor display
const InvestorCard = ({ name, Icon, index, frequency }) => (
  <div
    className={`text-center p-3 sm:p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animation-delay-${
      index * 100
    }`}
    title={`${name}${
      frequency
        ? ` - Funded ${frequency} project${frequency !== 1 ? "s" : ""}`
        : ""
    }`}
  >
    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
    </div>
    <p className="text-gray-700 text-xs sm:text-sm font-semibold line-clamp-2 break-words">
      {name}
    </p>
    {frequency > 0 && (
      <div className="mt-1 text-xs text-orange-500 font-medium">
        {frequency} project{frequency !== 1 ? "s" : ""}
      </div>
    )}
  </div>
);

// Component for funding breakdown item
const FundingBreakdownItem = ({
  type,
  amountFormatted,
  widthPercentage,
  percentageFormatted,
}) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span
        className="text-sm font-medium text-gray-700 truncate pr-2"
        title={type}
      >
        {type}
      </span>
      <span className="text-sm font-bold text-orange-600 whitespace-nowrap">
        {amountFormatted}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
      <div
        className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
    <div className="text-xs text-gray-500 text-right mt-1">
      {percentageFormatted}%
    </div>
  </div>
);

// TODO: Investors CMS Entry is currently broken
// DONE: arrange investors in decreasing order of frequency of funding
// DONE: Get Investment Focus Areas from CMS, and arrange in decreasing order of frequency of funding
export default function FundingInvestorsDashboard() {
  const [fundingData, setFundingData] = useState([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const parseFundingData = (fundingItem) => {
    // console.warn("Funding Item:", fundingItem);
    const {
      Round,
      Amount_Raised,
      Date,
      Reason,
      investors: roundSpecificInvestors,
    } = fundingItem;

    const reasonText = (Reason || [])
      .map((paragraph) =>
        (paragraph.children || []).map((child) => child.text || "").join("")
      )
      .join(" ")
      .trim();

    const amount = parseFloat(Amount_Raised || 0);

    const extractedInvestorNames =
      roundSpecificInvestors && Array.isArray(roundSpecificInvestors)
        ? roundSpecificInvestors.map((inv) => inv.Name).filter((name) => name)
        : [];

    return {
      type: Round || "Unknown Round",
      amount,
      amountFormatted: formatCurrency(amount),
      date: Date || "N/A",
      sourceInvestors: extractedInvestorNames,
      reason: reasonText || "N/A",
    };
  };

  useEffect(() => {
    const fetchFundingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/startups?populate[0]=funding&populate[1]=funding.investors&pagination[pageSize]=100`
        );
        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
        const result = await response.json();
        // console.log("Funding Data Result:", result);

        if (result?.data?.length > 0) {
          let allRounds = [];
          let totalAmount = 0;
          let allInvestorsSet = new Set();

          result.data.forEach((item) => {
            const funding = item.funding || [];
            funding.forEach((fundingItem) => {
              const round = parseFundingData(fundingItem);
              allRounds.push(round);
              totalAmount += round.amount;
              if (round.sourceInvestors && round.sourceInvestors.length > 0) {
                round.sourceInvestors.forEach((name) =>
                  allInvestorsSet.add(name)
                );
              }
            });
          });

          const fundingByType = {};
          allRounds.forEach((round) => {
            if (!fundingByType[round.type]) {
              fundingByType[round.type] = 0;
            }
            fundingByType[round.type] += round.amount;
          });

          const aggregatedData = Object.entries(fundingByType)
            .map(([type, amount]) => {
              const percentage =
                totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
              return {
                type,
                amountFormatted: formatCurrency(amount),
                widthPercentage: percentage,
                percentageFormatted: percentage.toFixed(1),
              };
            })
            .sort((a, b) => b.widthPercentage - a.widthPercentage);

          const iconMap = [
            Users,
            Lightbulb,
            Zap,
            Globe,
            ShieldCheck,
            FlaskConical,
            DollarSign,
            Building2,
          ];
          // Count investor frequency
          const investorFrequencyMap = {};
          allRounds.forEach((round) => {
            if (round.sourceInvestors && round.sourceInvestors.length > 0) {
              round.sourceInvestors.forEach((name) => {
                if (!investorFrequencyMap[name]) {
                  investorFrequencyMap[name] = 0;
                }
                investorFrequencyMap[name]++;
              });
            }
          });

          // Sort investors by frequency (descending order)
          const sortedInvestors = Array.from(allInvestorsSet).sort(
            (a, b) =>
              (investorFrequencyMap[b] || 0) - (investorFrequencyMap[a] || 0)
          );

          const investorsArray = sortedInvestors
            .slice(0, 6)
            .map((name, index) => ({
              name,
              icon: iconMap[index % iconMap.length],
              frequency: investorFrequencyMap[name] || 0,
            }));

          // Extract focus areas from funding data
          // For this example, we'll use Technology_Tags from startups as focus areas
          const focusAreaFrequencyMap = {};
          result.data.forEach((item) => {
            const technologyTags = item.Technology_Tags || [];
            const sectorTags = item.Sector_Tags || [];
            const productTags = item.Product_Tags || [];

            // Combine all tags as potential focus areas
            const allTags = [...technologyTags, ...sectorTags, ...productTags];

            allTags.forEach((tag) => {
              if (tag && tag.trim()) {
                if (!focusAreaFrequencyMap[tag]) {
                  focusAreaFrequencyMap[tag] = 0;
                }
                focusAreaFrequencyMap[tag]++;
              }
            });
          });

          // Sort focus areas by frequency
          const sortedFocusAreas = Object.keys(focusAreaFrequencyMap)
            .sort((a, b) => focusAreaFrequencyMap[b] - focusAreaFrequencyMap[a])
            .slice(0, 6); // Limit to top 6 focus areas

          setFundingData(aggregatedData);
          setTotalFunding(totalAmount);
          setInvestors(investorsArray);
          setFocusAreas(sortedFocusAreas);
        } else {
          setFundingData([]);
          setTotalFunding(0);
          setInvestors([]);
          setFocusAreas([]);
        }
      } catch (err) {
        console.error("Error fetching funding data:", err);
        setError("Failed to load funding data. Please try again later.");
        setInvestors([]);
        setFocusAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFundingData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex justify-center items-center p-8">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto" />
          <p className="mt-4 text-xl text-gray-600">
            Loading Funding Dashboard...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-red-50 flex justify-center items-center p-8">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-5" />
          <h2 className="text-2xl font-semibold text-red-700 mb-3">
            Oops! Something Went Wrong
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (
    fundingData.length === 0 &&
    totalFunding === 0 &&
    investors.length === 0 &&
    !loading
  ) {
    return (
      <section
        id="funding"
        className="min-h-screen bg-gray-50 flex justify-center items-center p-8"
      >
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-5" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            No Funding Information Available
          </h2>
          <p className="text-gray-500">
            Funding data and investor information will be displayed here once
            available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`min-h-screen bg-white p-6 sm:p-16 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div
          className="text-center mb-12 sm:mb-16 transform transition-all duration-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Funding & Investors
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Mobilizing capital to accelerate solar innovation and deployment
            across emerging markets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column (Wider) - Funding Breakdown & Total */}
          <div className="lg:col-span-2 space-y-6">
            {/* Funding Breakdown */}
            <div
              className={`bg-orange-100/80 backdrop-blur-md p-4 sm:p-5 rounded-xl shadow-lg border border-orange-100/60 transform transition-all duration-300 hover:-translate-y-1 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6"
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Funding Breakdown
                </h3>
              </div>
              <div className="space-y-4">
                {fundingData.length > 0 ? (
                  fundingData.map((item, index) => (
                    <FundingBreakdownItem
                      key={index}
                      type={item.type}
                      amountFormatted={item.amountFormatted}
                      widthPercentage={item.widthPercentage}
                      percentageFormatted={item.percentageFormatted}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">
                    No funding breakdown data available.
                  </p>
                )}
              </div>
            </div>

            {/* Total Funding */}
            <div
              className={`bg-orange-100/80 backdrop-blur-md p-4 sm:p-5 rounded-xl shadow-lg border border-green-100/60 transform transition-all duration-300 hover:-translate-y-1 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6"
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Total Funding Facilitated
                </h3>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                {formatCurrency(totalFunding)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Cumulative capital raised to date.
              </p>
            </div>
          </div>

          {/* Right Column - Investors & Focus Areas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Investors & Partners */}
            {investors.length > 0 && (
              <div
                className={`bg-orange-100/80 backdrop-blur-md p-4 sm:p-5 rounded-xl shadow-lg border border-blue-100/60 transform transition-all duration-300 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6"
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    Key Investors & Partners
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {investors.map((investor, index) => (
                    <InvestorCard
                      key={index}
                      name={investor.name}
                      Icon={investor.icon}
                      index={index}
                      frequency={investor.frequency}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Investment Focus Areas */}
            {focusAreas.length > 0 && (
              <div
                className={`bg-orange-100/80 backdrop-blur-md p-4 sm:p-5 rounded-xl shadow-lg border border-purple-100/60 transform transition-all duration-300 hover:-translate-y-1 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6"
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    Investment Focus Areas
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {focusAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-orange-600 text-xs sm:text-sm font-medium shadow transition-all duration-300 hover:shadow-md cursor-default bg-white"
                      title={area}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
