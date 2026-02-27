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
  const tag = process.env.APPFOLIO_PORTFOLIO_TAG || "Moxie PM";

  const results: Record<string, unknown> = {};

  // Test v1 property directory with portfolio tag
  try {
    const url = `https://${database}/api/v1/reports/property_directory.json?per_page=5&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      results["v1_property_directory"] = {
        status: 200,
        totalResults: data.results?.length,
        keys: data.results?.[0] ? Object.keys(data.results[0]) : [],
        firstTwo: data.results?.slice(0, 2),
      };
    } else {
      results["v1_property_directory"] = { status: res.status };
    }
  } catch (e) {
    results["v1_property_directory"] = { error: String(e) };
  }

  // Test v1 property directory with tag filter
  try {
    const url = `https://${database}/api/v1/reports/property_directory.json?per_page=5&paginate_results=true&filter_PropertyTag=${encodeURIComponent(tag)}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      results["v1_property_with_tag"] = {
        status: 200,
        totalResults: data.results?.length,
        firstTwo: data.results?.slice(0, 2),
      };
    } else {
      results["v1_property_with_tag"] = { status: res.status, text: await res.text().then(t => t.slice(0, 500)) };
    }
  } catch (e) {
    results["v1_property_with_tag"] = { error: String(e) };
  }

  // Test v1 vacant units
  try {
    const url = `https://${database}/api/v1/reports/vacant_units.json?per_page=5&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      results["v1_vacant_units"] = {
        status: 200,
        totalResults: data.results?.length,
        keys: data.results?.[0] ? Object.keys(data.results[0]) : [],
        firstTwo: data.results?.slice(0, 2),
      };
    } else {
      const text = await res.text();
      results["v1_vacant_units"] = { status: res.status, body: text.slice(0, 500) };
    }
  } catch (e) {
    results["v1_vacant_units"] = { error: String(e) };
  }

  // Test v1 availability (alternative name)
  try {
    const url = `https://${database}/api/v1/reports/availability.json?per_page=5&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      results["v1_availability"] = {
        status: 200,
        totalResults: data.results?.length,
        keys: data.results?.[0] ? Object.keys(data.results[0]) : [],
        firstTwo: data.results?.slice(0, 2),
      };
    } else {
      results["v1_availability"] = { status: res.status };
    }
  } catch (e) {
    results["v1_availability"] = { error: String(e) };
  }

  return NextResponse.json({ tag, results }, { status: 200 });
}
