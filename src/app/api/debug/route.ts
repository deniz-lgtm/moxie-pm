import { NextResponse } from "next/server";

export async function GET() {
  const database = process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com";
  const credentials = Buffer.from(
    `${process.env.APPFOLIO_CLIENT_ID}:${process.env.APPFOLIO_CLIENT_SECRET}`
  ).toString("base64");
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  const results: Record<string, unknown> = {};

  // Test v1 rent_roll (for vacancy data)
  try {
    const url = `https://${database}/api/v1/reports/rent_roll.json?per_page=10&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      results["v1_rent_roll"] = {
        status: 200,
        totalResults: data.results?.length,
        keys: data.results?.[0] ? Object.keys(data.results[0]) : [],
        firstTwo: data.results?.slice(0, 2),
      };
    } else {
      const text = await res.text();
      results["v1_rent_roll"] = { status: res.status, body: text.slice(0, 500) };
    }
  } catch (e) {
    results["v1_rent_roll"] = { error: String(e) };
  }

  // Test v1 listings endpoint (non-report)
  try {
    const url = `https://${database}/api/v1/listings.json?per_page=10`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results || data.listings || [];
      results["v1_listings"] = {
        status: 200,
        totalResults: items.length,
        keys: items[0] ? Object.keys(items[0]) : [],
        firstTwo: items.slice(0, 2),
      };
    } else {
      const text = await res.text();
      results["v1_listings"] = { status: res.status, body: text.slice(0, 500) };
    }
  } catch (e) {
    results["v1_listings"] = { error: String(e) };
  }

  // Test v2 listings endpoint
  try {
    const url = `https://${database}/api/v2/listings.json?per_page=10`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results || data.listings || [];
      results["v2_listings"] = {
        status: 200,
        totalResults: items.length,
        keys: items[0] ? Object.keys(items[0]) : [],
        firstTwo: items.slice(0, 2),
      };
    } else {
      const text = await res.text();
      results["v2_listings"] = { status: res.status, body: text.slice(0, 500) };
    }
  } catch (e) {
    results["v2_listings"] = { error: String(e) };
  }

  // Test v1 unit_directory (might exist)
  try {
    const url = `https://${database}/api/v1/reports/unit_directory.json?per_page=5&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      results["v1_unit_directory"] = {
        status: 200,
        totalResults: data.results?.length,
        keys: data.results?.[0] ? Object.keys(data.results[0]) : [],
        firstTwo: data.results?.slice(0, 2),
      };
    } else {
      results["v1_unit_directory"] = { status: res.status };
    }
  } catch (e) {
    results["v1_unit_directory"] = { error: String(e) };
  }

  return NextResponse.json({ results }, { status: 200 });
}
