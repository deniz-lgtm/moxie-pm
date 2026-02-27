import { Property, Unit } from "@/types";

interface AppfolioConfig {
  clientId: string;
  clientSecret: string;
  database: string;
  portfolioTag: string;
}

function getConfig(): AppfolioConfig {
  return {
    clientId: process.env.APPFOLIO_CLIENT_ID || "",
    clientSecret: process.env.APPFOLIO_CLIENT_SECRET || "",
    database: process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com",
    portfolioTag: process.env.APPFOLIO_PORTFOLIO_TAG || "Moxie PM",
  };
}

function isConfigured(): boolean {
  const config = getConfig();
  return Boolean(config.clientId && config.clientSecret);
}

function getBaseUrl(): string {
  const config = getConfig();
  return `https://${config.database}/api/v2/reports`;
}

function getAuthHeaders() {
  const config = getConfig();
  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`
  ).toString("base64");
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };
}

export async function fetchProperties(): Promise<Property[]> {
  if (!isConfigured()) return [];

  const config = getConfig();

  try {
    const url = new URL(`${getBaseUrl()}/property_directory.json`);
    url.searchParams.append("per_page", "100");

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
    const results = data.results || data.properties || [];

    return results.map((p: Record<string, any>) => ({
      id: p.Property_id || p.property_id || p.id || String(Math.random()),
      name: p.Property || p.name || "Unnamed Property",
      address: p.Address || p.street_address || "",
      city: p.City || p.city || "Los Angeles",
      state: p.State || p.state || "CA",
      zip: p.Zip || p.zip || "",
      fullAddress: [
        p.Address || p.street_address,
        p.City || p.city,
        `${p.State || p.state} ${p.Zip || p.zip}`,
      ]
        .filter(Boolean)
        .join(", "),
      description: p.Description || p.description || "",
      amenities: p.Amenities || p.amenities || [],
      photos: p.Photos || p.photos || [],
      minRent: Number(p.Min_rent || p.min_rent) || 0,
      maxRent: Number(p.Max_rent || p.max_rent) || 0,
      availableUnits: Number(p.Available_unit_count || p.available_units) || 0,
      totalUnits: Number(p.Unit_count || p.total_units) || 0,
    }));
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
  if (!isConfigured()) return [];

  try {
    const url = new URL(`${getBaseUrl()}/unit_directory.json`);
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
    const results = data.results || data.units || [];

    return results.map((u: Record<string, any>) => ({
      id: u.Unit_id || u.unit_id || u.id || String(Math.random()),
      propertyId: u.Property_id || u.property_id || "",
      propertyName: u.Property || u.property_name || "",
      unitNumber: u.Unit_number || u.unit_number || "",
      beds: Number(u.Bedrooms || u.bedrooms) || 0,
      baths: Number(u.Bathrooms || u.bathrooms) || 0,
      sqft: Number(u.Square_feet || u.square_feet) || 0,
      rent: Number(u.Market_rent || u.market_rent || u.rent) || 0,
      availableDate: u.Available_date || u.available_date || null,
      availableNow:
        !u.Available_date && !u.available_date
          ? true
          : new Date(u.Available_date || u.available_date) <= new Date(),
      photos: u.Photos || u.photos || [],
      address: u.Address || u.property_address || "",
    }));
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
}

export async function fetchPropertyUnits(
  propertyId: string
): Promise<Unit[]> {
  try {
    const units = await fetchAvailableUnits();
    return units.filter((u) => u.propertyId === propertyId);
  } catch (error) {
    console.error("Error fetching property units:", error);
    return [];
  }
}
