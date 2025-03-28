import axios from 'axios';

const RESTRICTED_COUNTRIES = [
  "United States",
  "Myanmar [Burma]",
  "Ivory Coast",
  "Cuba",
  "Congo",
  "Iran",
  "Iraq",
  "Libya",
  "Mali",
  "Nicaragua",
  "North Korea",
  "Somalia",
  "Sudan",
  "Syria",
  "Yemen",
  "Zimbabwe",
];

const RESTRICTED_REGIONS = [
  "Crimea",
  "Republic of Crimea",
  "Bakhchysarai Raion",
  "Sevastopol",
];

export const checkLocation = async () => {
  try {
    const location = await axios.get(
      `https://ipwhois.pro/?key=${import.meta.env.VITE_APP_IPWHOIS_API_KEY}&security=1`
    );

    if (!location.data.success) {
      throw new Error(`Location fetching unsuccessful: ${location.data.message}`);
    }

    // const isVPN = location.data.security?.vpn;

    if (
      RESTRICTED_COUNTRIES.includes(location.data.country) ||
      RESTRICTED_REGIONS.includes(location.data.region)
    ) {
      return true; // Location is restricted
    }

    return false; // Location is allowed
  } catch (error) {
    console.log("VPN", error);
    return false;
  }
}; 