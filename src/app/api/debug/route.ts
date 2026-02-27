import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    clientId: process.env.APPFOLIO_CLIENT_ID ? "SET" : "MISSING",
    clientSecret: process.env.APPFOLIO_CLIENT_SECRET ? "SET" : "MISSING",
    database: process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com",
    portfolioTag: process.env.APPFOLIO_PORTFOLIO_TAG || "NOT SET",
  };

  const database = process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com";
  const credentials = Buffer.from(
    `${process.env.APPFOLIO_CLIENT_ID}:${process.env.APPFOLIO_CLIENT_SECRET}`
  ).toString("base64");

  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  // Try multiple possible Appfolio API endpoints
  const endpoints = [
    `/api/v2/reports/property_directory.json?per_page=2`,
    `/api/v2/reports/rent_roll.json?per_page=2`,
    `/api/v2/reports/vacant_units.json?per_page=2`,
    `/api/v2/reports/unit_directory.json?per_page=2`,
    `/api/v2/reports/work_order.json?per_page=2`,
    `/api/v1/reports/property_directory.json?per_page=2`,
    `/api/v1/reports/vacant_units.json?per_page=2`,
  ];

  const results: Record<string, unknown> = {};

  for (const endpoint of endpoints) {
    const url = `https://${database}${endpoint}`;
    try {
      const response = await fetch(url, { headers, cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        results[endpoint] = {
          status: response.status,
          keys: Object.keys(data),
          preview: JSON.stringify(data).slice(0, 1500),
        };
      } else {
        results[endpoint] = {
          status: response.status,
          statusText: response.statusText,
        };
      }
    } catch (error) {
      results[endpoint] = {
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return NextResponse.json({ config, results }, { status: 200 });
}
