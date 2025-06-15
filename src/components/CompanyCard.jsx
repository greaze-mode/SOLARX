import { Link } from "react-router-dom";
import { APP_URL } from "../services/api";
import { MapPin } from "lucide-react";
import * as countryFlags from "country-flag-icons/react/3x2";

export default function CompanyCard({
  id,
  documentId,
  name,
  regions,
  location,
  countryCode,
  country,
  description,
  categories,
  isWomanLed,
  logo,
}) {
  const FlagIcon =
    countryCode && countryFlags[countryCode] ? countryFlags[countryCode] : null;
  // console.log("Country Code:", countryCode);
  // console.log(FlagIcon);
  // console.log(regions)
  return (
    <Link
      to={`/startup/${documentId}`}
      className="flex flex-col h-full bg-white rounded-xl max-w-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group"
    >
      <div className="relative h-40 sm:h-48 bg-red-900">
        {logo ? (
          <img
            src={logo.startsWith("http") ? logo : `${APP_URL}${logo}`}
            alt={`${name} Logo`}
            className="bg-white h-40 sm:h-48 p-4 w-full object-contain transition-transform duration-300 group-hover:scale-105 overflow-hidden"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Logo Available</span>
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 flex flex-row space-x-1.5 z-10">
          {regions && regions !== "" && (
            <span
              className={`orange-gradient text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow`}
            >
              {regions}
            </span>
          )}
        </div>
        <div className="absolute bottom-1 right-1.5 flex flex-row space-x-1.5 z-10">
          {countryCode && countryFlags[countryCode] && (
            <FlagIcon className="w-6 h-4 sm:w-10 sm:h-10" title={country} />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow border-t-2 border-orange-100">
        <div className="p-4 sm:p-5 w-full flex flex-col flex-grow">
          <div className="w-full flex flex-row justify-between">
            <h3
              className="text-lg sm:text-xl font-bold mb-1 text-gray-800 line-clamp-1 w-11/12"
              title={name}
            >
              <span className="notranslate">{name}</span>
            </h3>
            {isWomanLed && (
              <div className="relative inline-0">
                <span className="text-white font-medium group text-lg w-8 h-8 text-center rounded-full pt-0.5 shadow-2xl">
                  ♀️
                  {/* <div className="absolute z-[1000] left-0 top-0 -translate-x-full -translate-y-full mt-2 w-max text-xs text-gray-900 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Woman-Led Startup
                </div> */}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center mb-2">
            <MapPin size={15} className="mr-1 text-orange-600" />
            <p
              className="text-base text-gray-500 line-clamp-1"
              title={location !== "" ? location : country}
            >
              {location !== "" ? location : country}
            </p>
          </div>
          <p
            className="text-sm text-gray-700 mb-3 line-clamp-2 flex-grow"
            style={{ minHeight: "2.5rem" }}
            title={description}
          >
            {description}
          </p>
        </div>
        <div className="mt-auto flex flex-col justify-between items-center pt-4 gap-6 border-t border-gray-200 bg-gray-100 p-4">
          <div className="relative flex flex-row space-x-1">
            {categories.map((category, idx) => (
              <span
                className={`text-orange-700 bg-orange-50 border border-sm text-xs px-3 py-1 rounded-full shadow`}
                key={`${documentId}-category-${idx}`}
                title={`Category: ${category}`}
              >
                {category}
              </span>
            ))}
          </div>
          <div className="text-white text-xs sm:text-sm orange-gradient px-4 py-2 rounded-full shadow-lg font-medium group-hover:underline hover:scale-110 transition-all duration-300 ease-in-out delay-0">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
}
