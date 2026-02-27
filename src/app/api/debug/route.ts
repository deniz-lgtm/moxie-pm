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

  // Fetch ALL rent_roll entries and group by Status
  try {
    const allUnits: Record<string, any>[] = [];
    let page = 1;
    while (true) {
      const url = `https://${database}/api/v1/reports/rent_roll.json?paginate_results=true&per_page=200&page=${page}`;
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) break;
      const data = await res.json();
      const batch = data.results || [];
      allUnits.push(...batch);
      if (batch.length < 200) break;
      page++;
    }

    // Group by status
    const statusCounts: Record<string, number> = {};
    for (const u of allUnits) {
      const s = u.Status || "unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    }

    // Find vacant/notice units
    const vacantUnits = allUnits.filter(
      (u) => u.Status === "Vacant" || u.Status === "Notice" || u.Status === "Past"
    );

    results["rent_roll_summary"] = {
      total: allUnits.length,
      statusCounts,
      vacantCount: vacantUnits.length,
      vacantSample: vacantUnits.slice(0, 3),
    };
  } catch (e) {
    results["rent_roll_summary"] = { error: String(e) };
  }

  // Find units posted to website from unit_directory
  try {
    const allUnits: Record<string, any>[] = [];
    let page = 1;
    while (true) {
      const url = `https://${database}/api/v1/reports/unit_directory.json?paginate_results=true&per_page=200&page=${page}`;
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) break;
      const data = await res.json();
      const batch = data.results || [];
      allUnits.push(...batch);
      if (batch.length < 200) break;
      page++;
    }

    const postedUnits = allUnits.filter((u) => u.PostedToWebsite === "Yes");

    results["unit_directory_summary"] = {
      total: allUnits.length,
      postedToWebsite: postedUnits.length,
      postedSample: postedUnits.slice(0, 5),
    };
  } catch (e) {
    results["unit_directory_summary"] = { error: String(e) };
  }

  return NextResponse.json({ results }, { status: 200 });
}
