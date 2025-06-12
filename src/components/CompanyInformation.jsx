import { useState, useEffect } from "react";
import { getLocationFromLatLong } from "../utils/strapiHelper";
import { Calendar, MapPin, Users, Shield, Target, Globe } from "lucide-react";
import { useParams } from "react-router-dom";
import * as countryCodes from "country-codes-list";

const getCountryNameFromCode = (code) => {
  if (!code || typeof code !== "string") return "Unknown Country";
  const country = countryCodes.findOne("countryCode", code.toUpperCase());
  return country ? country.countryNameEn : "Unknown Country";
};

export default function CompanyInformation({ companyId }) {
  // If companyId is not passed as prop, try to get it from URL params
  const params = useParams();
  const id = companyId || params.id;
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);

        // Get all companies first
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${baseUrl}/api/startups?filters[id][$eq]=${companyId}&pagination[pageSize]=100`
        );
        const result = await response.json();
        const companyData =
          result.data && result.data.length > 0 ? result.data[0] : null;

        if (companyData) {
          // Create a clean company object
          const cleanCompany = {
            id: companyData.id,
            Name: companyData.Name || "Unnamed Company",
            introduction: companyData.Description[0].children[0].text || "",
            Website: companyData.Website_URL || "",
            ContactEmail: companyData.Contact_Email || "",
            FoundingYear: companyData.Founding_Year || "",
            Location:
              companyData.HQ_Location_Name ||
              getCountryNameFromCode(companyData.Country) ||
              "Location not specified",
            // Headquarters:
            //   (await getLocationFromLatLong(
            //     companyData.HQ_Location.lat,
            //     companyData.HQ_Location.lng
            //   )) || "Location not specified",
            TeamSize: companyData.Team_Size || "",
            sdgs: companyData.SDG,
          };

          setCompany(cleanCompany);
        } else {
          setError("Company data not found");
        }
      } catch (err) {
        setError("Failed to load company details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);
  return (
    <div className="relative h-full">
      {/* <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(to bottom, oklch(98.5% 0.002 247.839), transparent 60%),
            linear-gradient(to right, oklch(90.1% 0.076 70.697), #F97316)
          `,
        }}
      /> */}
      <div className="relative z-20 py-16">
        <div className="px-[69px] w-full font-sans">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          {!loading && company && (
            <div className="w-full">
              <div className="flex flex-col md:flex-row items-center justify-between md:justify-start mb-8 space-y-3 md:space-y-0 md:space-x-3 w-full ">
                <div className="w-1/5 md:w-16 hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <h1 className="text-3xl md:text-5xl font-bold mb-1">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                    Company Details
                  </span>
                </h1>
                <div className="block md:hidden w-1/3 md:w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              </div>

              <div className="bg-gradient-to-br from-white to-orange-50 rounded-lg shadow-2xl p-6 border border-orange-200 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Founded */}
                  <div className="border border-gray-200 rounded-lg p-4 flex items-start bg-white">
                    <div className="bg-orange-500 rounded-full p-3 mr-4">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Founded</p>
                      <p className="text-gray-800 text-xl font-medium">
                        {company.FoundingYear || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* SDG Alignment */}
                  <div className="border border-gray-200 rounded-lg p-4 flex items-start bg-white">
                    <div className="bg-orange-500 rounded-full p-3 mr-4">
                      <Target className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">
                        SDG Alignment
                      </p>
                      <p className="text-gray-800 text-xl font-medium">
                        {company.sdgs && company.sdgs.length > 0
                          ? company.sdgs.map((sdg) => sdg).join(", ")
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border border-gray-200 rounded-lg p-4 flex items-start bg-white">
                    <div className="bg-orange-500 rounded-full p-3 mr-4">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Location</p>
                      <p className="text-gray-800 text-xl font-medium">
                        {company.Location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div className="border border-gray-200 rounded-lg p-4 flex items-start bg-white">
                    <div className="bg-orange-500 rounded-full p-3 mr-4">
                      <Users className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Team Size</p>
                      <p className="text-gray-800 text-xl font-medium">
                        {company.TeamSize
                          ? company.TeamSize == 1
                            ? `${company.TeamSize} employee`
                            : `${company.TeamSize} employees`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="border border-gray-200 rounded-lg p-4 flex items-start bg-white">
                    <div className="bg-orange-500 rounded-full p-3 mr-4">
                      <Globe className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Website</p>
                      <p className="text-gray-800 text-xl font-medium">
                        {company.Website ? (
                          <a
                            href={company.Website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            {company.Website}
                          </a>
                        ) : (
                          "Not specified"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div className="border border-gray-200 rounded-lg p-4 flex items-start bg-white">
                    <div className="bg-orange-500 rounded-full p-3 mr-4">
                      <Shield className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Contact</p>
                      <p className="text-gray-800 text-xl font-medium">
                        {company.ContactEmail ? (
                          <a
                            href={`mailto:${company.ContactEmail}`}
                            className="text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            {company.ContactEmail}
                          </a>
                        ) : (
                          "Not specified"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Milestones */}
                {/* {company.milestones &&
              company.milestones.data &&
              company.milestones.data.length > 0 && (
                <div className="mt-8 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Key Milestones
                  </h3>
                  <div className="space-y-4">
                    {company.milestones.data.map((milestone, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-orange-100 text-orange-600 rounded-full p-2 mr-4 mt-1">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {milestone.attributes.date}
                          </p>
                          <p className="text-gray-700">
                            {milestone.attributes.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
