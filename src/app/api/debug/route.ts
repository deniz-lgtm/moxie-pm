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

  // Test 1: exact format that worked before (no page param)
  try {
    const url = `https://${database}/api/v1/reports/property_directory.json?per_page=3&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    results["test1_no_page"] = {
      status: res.status,
      count: data.results?.length || 0,
      hasNextPage: !!data.next_page_url,
      nextPageUrl: data.next_page_url,
      firstName: data.results?.[0]?.PropertyName || null,
    };
  } catch (e) {
    results["test1_no_page"] = { error: String(e) };
  }

  // Test 2: with page param
  try {
    const url = `https://${database}/api/v1/reports/property_directory.json?per_page=3&paginate_results=true&page=1`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    results["test2_with_page"] = {
      status: res.status,
      count: data.results?.length || 0,
    };
  } catch (e) {
    results["test2_with_page"] = { error: String(e) };
  }

  // Test 3: without pagination
  try {
    const url = `https://${database}/api/v1/reports/property_directory.json`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    const items = data.results || [];
    results["test3_no_pagination"] = {
      status: res.status,
      count: items.length,
      firstName: items[0]?.PropertyName || null,
    };
  } catch (e) {
    results["test3_no_pagination"] = { error: String(e) };
  }

  // Test 4: rent_roll without pagination
  try {
    const url = `https://${database}/api/v1/reports/rent_roll.json?per_page=5&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    const items = data.results || [];
    const statuses = items.map((u: Record<string, any>) => u.Status);
    results["test4_rent_roll"] = {
      status: res.status,
      count: items.length,
      statuses,
      firstUnit: items[0]?.Unit || null,
    };
  } catch (e) {
    results["test4_rent_roll"] = { error: String(e) };
  }

  // Test 5: unit_directory
  try {
    const url = `https://${database}/api/v1/reports/unit_directory.json?per_page=5&paginate_results=true`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    const items = data.results || [];
    results["test5_unit_directory"] = {
      status: res.status,
      count: items.length,
      postedFlags: items.map((u: Record<string, any>) => u.PostedToWebsite),
      firstUnit: items[0]?.UnitName || null,
    };
  } catch (e) {
    results["test5_unit_directory"] = { error: String(e) };
  }

  return NextResponse.json({ results }, { status: 200 });
}
