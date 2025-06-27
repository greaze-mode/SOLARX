import axios from "axios";
import { getApiId } from "../utils/strapiHelper";

// const API_URL = 'http://localhost:1337/api';
export const APP_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_URL = `${APP_URL}/api`;

// // Company data
// export const fetchCompanyData = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/startups?populate=*`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching company data:', error);
//     throw error;
//   }
// };

// // Companies data (for SolarXWinners)
// export const fetchCompanies = async (filters = {}) => {
//   try {
//     // Build query parameters
//     let queryParams = '?populate=*';

//     // Add region filter if provided
//     if (filters.region && filters.region !== 'all') {
//       queryParams += `&filters[Regions][$eq]=${filters.region}`;
//     }

//     // Add sorting if needed
//     queryParams += '&sort=createdAt:desc';

//     const response = await axios.get(`${API_URL}/startups${queryParams}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching companies data:', error);
//     throw error;
//   }
// };

export const fetchCompanies = async () => {
  try {
    // Build query parameters
    // console.log(`${API_URL}/startups${queryParams}`);

    const response = await axios.get(
      `${API_URL}/startups${queryParams}&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching companies data:", error);
    throw error;
  }
};

// Use fetchCompanies() for basic fetch
// Use fetchCompanies({ region: 'someRegion' }) for filtered fetch

// Fetch a single company by ID with full details (for CompanyCard component)
export const fetchCompanyById = async (id) => {
  try {
    if (!id) {
      throw new Error("Company ID is required");
    }

    // For this implementation, we'll use the same endpoint as fetchCompanies
    // but filter by ID to get a specific company
    const response = await axios.get(
      `${API_URL}/startups?filters[id][$eq]=${id}&populate=*&pagination[pageSize]=100`,
    );
    console.log(`Fetched company ${id}:`, response.data);

    // Return the first item in the data array (should be only one since we filtered by ID)
    if (response.data && response.data.data && response.data.data.length > 0) {
      return { data: response.data.data[0] };
    } else {
      throw new Error(`Company with ID ${id} not found`);
    }
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error);
    throw error;
  }
};

// Get media URL helper function
export const getMediaUrl = (media) => {
  if (!media) return "";

  // Check if we have a URL directly
  if (media.url) {
    return `${media.url.startsWith("http") ? "" : `${APP_URL}`}${media.url}`;
  }

  // Check if we have attributes with URL
  if (media.attributes && media.attributes.url) {
    return `${media.attributes.url.startsWith("http") ? "" : `${APP_URL}`}${media.attributes.url}`;
  }

  // For Strapi v4 structure
  if (media.data && media.data.attributes && media.data.attributes.url) {
    return `${media.data.attributes.url.startsWith("http") ? "" : `${APP_URL}`}${media.data.attributes.url}`;
  }

  return "";
};

// Fetch a single company with all its relationships for the StartupDetail page
export const fetchCompanyWithRelationships = async (id) => {
  try {
    if (!id) {
      console.warn("Company ID is required");
      return null;
    }

    console.log(`Fetching company with ID: ${id}`);

    // Use fetch instead of axios to match the working approach in StartupDetail.jsx
    try {
      // Use filter query approach since direct endpoint is returning 404
      const response = await fetch(
        `${API_URL}/companies?filters[id][$eq]=${id}&populate=Logo&pagination[pageSize]=100`,
      );
      const data = await response.json();

      console.log(`Fetched company ${id} with relationships:`, data);

      // Log the raw data structure to help debug
      if (data && data.data && data.data.length > 0) {
        console.log(`Raw company data structure:`, data.data[0]);
      }

      if (data && data.data && data.data.length > 0) {
        // Return the company data directly
        const companyData = data.data[0];

        const hasAttributes = Object.prototype.hasOwnProperty.call(
          companyData,
          "attributes",
        );
        const fields = hasAttributes ? companyData.attributes : companyData;

        console.log(`Company data structure for ID ${id}:`, companyData);
        console.log(`Using fields for company ${id}:`, fields);

        // Extract introduction content from the rich text field using our helper function
        const introText = parseRichText(fields.introduction);
        console.log(`Parsed introduction for company ${id}:`, introText);

        // Create a safe company data object with fallbacks for all properties
        return {
          id: companyData.id,
          ...(hasAttributes ? fields : {}),
          Name: fields.Name || "Unnamed Company",
          name: fields.Name || "Unnamed Company", // Add name for consistency
          Headquarters: fields.Headquarters || "Location not specified",
          introduction: fields.introduction, // Keep the original format for other components
          parsedIntroduction: introText, // Add parsed version
          description: introText || fields.description || "", // Add description for consistency
          Logo: fields.Logo || null,
          logo: fields.Logo || null,
          imageUrl:
            hasAttributes && fields.Logo?.data?.attributes?.url
              ? `${APP_URL}${fields.Logo.data.attributes.url}`
              : null,
          founders: [], // Founders will be fetched separately if needed
          // businessSummary, technology, and impactMetrics are now handled by separate API calls
        };
      }

      console.warn(`No company found with ID ${id}`);
      return null;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      return null;
    }
  } catch (error) {
    console.error(
      `Error in fetchCompanyWithRelationships for ID ${id}:`,
      error,
    );
    return null;
  }
};

// Founder data
export const fetchFounderData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/founders?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching founder data:", error);
    throw error;
  }
};

// Funding data
export const fetchFundingData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/fundings?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching funding data:", error);
    throw error;
  }
};

// SDG data
export const fetchSDGData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/sdgs?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching SDG data:", error);
    throw error;
  }
};

// Business Summary data
export const fetchBusinessSummaryData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/business-summaries?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching business summary data:", error);
    throw error;
  }
};

// Technology data
export const fetchTechnologyData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/technologies?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching technology data:", error);
    throw error;
  }
};

// Impact Metrics data
export const fetchImpactMetricsData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/impact-metrics?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching impact metrics data:", error);
    throw error;
  }
};

// Projects data
export const fetchProjectsData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/projects?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching projects data:", error);
    throw error;
  }
};

// Global Presence data
export const fetchGlobalPresenceData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/global-presences?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching global presence data:", error);
    throw error;
  }
};

// Milestones data
export const fetchMilestonesData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/milestones?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching milestones data:", error);
    throw error;
  }
};

// Media Coverage data
export const fetchMediaCoverageData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/media-coverages?populate=*&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching media coverage data:", error);
    throw error;
  }
};

// Generic function to fetch any content type
export const fetchData = async (contentType, queryParams = "") => {
  try {
    const response = await axios.get(
      `${API_URL}/${contentType}${queryParams}&pagination[pageSize]=100`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${contentType} data:`, error);
    throw error;
  }
};

