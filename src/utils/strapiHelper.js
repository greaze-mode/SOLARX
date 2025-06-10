/**
 * Utility functions to help with Strapi API integration
 */

// Map between Strapi admin IDs and API IDs
// Update this map whenever you notice a discrepancy
const idMap = {
  // Strapi Admin ID: API ID
  '16': '17',  // The company showing as ID 16 in admin is actually ID 17 in API
  // Add more mappings as needed
};

/**
 * Convert a Strapi admin ID to the corresponding API ID
 * @param {string|number} adminId - The ID shown in Strapi admin
 * @returns {string} - The corresponding ID to use in API calls
 */
export const getApiId = (adminId) => {
  const id = String(adminId);
  return idMap[id] || id;
};

/**
 * Convert an API ID back to the Strapi admin ID
 * @param {string|number} apiId - The ID returned by the API
 * @returns {string} - The corresponding ID shown in Strapi admin
 */
export const getAdminId = (apiId) => {
  const id = String(apiId);
  // Reverse lookup in the map
  for (const [adminId, mappedApiId] of Object.entries(idMap)) {
    if (mappedApiId === id) {
      return adminId;
    }
  }
  return id;
};

/**
 * Fetch all companies and return a mapping of names to IDs
 * This can be used to find the correct ID by company name
 */
export const getCompanyIdsByName = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/companies');
    const data = await response.json();

    if (data && data.data && Array.isArray(data.data)) {
      const mapping = {};
      data.data.forEach(company => {
        if (company.attributes.Name) {
          mapping[company.attributes.Name] = company.id;
        }
      });
      return mapping;
    }
    return {};
  } catch (error) {
    console.error('Error fetching company IDs by name:', error);
    return {};
  }
};


export async function getLocationFromLatLong(latitude, longitude) {
  if (!latitude || !longitude) {
    return null;
  }
  // const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=6`);
  // const response = await fetch(`https://us1.api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDJ3tSaumpWhGp7smd96Svg3eeOe1-4JWE`);
  const data = await response.json();

  // console.log('Reverse geocode data:', data);

  let city = '';
  let country = '';


  data.results[0].address_components.forEach((component) => {
    if (component.types.includes("administrative_area_level_2")) {
      city = component.long_name;
    }
    if (component.types.includes("country")) {
      country = component.long_name;
      // console.log('Country:', component.long_name);
    }
  })

  if (city !== '' && country !== '') {
    return `${city}, ${country}`;
    // return data.results[0].formatted_address || 'Location not found';
  } else if (city !== '') {
    return city;
  } else if (country !== '') {
    return country;
  } else {
    return 'Location not found';
  }
}

export function parseRichText(content) {
  if (!content || !Array.isArray(content)) return "";
  let fin = "";
  content.forEach((block) => {
    if (block.type === "paragraph") {
      fin += block.children
        .map((child) => child.text || "")
        .join("")
        .trim() + "\n";
    }
  })

  return fin.trim();
}

