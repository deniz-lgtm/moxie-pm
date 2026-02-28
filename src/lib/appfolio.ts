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

async function fetchReport(reportName: string, params?: Record<string, string>): Promise<Record<string, any>[]> {
  const url = new URL(`${getBaseUrl()}/${reportName}.json`);
  url.searchParams.append("paginate_results", "true");
  url.searchParams.append("per_page", "500");
  
  // Add portfolio tag filter if specified
  const config = getConfig();
  if (config.portfolioTag) {
    url.searchParams.append("tags", config.portfolioTag);
  }
  
  // Add any additional params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Appfolio API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

export async function fetchProperties(): Promise<Property[]> {
  if (!isConfigured()) return [];

  try {
    const results = await fetchReport("property_directory");

    return results.map((p: Record<string, any>) => ({
      id: String(p.PropertyId || Math.random()),
      name: p.PropertyName || "Unnamed Property",
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

function parseBdBa(bdba: string): { beds: number; baths: number } {
  if (!bdba) return { beds: 0, baths: 0 };
  const parts = bdba.split("/");
  return {
    beds: parseInt(parts[0], 10) || 0,
    baths: parseFloat(parts[1]) || 0,
  };
}

export async function fetchAvailableUnits(): Promise<Unit[]> {
  if (!isConfigured()) return [];

  try {
    // First, get the list of Moxie PM property IDs
    const moxieProperties = await fetchProperties();
    const moxiePropertyIds = new Set(moxieProperties.map(p => p.id));
    
    if (moxiePropertyIds.size === 0) {
      console.log("No Moxie PM properties found, returning empty units list");
      return [];
    }
    
    console.log(`Fetching units for ${moxiePropertyIds.size} Moxie PM properties`);

    // Use unit_directory and filter for units posted to website (active listings)
    const units = await fetchReport("unit_directory");
    
    // Filter to only include units from Moxie PM properties
    const moxieUnits = units.filter(
      (u: Record<string, any>) => {
        const propertyId = String(u.PropertyId || "");
        return moxiePropertyIds.has(propertyId) && u.PostedToWebsite === "Yes";
      }
    );

    // Also get rent_roll for vacancy status and BdBa info
    const rentRoll = await fetchReport("rent_roll");
    const rentRollByUnitId = new Map<number, Record<string, any>>();
    for (const r of rentRoll) {
      if (r.UnitId) rentRollByUnitId.set(r.UnitId, r);
    }

    console.log(`Found ${moxieUnits.length} available units in Moxie PM portfolio (out of ${units.length} total)`);

    return moxieUnits.map((u: Record<string, any>) => {
      const rr = rentRollByUnitId.get(u.UnitId) || {};
      const { beds, baths } = parseBdBa(rr.BdBa || "");

      return {
        id: String(u.UnitId || Math.random()),
        propertyId: String(u.PropertyId || ""),
        propertyName: u.PropertyName || "",
        unitNumber: u.UnitName || "",
        beds: parseInt(String(u.Bedrooms || "0"), 10) || beds,
        baths: parseFloat(String(u.Bathrooms || "0")) || baths,
        sqft: parseInt(String(u.SquareFt || "0").replace(/,/g, ""), 10) || 0,
        rent: parseFloat(String(u.MarketRent || u.AdvertisedRent || "0").replace(/[,$]/g, "")) || 0,
        availableDate: rr.MoveOut || null,
        availableNow: !rr.MoveOut || new Date(rr.MoveOut) <= new Date(),
        photos: [],
        address: u.UnitAddress || [u.UnitStreet1, u.UnitStreet2].filter(Boolean).join(" ") || "",
      };
    });
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

// Helper to check if a property is in the Moxie PM portfolio
export async function isMoxieProperty(propertyId: string): Promise<boolean> {
  const config = getConfig();
  if (!config.portfolioTag) return true; // No filtering if no tag set
  
  const properties = await fetchProperties();
  return properties.some(p => p.id === propertyId);
}