// Function to submit form data to Strapi
export const submitFormData = async (contentType, data) => {
  try {
    const response = await axios.post(`${API_URL}/${contentType}`, { data });
    return response.data;
  } catch (error) {
    console.error(`Error submitting ${contentType} data:`, error);
    throw error;
  }
};

// Function to upload files
export const uploadFile = async (file, refId, ref, field) => {
  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("refId", refId);
    formData.append("ref", ref);
    formData.append("field", field);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Function to update existing data
export const updateData = async (contentType, id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${contentType}/${id}`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating ${contentType} data:`, error);
    throw error;
  }
};

// Function to delete data
export const deleteData = async (contentType, id) => {
  try {
    const response = await axios.delete(`${API_URL}/${contentType}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${contentType} data:`, error);
    throw error;
  }
};

// Helper functions for StartupDetail page components

// Helper function to extract image URL from Strapi data
const extractImageUrl = (imageData) => {
  if (!imageData) return null;

  try {
    // If it's a direct data object with attributes
    if (
      imageData.data &&
      imageData.data.attributes &&
      imageData.data.attributes.url
    ) {
      return `${APP_URL}${imageData.data.attributes.url}`;
    }

    // If it's an array of media objects
    if (Array.isArray(imageData) && imageData.length > 0) {
      const image = imageData[0];
      if (image && image.url) {
        return `${APP_URL}${image.url}`;
      }
    }

    return null;
  } catch (err) {
    console.error("Error extracting image URL:", err);
    return null;
  }
};

// Helper function to parse Strapi rich text content
const parseRichText = (richTextContent) => {
  console.log("Parsing rich text content:", richTextContent);

  if (!richTextContent) {
    console.log("Rich text content is empty or null");
    return "";
  }

  // If it's already a string, return it
  if (typeof richTextContent === "string") {
    console.log("Rich text content is already a string");
    return richTextContent;
  }

  // If it's an array (rich text format), parse it
  if (Array.isArray(richTextContent)) {
    console.log(
      "Rich text content is an array with length:",
      richTextContent.length,
    );

    const parsedText = richTextContent
      .map((block) => {
        console.log("Processing block:", block);

        if (block && block.children && Array.isArray(block.children)) {
          const blockText = block.children
            .map((child) => {
              console.log("Processing child:", child);
              return child.text || "";
            })
            .join("");

          console.log("Block text:", blockText);
          return blockText;
        }
        return "";
      })
      .join("\n");

    console.log("Final parsed text:", parsedText);
    return parsedText;
  }

  // If we can't parse it, return empty string
  console.log("Could not parse rich text content, returning empty string");
  return "";
};

