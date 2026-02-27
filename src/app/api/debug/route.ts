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

  // Fetch first 50 rent_roll entries to see status values
  try {
    const url = `https://${database}/api/v1/reports/rent_roll.json?paginate_results=true&per_page=50&page=1`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const units = data.results || [];
      const statusCounts: Record<string, number> = {};
      for (const u of units) {
        const s = u.Status || "unknown";
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      }
      const nonCurrent = units.filter((u: Record<string, any>) => u.Status !== "Current");
      results["rent_roll"] = {
        total: units.length,
        statusCounts,
        nonCurrentCount: nonCurrent.length,
        nonCurrentSample: nonCurrent.slice(0, 3),
      };
    } else {
      results["rent_roll"] = { status: res.status, body: await res.text().then(t => t.slice(0, 300)) };
    }
  } catch (e) {
    results["rent_roll"] = { error: String(e) };
  }

  // Fetch first 50 unit_directory entries to check PostedToWebsite
  try {
    const url = `https://${database}/api/v1/reports/unit_directory.json?paginate_results=true&per_page=50&page=1`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const units = data.results || [];
      const posted = units.filter((u: Record<string, any>) => u.PostedToWebsite === "Yes");
      results["unit_directory"] = {
        total: units.length,
        postedCount: posted.length,
        postedSample: posted.slice(0, 3),
      };
    } else {
      results["unit_directory"] = { status: res.status };
    }
  } catch (e) {
    results["unit_directory"] = { error: String(e) };
  }

  // Try fetching pages 3-5 of rent_roll (later pages more likely to have vacant residential units)
  try {
    const url = `https://${database}/api/v1/reports/rent_roll.json?paginate_results=true&per_page=50&page=5`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const units = data.results || [];
      const statusCounts: Record<string, number> = {};
      for (const u of units) {
        const s = u.Status || "unknown";
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      }
      const nonCurrent = units.filter((u: Record<string, any>) => u.Status !== "Current");
      results["rent_roll_page5"] = {
        total: units.length,
        statusCounts,
        nonCurrentSample: nonCurrent.slice(0, 3),
      };
    } else {
      results["rent_roll_page5"] = { status: res.status };
    }
  } catch (e) {
    results["rent_roll_page5"] = { error: String(e) };
  }

  return NextResponse.json({ results }, { status: 200 });
}
