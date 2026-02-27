import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    clientId: process.env.APPFOLIO_CLIENT_ID ? "SET" : "MISSING",
    clientSecret: process.env.APPFOLIO_CLIENT_SECRET ? "SET" : "MISSING",
    database: process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com",
    portfolioTag: process.env.APPFOLIO_PORTFOLIO_TAG || "NOT SET",
  };

  const database = process.env.APPFOLIO_DATABASE || "mbtenants.appfolio.com";
  const baseUrl = `https://${database}/api/v2/reports`;

  let apiResult: Record<string, unknown> = {};

  if (config.clientId === "SET" && config.clientSecret === "SET") {
    const credentials = Buffer.from(
      `${process.env.APPFOLIO_CLIENT_ID}:${process.env.APPFOLIO_CLIENT_SECRET}`
    ).toString("base64");

    try {
      const url = new URL(`${baseUrl}/property_directory.json`);
      url.searchParams.append("per_page", "5");
      if (process.env.APPFOLIO_PORTFOLIO_TAG) {
        url.searchParams.append("tags", process.env.APPFOLIO_PORTFOLIO_TAG);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      apiResult = {
        status: response.status,
        statusText: response.statusText,
        url: url.toString().replace(/Basic .+/, "Basic [REDACTED]"),
        headers: Object.fromEntries(response.headers.entries()),
      };

      if (response.ok) {
        const data = await response.json();
        apiResult.dataKeys = Object.keys(data);
        apiResult.sampleData = JSON.stringify(data).slice(0, 2000);
      } else {
        const text = await response.text();
        apiResult.errorBody = text.slice(0, 1000);
      }
    } catch (error) {
      apiResult = {
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return NextResponse.json({ config, apiResult }, { status: 200 });
}