// Fetch company hero data
export const fetchCompanyHeroData = async (id) => {
  try {
    if (!id) {
      console.warn("Company ID is required for fetchCompanyHeroData");
      return null;
    }

    console.log(`Fetching hero data for company ID: ${id}`);

    // Use the collection endpoint with filter which we know works
    try {
      // Make a direct API call to get company data using the collection endpoint
      const response = await fetch(
        `${API_URL}/companies?filters[id][$eq]=${id}&populate=Logo&pagination[pageSize]=100`,
      );
      const data = await response.json();

      console.log(`API response for company ${id}:`, data);

      if (data && data.data && data.data.length > 0) {
        const companyData = data.data[0];
        const attributes = companyData.attributes || {};

        console.log(`Company ${id} raw data:`, companyData);
        console.log(`Company ${id} name:`, attributes.Name);

        // Log the raw introduction field
        console.log("Raw introduction field:", attributes.introduction);

        // Parse the rich text introduction field
        const introText = parseRichText(attributes.introduction);
        console.log("Parsed introduction text:", introText);

        // Create a clean hero data object
        const heroData = {
          id: companyData.id,
          name: attributes.Name || "Company Name",
          description: introText || "",
          rawIntroduction: attributes.introduction, // Include raw data for debugging
          imageUrl: attributes.Logo?.data?.attributes?.url
            ? `${APP_URL}${attributes.Logo.data.attributes.url}`
            : null,
          logo: attributes.Logo || null,
          coverImage: attributes.Logo || null,
        };

        console.log("Returning hero data:", heroData);
        return heroData;
      } else {
        console.warn(`No company data found for ID ${id} in API response`);
      }
    } catch (apiError) {
      console.error(`API call failed: ${apiError.message}`);
    }

    // Fallback to using fetchCompanyWithRelationships
    console.log(`Falling back to fetchCompanyWithRelationships for ID ${id}`);
    const company = await fetchCompanyWithRelationships(id);
    if (!company) {
      console.warn(
        `No company data found for ID ${id} in fetchCompanyWithRelationships`,
      );
      return null;
    }

    console.log(`Company data from fetchCompanyWithRelationships:`, company);

    // Log the raw introduction field
    console.log("Raw introduction field (fallback):", company.introduction);

    // Parse the rich text introduction field if needed
    const introText = parseRichText(company.introduction);
    console.log("Parsed introduction text (fallback):", introText);

    // Create a clean hero data object
    const heroData = {
      id: company.id,
      name: company.Name || company.name || "Company Name",
      description: introText || "",
      rawIntroduction: company.introduction, // Include raw data for debugging
      imageUrl: company.imageUrl || extractImageUrl(company.Logo) || null,
      logo: company.Logo,
      coverImage: company.Logo,
    };

    console.log("Returning hero data (fallback):", heroData);
    return heroData;
  } catch (error) {
    console.error(`Error fetching company hero data for ID ${id}:`, error);
    return null;
  }
};

