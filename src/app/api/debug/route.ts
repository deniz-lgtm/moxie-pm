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

  results["config"] = {
    database,
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdPrefix: clientId.slice(0, 4),
  };

  // Raw fetch of rent_roll - show everything
  try {
    const url = `https://${database}/api/v1/reports/rent_roll.json?paginate_results=true&per_page=5&page=1`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const text = await res.text();
    results["rent_roll_raw"] = {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      bodyLength: text.length,
      bodyPreview: text.slice(0, 1000),
    };
  } catch (e) {
    results["rent_roll_raw"] = { error: String(e) };
  }

  // Raw fetch of property_directory - known working endpoint
  try {
    const url = `https://${database}/api/v1/reports/property_directory.json?paginate_results=true&per_page=2&page=1`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const text = await res.text();
    results["property_directory_raw"] = {
      status: res.status,
      bodyLength: text.length,
      bodyPreview: text.slice(0, 500),
    };
  } catch (e) {
    results["property_directory_raw"] = { error: String(e) };
  }

  return NextResponse.json({ results }, { status: 200 });
}
