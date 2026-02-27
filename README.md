# Moxie PM Website

LA Multifamily Property Management Website for Moxie Management.

**Live Site:** https://moxiepm.com

## Overview

This is the official website for Moxie Management's Los Angeles multifamily portfolio. 
It provides property listings, availability information, and tenant resources with live
Appfolio integration.

## Features

- **Homepage** - Hero section, featured properties, company values, rental process
- **Properties** - Browse all properties with filtering (connected to Appfolio API)
- **Property Detail** - Individual property pages with photos, amenities, available units
- **Availability** - Real-time unit availability across all properties (Appfolio API)
- **About/Contact** - Company story, contact form, office information

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **API:** Appfolio Reports API v2
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Appfolio API credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/deniz-lgtm/moxie-pm.git
cd moxie-pm

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Appfolio credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

## Appfolio Integration

The site connects to Appfolio's Reports API v2 to fetch live property and unit data.

### Configuration

Create `.env.local` file:

```env
# Appfolio API
APPFOLIO_CLIENT_ID=your_client_id_here
APPFOLIO_CLIENT_SECRET=your_client_secret_here
APPFOLIO_DATABASE=mbtenants.appfolio.com
APPFOLIO_PORTFOLIO_TAG=Moxie PM

# Site
NEXT_PUBLIC_SITE_URL=https://moxiepm.com
```

### How It Works

1. **Properties Page** - Fetches from `/property_directory.json` endpoint
2. **Availability Page** - Fetches from `/unit_directory.json` endpoint (filtered for available units)
3. **Caching** - Data is cached with Next.js ISR:
   - Properties: 1 hour revalidation
   - Units: 30 minutes revalidation
4. **Fallback** - If API fails, site shows mock data (for development)

### Appfolio Setup

1. In Appfolio, tag properties with "Moxie PM" to include them
2. Ensure photos and descriptions are up to date
3. Mark units as available with dates in Appfolio

## Project Structure

```
moxie-pm/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Homepage
│   │   ├── properties/   # Property listings & detail pages
│   │   ├── availability/ # Available units page
│   │   ├── about/        # About & contact page
│   │   └── apply/        # Application form
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   ├── lib/              # Utilities
│   │   ├── appfolio.ts   # Appfolio API client
│   │   └── utils.ts
│   └── types/            # TypeScript types
│       └── index.ts      # Property, Unit types
├── public/               # Static assets
└── package.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APPFOLIO_CLIENT_ID` | Appfolio API Client ID | Yes |
| `APPFOLIO_CLIENT_SECRET` | Appfolio API Client Secret | Yes |
| `APPFOLIO_DATABASE` | Appfolio database (e.g., mbtenants.appfolio.com) | Yes |
| `APPFOLIO_PORTFOLIO_TAG` | Tag to filter properties (e.g., "Moxie PM") | No |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | No |

## Deployment

This site is deployed on Vercel. Push to main branch to trigger deployment.

### Adding Environment Variables in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add each variable from `.env.local`
3. Redeploy

```bash
# Deploy manually
vercel --prod
```

## Roadmap

### Phase 1 (Current)
- [x] Basic site structure
- [x] All core pages
- [x] Appfolio API integration
- [ ] Property photos from Appfolio
- [ ] Contact form backend

### Phase 2
- [ ] AI chatbot for tenant inquiries
- [ ] Online application processing
- [ ] Tenant portal integration
- [ ] Map view of properties
- [ ] Search/filter enhancements

## API Reference

### Appfolio Endpoints Used

```
GET /api/v2/reports/property_directory.json
  - Returns all properties in portfolio
  
GET /api/v2/reports/unit_directory.json?available=true
  - Returns available units
```

See `src/lib/appfolio.ts` for implementation details.

## Troubleshooting

### API Connection Issues

1. Verify credentials in `.env.local`
2. Check Appfolio API access is enabled
3. Ensure database name is correct
4. Check Vercel logs for specific errors

### Data Not Updating

- Data is cached (1 hour for properties, 30 min for units)
- Use Vercel's "Redeploy" to force refresh
- Or adjust revalidation times in `src/lib/appfolio.ts`

## Related Projects

- **moxieusc.com** - USC Student Housing
- **flexbay.co** - Small-bay Industrial Platform

## License

Proprietary - Moxie Management

## Contact

For questions about this project:
- Email: info@moxiepm.com
- Phone: 310-362-8105