// Fetch company business summary
export const fetchCompanyBusinessSummary = async (id) => {
  try {
    // Convert Strapi admin ID to API ID if needed
    const apiId = getApiId(id);
    console.log(
      `Fetching business summary for company ID: ${id} (API ID: ${apiId})`,
    );

    // First try to get the business summary directly from the business-summaries endpoint
    try {
      const response = await fetch(
        `${API_URL}/business-summaries?filters[company][id][$eq]=${apiId}&pagination[pageSize]=100`,
      );
      const result = await response.json();
      console.log(`Business summaries API response:`, result);

      if (result && result.data && result.data.length > 0) {
        // We found a business summary for this company
        const summaryData = result.data[0].attributes;
        console.log("Found business summary data:", summaryData);

        // Get company name from company data
        let companyName = "Company Name";
        let companyLogo = null;

        try {
          const companyResponse = await fetch(
            `${API_URL}/companies?filters[id][$eq]=${id}&populate=Logo&pagination[pageSize]=100`,
          );
          const companyResult = await companyResponse.json();

          if (
            companyResult &&
            companyResult.data &&
            companyResult.data.length > 0
          ) {
            const companyData = companyResult.data[0].attributes;
            companyName = companyData.Name || "Company Name";
            companyLogo = companyData.Logo?.data?.attributes?.url
              ? `${APP_URL}${companyData.Logo.data.attributes.url}`
              : null;
          }
        } catch (companyError) {
          console.error("Error fetching company data:", companyError);
        }

        // Extract summary text from rich text format
        let summaryText = "";
        if (summaryData.summary && Array.isArray(summaryData.summary)) {
          summaryText = summaryData.summary
            .map((block) => {
              if (block.children) {
                return block.children.map((child) => child.text).join("");
              }
              return "";
            })
            .join("\n");
        } else if (typeof summaryData.summary === "string") {
          summaryText = summaryData.summary;
        }

        return {
          companyName,
          companyLogo,
          summary: summaryText || "",
          overview: summaryText || "",
          efficiency: {
            title: summaryData.efficiency_title || "Efficiency",
            description: summaryData.efficiency_description || "",
          },
          costEffectiveness: {
            title: summaryData.cost_effectiveness_title || "Cost Effectiveness",
            description: summaryData.cost_effectiveness_description || "",
          },
          sustainability: {
            title: summaryData.sustainability_title || "Sustainability",
            description: summaryData.sustainability_description || "",
          },
          additionalFeature: {
            title: summaryData.additional_feature_title || "Carbon Footprint",
            description: summaryData.additional_feature_description || "",
          },
        };
      }
    } catch (directError) {
      console.error("Error fetching from business-summaries API:", directError);
    }

    // If we couldn't get data from the business-summaries endpoint, try to fetch the company using filter query
    try {
      const response = await fetch(
        `${API_URL}/companies?filters[id][$eq]=${apiId}&pagination[pageSize]=100`,
      );
      const result = await response.json();

      if (!result || !result.data || result.data.length === 0) {
        console.warn(
          `No company data found for ID ${id} in fetchCompanyBusinessSummary`,
        );
        return {
          companyName: "Company Name",
          summary:
            "Our company is revolutionizing renewable energy access in developing regions.",
        };
      }

      const companyData = result.data[0].attributes;

      // Extract introduction content from the rich text field
      let introText = "";
      if (companyData.introduction && Array.isArray(companyData.introduction)) {
        introText = companyData.introduction
          .map((block) => {
            if (block.children) {
              return block.children.map((child) => child.text).join("");
            }
            return "";
          })
          .join("\n");
      } else if (typeof companyData.introduction === "string") {
        introText = companyData.introduction;
      }

      return {
        companyName: companyData.Name || "Company Name",
        companyLogo: companyData.Logo?.data?.attributes?.url
          ? `http://localhost:1337${companyData.Logo.data.attributes.url}`
          : null,
        summary: introText || "No business summary available",
        overview: introText || "",
        efficiency: {
          title: "Efficiency",
          description:
            "Our innovative technology maximizes output even in challenging conditions.",
        },
        costEffectiveness: {
          title: "Cost Effectiveness",
          description:
            "Our solutions are designed to be cost-effective, making them more accessible.",
        },
        sustainability: {
          title: "Sustainability",
          description:
            "Our approach prioritizes sustainability and environmental responsibility.",
        },
        additionalFeature: {
          title: "Carbon Footprint",
          description:
            "Our technology significantly reduces carbon emissions compared to traditional methods.",
        },
      };
    } catch (companyError) {
      console.error("Error fetching company data:", companyError);
      return {
        companyName: "Company Name",
        summary:
          "Our company is revolutionizing renewable energy access in developing regions.",
        efficiency: {
          title: "Efficiency",
          description:
            "Our innovative technology maximizes output even in challenging conditions.",
        },
        costEffectiveness: {
          title: "Cost Effectiveness",
          description:
            "Our solutions are designed to be cost-effective, making them more accessible.",
        },
        sustainability: {
          title: "Sustainability",
          description:
            "Our approach prioritizes sustainability and environmental responsibility.",
        },
        additionalFeature: {
          title: "Carbon Footprint",
          description:
            "We're committed to reducing carbon footprint and contributing to climate change mitigation.",
        },
      };
    }
  } catch (error) {
    console.error(
      `Error fetching business summary for company ID ${id}:`,
      error,
    );
    return {
      companyName: "Company Name",
      summary:
        "Our company is revolutionizing renewable energy access in developing regions.",
      efficiency: {
        title: "Efficiency",
        description:
          "Our innovative technology maximizes output even in challenging conditions.",
      },
      costEffectiveness: {
        title: "Cost Effectiveness",
        description:
          "Our solutions are designed to be cost-effective, making them more accessible.",
      },
      sustainability: {
        title: "Sustainability",
        description:
          "Our approach prioritizes sustainability and environmental responsibility.",
      },
      additionalFeature: {
        title: "Carbon Footprint",
        description:
          "We're committed to reducing carbon footprint and contributing to climate change mitigation.",
      },
    };
  }
};

