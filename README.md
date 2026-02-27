# Moxie PM Website

LA Multifamily Property Management Website for Moxie Management.

**Live Site:** https://moxiepm.com

## Overview

This is the official website for Moxie Management's Los Angeles multifamily portfolio. 
It provides property listings, availability information, and tenant resources.

## Features

- **Homepage** - Hero section, featured properties, company values, rental process
- **Properties** - Browse all properties with filtering
- **Property Detail** - Individual property pages with photos, amenities, available units
- **Availability** - Real-time unit availability across all properties
- **About/Contact** - Company story, contact form, office information

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/deniz-lgtm/moxie-pm.git
cd moxie-pm

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

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
│   └── lib/              # Utilities
├── public/               # Static assets
└── package.json
```

## Roadmap

### Phase 1 (Current)
- [x] Basic site structure
- [x] All core pages
- [ ] Appfolio API integration for live data
- [ ] Photo galleries
- [ ] Contact form backend

### Phase 2
- [ ] AI chatbot for tenant inquiries
- [ ] Online application processing
- [ ] Tenant portal integration
- [ ] Map view of properties

## Environment Variables

Create a `.env.local` file:

```env
# Appfolio API
APPFOLIO_CLIENT_ID=your_client_id
APPFOLIO_CLIENT_SECRET=your_client_secret
APPFOLIO_DATABASE=mbtenants.appfolio.com

# Contact Form
CONTACT_FORM_ENDPOINT=your_endpoint
```

## Deployment

This site is deployed on Vercel. Push to main branch to trigger deployment.

```bash
# Deploy manually
vercel --prod
```

## Related Projects

- **moxieusc.com** - USC Student Housing
- **flexbay.co** - Small-bay Industrial Platform

## License

Proprietary - Moxie Management

## Contact

For questions about this project, contact:
- Email: info@moxiepm.com
- Phone: 310-362-8105
