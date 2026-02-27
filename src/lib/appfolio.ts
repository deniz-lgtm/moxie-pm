import { Property, Unit } from "@/types";

const APPFOLIO_BASE_URL = "https://mbtenants.appfolio.com/api/v2/reports";

interface AppfolioConfig {
  clientId: string;
  clientSecret: string;
  database: string;
  portfolioTag?: string;
}

function getConfig(): AppfolioConfig {
  return {
    clientId: process.env.APPFOLIO_CLIENT_ID || "",
    clientSecret: process.env.APPFOLIO_CLIENT_SECRET || "",
    database: process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com",
    portfolioTag: process.env.APPFOLIO_PORTFOLIO_TAG,
  };
}

function getAuthHeaders() {
  const config = getConfig();
  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };
}

export async function fetchProperties(): Promise<Property[]> {
  const config = getConfig();
  
  try {
    const url = new URL(`${APPFOLIO_BASE_URL}/property_directory.json`);
    url.searchParams.append("per_page", "100");
    
    // Filter by portfolio tag if specified
    if (config.portfolioTag) {
      url.searchParams.append("tags", config.portfolioTag);
    }

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Appfolio API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Appfolio data to our Property type
    return data.properties?.map((p: any) => ({
      id: p.id || p.property_id || String(Math.random()),
      name: p.name || "Unnamed Property",
      address: p.street_address || "",
      city: p.city || "",
      state: p.state || "",
      zip: p.zip || "",
      fullAddress: `${p.street_address}, ${p.city}, ${p.state} ${p.zip}`.trim(),
      description: p.description || "",
      amenities: p.amenities || [],
      photos: p.photos || [],
      minRent: p.min_rent || 0,
      maxRent: p.max_rent || 0,
      availableUnits: p.available_units || 0,
      totalUnits: p.total_units || 0,
    })) || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export async function fetchProperty(id: string): Promise<Property | null> {
  try {
    const properties = await fetchProperties();
    return properties.find((p) => p.id === id) || null;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export async function fetchAvailableUnits(): Promise<Unit[]> {
  const config = getConfig();
  
  try {
    // Fetch unit directory from Appfolio
    const url = new URL(`${APPFOLIO_BASE_URL}/unit_directory.json`);
    url.searchParams.append("per_page", "100");
    url.searchParams.append("available", "true");

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Appfolio API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform to our Unit type
    const units = data.units?.map((u: any) => ({
      id: u.id || u.unit_id || String(Math.random()),
      propertyId: u.property_id || "",
      propertyName: u.property_name || "",
      unitNumber: u.unit_number || "",
      beds: u.bedrooms || 0,
      baths: u.bathrooms || 0,
      sqft: u.square_feet || 0,
      rent: u.market_rent || u.rent || 0,
      availableDate: u.available_date || null,
      availableNow: !u.available_date || new Date(u.available_date) <= new Date(),
      photos: u.photos || [],
      address: u.property_address || "",
    })) || [];

    // Filter by portfolio if specified
    if (config.portfolioTag) {
      // Note: This assumes Appfolio returns portfolio/tag info
      // May need adjustment based on actual API response
      return units.filter((u: Unit) => {
        // Filter logic will depend on API response structure
        return true; // Placeholder - implement based on actual data
      });
    }

    return units;
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
}

export async function fetchPropertyUnits(propertyId: string): Promise<Unit[]> {
  try {
    const units = await fetchAvailableUnits();
    return units.filter((u) => u.propertyId === propertyId);
  } catch (error) {
    console.error("Error fetching property units:", error);
    return [];
  }
}