// Fetch company technology data
export const fetchCompanyTechnology = async (id) => {
  try {
    console.log(`Fetching technology data for company ID: ${id}`);

    // First try to get the technology data directly from the technologies endpoint
    try {
      const response = await fetch(
        `${API_URL}/technologies?filters[company][id][$eq]=${id}&pagination[pageSize]=100`,
      );
      const result = await response.json();
      console.log(`Technologies API response:`, result);

      if (result && result.data && result.data.length > 0) {
        // We found technology data for this company
        const techData = result.data[0].attributes;
        console.log("Found technology data:", techData);

        // Get company name from company data
        let companyName = "Company Name";
        let companyLogo = null;

        try {
          const companyResponse = await fetch(
            `${API_URL}/companies?filters[id][$eq]=${id}&populate=Logo&pagination[pageSize]=100`,
          );
          const companyResult = await companyResponse.json();

          if (
            companyResult &&
            companyResult.data &&
            companyResult.data.length > 0
          ) {
            const companyData = companyResult.data[0].attributes;
            companyName = companyData.Name || "Company Name";
            companyLogo = companyData.Logo?.data?.attributes?.url
              ? `http://localhost:1337${companyData.Logo.data.attributes.url}`
              : null;
          }
        } catch (companyError) {
          console.error("Error fetching company data:", companyError);
        }

        return {
          companyName,
          companyLogo,
          ...techData,
        };
      }
    } catch (directError) {
      console.error("Error fetching from technologies API:", directError);
    }

    // If we couldn't get data from the technologies endpoint, use fallback data
    const company = await fetchCompanyWithRelationships(id);

    if (!company) {
      console.warn(
        `No company data found for ID ${id} in fetchCompanyTechnology`,
      );
      return {
        companyName: "Company Name",
        overview:
          "Our technology is at the forefront of innovation in the renewable energy sector.",
      };
    }

    // Use company data as fallback
    return {
      companyName: company.Name || company.name || "Company Name",
      companyLogo: company.imageUrl || extractImageUrl(company.Logo) || null,
      overview:
        "Our technology is at the forefront of innovation in the renewable energy sector.",
      keyFeatures: [
        {
          title: "Innovative Design",
          description: "Our patented design maximizes energy capture.",
        },
        {
          title: "Durability",
          description: "Built to withstand extreme weather conditions.",
        },
        {
          title: "Efficiency",
          description: "Industry-leading conversion rates.",
        },
      ],
    };
  } catch (error) {
    console.error(
      `Error fetching technology data for company ID ${id}:`,
      error,
    );
    return {
      companyName: "Company Name",
      overview:
        "Our technology is at the forefront of innovation in the renewable energy sector.",
    };
  }
};

