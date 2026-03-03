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

async function fetchReport(reportName: string): Promise<Record<string, any>[]> {
  const url = `${getBaseUrl()}/${reportName}.json?paginate_results=true&per_page=500`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Appfolio API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

// Get the PortfolioId(s) that match the configured portfolio name.
// This allows filtering units/properties to only those in the target portfolio.
async function getPortfolioIds(): Promise<Set<number>> {
  const config = getConfig();
  if (!config.portfolioTag) return new Set();

  const properties = await fetchReport("property_directory");
  const ids = new Set<number>();

  for (const p of properties) {
    const portfolioName = String(p.Portfolio || "").trim();
    if (portfolioName === config.portfolioTag) {
      if (p.PortfolioId) ids.add(p.PortfolioId);
    }
  }

  return ids;
}

export async function fetchProperties(): Promise<Property[]> {
  if (!isConfigured()) return [];

  try {
    const results = await fetchReport("property_directory");
    const portfolioIds = await getPortfolioIds();

    // Filter by portfolio if configured
    const filtered = portfolioIds.size > 0
      ? results.filter((p: Record<string, any>) => portfolioIds.has(p.PortfolioId))
      : results;

    return filtered.map((p: Record<string, any>) => ({
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
    const portfolioIds = await getPortfolioIds();

    // Use unit_directory and filter for units posted to website (active listings)
    const units = await fetchReport("unit_directory");
    const postedUnits = units.filter((u: Record<string, any>) => {
      const isPosted = u.PostedToWebsite === "Yes";
      // Filter by portfolio if configured
      const inPortfolio = portfolioIds.size === 0 || portfolioIds.has(u.PortfolioId);
      return isPosted && inPortfolio;
    });

    // Also get rent_roll for vacancy status and BdBa info
    const rentRoll = await fetchReport("rent_roll");
    const rentRollByUnitId = new Map<number, Record<string, any>>();
    for (const r of rentRoll) {
      if (r.UnitId) rentRollByUnitId.set(r.UnitId, r);
    }

    return postedUnits.map((u: Record<string, any>) => {
      const rr = rentRollByUnitId.get(u.UnitId) || {};
      const { beds, baths } = parseBdBa(rr.BdBa || "");

      return {
        id: String(u.UnitId || Math.random()),
        listingId: u.RentableUid || "",
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
        marketingTitle: u.MarketingTitle || "",
        marketingDescription: u.MarketingDescription || "",
        amenities: u.UnitAmenities || "",
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
