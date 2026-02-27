import { NextResponse } from "next/server";

export async function GET() {
  const database = process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com";
  const clientId = process.env.APPFOLIO_CLIENT_ID || "";
  const clientSecret = process.env.APPFOLIO_CLIENT_SECRET || "";
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  const results: Record<string, unknown> = {};

  // Get units posted to website (available listings)
  try {
    const url = `https://${database}/api/v1/reports/unit_directory.json?paginate_results=true&per_page=500`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    const allUnits = data.results || [];
    const posted = allUnits.filter((u: Record<string, any>) => u.PostedToWebsite === "Yes");
    results["posted_units"] = {
      totalUnits: allUnits.length,
      postedCount: posted.length,
      units: posted,
    };
  } catch (e) {
    results["posted_units"] = { error: String(e) };
  }

  // Get vacancy details from rent_roll for posted units
  try {
    const url = `https://${database}/api/v1/reports/rent_roll.json?paginate_results=true&per_page=500`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    const allUnits = data.results || [];
    const vacant = allUnits.filter((u: Record<string, any>) =>
      u.Status?.includes("Vacant") || u.Status?.includes("Notice-Unrented")
    );
    results["vacant_units"] = {
      totalUnits: allUnits.length,
      vacantCount: vacant.length,
      units: vacant.map((u: Record<string, any>) => ({
        PropertyName: u.PropertyName,
        PropertyAddress: u.PropertyAddress,
        Unit: u.Unit,
        Status: u.Status,
        BdBa: u.BdBa,
        MarketRent: u.MarketRent,
        AdvertisedRent: u.AdvertisedRent,
        SquareFt: u.SquareFt,
        MoveOut: u.MoveOut,
      })),
    };
  } catch (e) {
    results["vacant_units"] = { error: String(e) };
  }

  return NextResponse.json({ results }, { status: 200 });
}