export const fetchCompanyImpactMetrics = async (id) => {
  try {
    // Convert Strapi admin ID to API ID if needed
    const apiId = getApiId(id);
    console.log(
      `Fetching impact metrics for company ID: ${id} (API ID: ${apiId})`,
    );
    try {
      const response = await fetch(
        `${API_URL}/impact-metrics?filters[company][id][$eq]=${apiId}&pagination[pageSize]=100`,
      );
      const result = await response.json();
      // console.log(`Impact metrics API response:`, result);

      if (result && result.data && result.data.length > 0) {
        // We found impact metrics for this company
        const metricsData = result.data[0].attributes;
        console.log("Found impact metrics data:", metricsData);

        let companyName = "Company Name";
        let companyLogo = null;

        try {
          const companyResponse = await fetch(
            `${API_URL}/companies?filters[id][$eq]=${id}&populate=Logo&pagination[pageSize]=100`,
          );
          const companyResult = await companyResponse.json();

          if (
            companyResult &&
            companyResult.data &&
            companyResult.data.length > 0
          ) {
            const companyData = companyResult.data[0].attributes;
            companyName = companyData.Name || "Company Name";
            companyLogo = companyData.Logo?.data?.attributes?.url
              ? `http://localhost:1337${companyData.Logo.data.attributes.url}`
              : null;
          }
        } catch (companyError) {
          console.error("Error fetching company data:", companyError);
        }

        return {
          companyName,
          companyLogo,
          ...metricsData,
        };
      }
    } catch (directError) {
      console.error("Error fetching from impact-metrics API:", directError);
    }

    // If we couldn't get data from the impact-metrics endpoint, try to fetch the company using filter query
    try {
      const response = await fetch(
        `${API_URL}/companies?filters[id][$eq]=${apiId}&pagination[pageSize]=100`,
      );
      const result = await response.json();

      if (!result || !result.data || result.data.length === 0) {
        console.warn(
          `No company data found for ID ${id} in fetchCompanyImpactMetrics`,
        );
        return {
          companyName: "Company Name",
          overview:
            "Our solutions have a significant positive impact on communities and the environment.",
        };
      }

      // Company exists but no impact metrics, use company name with default metrics
      const companyData = result.data[0];

      // Check if the data has attributes property or if fields are directly on the object
      const hasAttributes = Object.prototype.hasOwnProperty.call(
        companyData,
        "attributes",
      );
      const fields = hasAttributes ? companyData.attributes : companyData;

      console.log("Impact metrics company data:", companyData);
      console.log("Using fields for impact metrics:", fields);

      return {
        companyName: fields.Name || "Company Name",
        overview:
          "Our solutions have a significant positive impact on communities and the environment.",
        metrics: [
          {
            title: "CO2 Reduction",
            value: "500,000",
            unit: "tons",
            period: "annually",
          },
          {
            title: "Energy Access",
            value: "250,000",
            unit: "people",
            period: "to date",
          },
          {
            title: "Jobs Created",
            value: "1,200",
            unit: "jobs",
            period: "to date",
          },
        ],
      };
    } catch (error) {
      console.warn(
        `Error fetching company data for ID ${id} in fetchCompanyImpactMetrics:`,
        error,
      );
      return {
        companyName: "Company Name",
        overview:
          "Our solutions have a significant positive impact on communities and the environment.",
      };
    }

    // This code will not be reached due to the return statements in the try/catch block above
  } catch (error) {
    console.error(`Error fetching impact metrics for company ID ${id}:`, error);
    return {
      companyName: "Company Name",
      overview:
        "Our solutions have a significant positive impact on communities and the environment.",
    };
  }
};

// Fetch company mentors/team
export const fetchCompanyTeam = async (id) => {
  try {
    // Convert Strapi admin ID to API ID if needed
    const apiId = getApiId(id);
    console.log(`Fetching team for company ID: ${id} (API ID: ${apiId})`);

    // Try to fetch the company using filter query
    try {
      const response = await fetch(
        `${API_URL}/companies?filters[id][$eq]=${apiId}&populate=founders,Logo&pagination[pageSize]=100`,
      );
      const result = await response.json();

      if (result && result.data && result.data.length > 0) {
        const companyData = result.data[0];
        return {
          founders: companyData.attributes.founders?.data || [],
          companyName: companyData.attributes.Name || "Company Name",
          companyLogo: companyData.attributes.Logo?.data?.attributes?.url
            ? `http://localhost:1337${companyData.attributes.Logo.data.attributes.url}`
            : null,
        };
      }

      // If we couldn't get the company data
      console.warn(`No company data found for ID ${id} in fetchCompanyTeam`);
      return { founders: [] };
    } catch (error) {
      console.error(
        `Error fetching company data for ID ${id} in fetchCompanyTeam:`,
        error,
      );
      return { founders: [] };
    }
  } catch (error) {
    console.error(`Error in fetchCompanyTeam for ID ${id}:`, error);
    return { founders: [] };
  }
};

// Fetch mentors data (from founders endpoint)
export const fetchMentors = async (id) => {
  try {
    // Using the founders endpoint which contains the mentor data
    const response = await axios.get(
      `${API_URL}/startups?filters[id][$eq]=${id}&populate[0]=founders&populate[1]=founders.Profile_Picture`,
    );

    // Log the response to help with debugging
    // console.log('Mentors API response (from founders):', response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching mentors data:", error);
    throw error;
  }
};
