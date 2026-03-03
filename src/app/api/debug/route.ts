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

  // Get all distinct Portfolio names and IDs from property_directory
  try {
    const url = `https://${database}/api/v1/reports/property_directory.json?paginate_results=true&per_page=500`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    const props = data.results || [];

    const portfolios = new Map<string, { count: number; ids: Set<number>; sampleProps: string[] }>();
    for (const p of props) {
      const name = String(p.Portfolio || "unknown").trim();
      const id = p.PortfolioId;
      if (!portfolios.has(name)) {
        portfolios.set(name, { count: 0, ids: new Set(), sampleProps: [] });
      }
      const entry = portfolios.get(name)!;
      entry.count++;
      if (id) entry.ids.add(id);
      if (entry.sampleProps.length < 3) {
        entry.sampleProps.push(`${p.PropertyName} (id:${p.PropertyId})`);
      }
    }

    results["portfolios"] = Object.fromEntries(
      [...portfolios.entries()].map(([name, data]) => [
        name,
        { count: data.count, portfolioIds: [...data.ids], sampleProperties: data.sampleProps },
      ])
    );
    results["totalProperties"] = props.length;
  } catch (e) {
    results["portfolios"] = { error: String(e) };
  }

  // Check distinct PortfolioIds in unit_directory for posted units
  try {
    const url = `https://${database}/api/v1/reports/unit_directory.json?paginate_results=true&per_page=500`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    const units = data.results || [];
    const posted = units.filter((u: Record<string, any>) => u.PostedToWebsite === "Yes");

    const portfolioIds = new Map<number, string[]>();
    for (const u of posted) {
      const id = u.PortfolioId;
      if (!portfolioIds.has(id)) portfolioIds.set(id, []);
      const arr = portfolioIds.get(id)!;
      if (arr.length < 3) arr.push(`${u.PropertyName} - ${u.UnitName}`);
    }

    results["postedUnits"] = {
      total: posted.length,
      byPortfolioId: Object.fromEntries(
        [...portfolioIds.entries()].map(([id, samples]) => [
          String(id),
          { count: portfolioIds.get(id)?.length || 0, samples },
        ])
      ),
    };
  } catch (e) {
    results["postedUnits"] = { error: String(e) };
  }

  return NextResponse.json({ results }, { status: 200 });
}
