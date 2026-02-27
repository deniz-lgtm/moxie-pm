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
  return `https://${config.database}/api/v1/reports`;
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

async function fetchAllPages(baseUrl: string): Promise<Record<string, any>[]> {
  const headers = getAuthHeaders();
  const allResults: Record<string, any>[] = [];
  let page = 1;

  while (true) {
    const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}paginate_results=true&per_page=200&page=${page}`;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (allResults.length > 0) break;
      throw new Error(`Appfolio API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];
    allResults.push(...results);

    if (results.length < 200) break;
    page++;
  }

  return allResults;
}

export async function fetchProperties(): Promise<Property[]> {
  if (!isConfigured()) return [];

  try {
    const results = await fetchAllPages(
      `${getBaseUrl()}/property_directory.json`
    );

    return results.map((p: Record<string, any>) => ({
      id: String(p.PropertyId || p.Property_id || Math.random()),
      name: p.PropertyName || p.Property || "Unnamed Property",
      address: p.PropertyAddress || [p.PropertyStreet1, p.PropertyStreet2].filter(Boolean).join(" ") || "",
      city: p.PropertyCity || "Los Angeles",
      state: p.PropertyState || "CA",
      zip: p.PropertyZip || "",
      fullAddress: p.PropertyAddress || [
        [p.PropertyStreet1, p.PropertyStreet2].filter(Boolean).join(" "),
        p.PropertyCity,
        `${p.PropertyState || "CA"} ${p.PropertyZip || ""}`,
      ].filter(Boolean).join(", "),
      description: p.Description || "",
      amenities: p.Amenities ? String(p.Amenities).split(",").map((s: string) => s.trim()) : [],
      photos: [],
      minRent: parseFloat(String(p.MarketRent || "0").replace(/[,$]/g, "")) || 0,
      maxRent: parseFloat(String(p.MarketRent || "0").replace(/[,$]/g, "")) || 0,
      availableUnits: 0,
      totalUnits: parseInt(String(p.Units || "0").replace(/,/g, ""), 10) || 0,
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
    // Use rent_roll report and filter for vacant units
    const results = await fetchAllPages(
      `${getBaseUrl()}/rent_roll.json`
    );

    // Filter for vacant units (where tenant is empty or status indicates vacancy)
    const vacantUnits = results.filter((u: Record<string, any>) => {
      const status = String(u.Status || u.OccupancyStatus || "").toLowerCase();
      const tenant = String(u.Tenant || u.TenantName || "").trim();
      return (
        status.includes("vacant") ||
        status.includes("available") ||
        tenant === "" ||
        tenant === "Vacant"
      );
    });

    return vacantUnits.map((u: Record<string, any>) => ({
      id: String(u.UnitId || u.Unit_id || Math.random()),
      propertyId: String(u.PropertyId || u.Property_id || ""),
      propertyName: u.PropertyName || u.Property || "",
      unitNumber: u.UnitName || u.Unit || u.UnitNumber || "",
      beds: parseInt(String(u.Bedrooms || u.Beds || "0"), 10) || 0,
      baths: parseFloat(String(u.Bathrooms || u.Baths || "0")) || 0,
      sqft: parseInt(String(u.SqFt || u.SquareFeet || "0").replace(/,/g, ""), 10) || 0,
      rent: parseFloat(String(u.MarketRent || u.Rent || u.ActualRent || "0").replace(/[,$]/g, "")) || 0,
      availableDate: u.AvailableDate || u.MoveOutDate || null,
      availableNow: true,
      photos: [],
      address: u.PropertyAddress || [u.PropertyStreet1, u.PropertyStreet2].filter(Boolean).join(" ") || "",
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
