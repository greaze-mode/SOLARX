import { useState, useEffect } from "react";
// import { getLocationFromLatLong } from "../utils/strapiHelper";
import * as countryFlags from "country-flag-icons/react/3x2";

const SolarFlowHero = ({ companyId }) => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCompanyData = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${baseUrl}/api/startups?filters[id][$eq]=${companyId}&populate=*`
        );
        const result = await response.json();
        const company =
          result.data && result.data.length > 0 ? result.data[0] : null;

        console.log("Fetched Company Data:", company);

        const logoUrl = company.Company_Logo?.url;
        // console.warn("LOGO URL:", logoUrl);

        if (company) {
          const data = {
            id: company.id,
            name: company.Name,
            description: company.Description[0].children[0].text,
            countryCode: company.Country || "",
            LogoUrl: logoUrl,
          };

          console.log("Company Data:", data);

          setCompanyData(data);
        } else {
          // console.warn("No company found with ID:", companyId);
          setCompanyData(null);
        }
      } catch (error) {
        console.error("Error fetching company hero data:", error);
        setError(`Error: ${error.message || "Failed to fetch company data"}`);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching company data for ID:", companyId);
    getCompanyData();
  }, [companyId]);
  console.log("Company Data2:", companyData);
  const FlagIcon =
    companyData &&
    companyData.countryCode &&
    countryFlags[companyData.countryCode]
      ? countryFlags[companyData.countryCode]
      : null;

  if (loading) {
    return (
      <div className="w-full min-h-[400px] bg-gray-100 flex items-center justify-center p-4 mt-[20px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">
            Loading company data...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[400px] bg-gray-100 flex items-center justify-center p-4 mt-[20px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[700px] bg-gray-100 flex items-center justify-center p-4 mt-[20px] overflow-hidden">
      {/* Blurred yellow/orange color patches */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-300 opacity-30 rounded-full filter blur-3xl mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-300 opacity-30 rounded-full filter blur-3xl mix-blend-multiply pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-yellow-200 opacity-20 rounded-full filter blur-[120px] mix-blend-multiply pointer-events-none"></div>

      {/* Foreground content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between px-4 md:px-8">
        <div className="w-full lg:w-2/3">
          <div className="text-5xl md:text-6xl font-bold mb-6 flex flex-col space-y-4 items-start">
            {companyData && companyData.name && (
              <span className="text-orange-600 text-shadow">
                {companyData.name}
              </span>
            )}
            <div className="w-1/5 h-[5px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6"></div>
          </div>

          <p className="text-gray-700 text-md md:text-xl mb-4 w-4/5">
            {companyData && companyData.description && (
              <span>{companyData.description}</span>
            )}
          </p>
        </div>

        <div className="w-full lg:w-1/3 relative flex flex-col justify-center">
          {companyData && companyData.LogoUrl && (
            <img
              src={companyData.LogoUrl}
              alt={companyData.name || "Cover Image"}
              className="w-full h-full object-contain rounded-lg shadow-2xl border-4 border-white border-solid p-2 ring-2 ring-orange-300"
            />
          )}
          {FlagIcon && (
            <div className="w-full flex relative">
              <FlagIcon
                className="w-16 h-16 absolute bottom-0 right-0 translate-y-full rounded-md"
                title={
                  companyData && companyData.countryCode
                    ? companyData.countryCode
                    : "Country Flag"
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarFlowHero;
