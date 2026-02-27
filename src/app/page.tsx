import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchProperties, fetchAvailableUnits } from "@/lib/appfolio";
import { Property, Unit } from "@/types";
import {
  ArrowRight,
  Shield,
  Star,
  Clock,
  MapPin,
  Bed,
  Bath,
  Phone,
} from "lucide-react";

// Revalidate every hour so listings stay fresh
export const revalidate = 3600;

// Fallback data when API is not configured
const fallbackProperties = [
  {
    id: "9be44f86-b345-4126-aa5f-e3bf34813968",
    address: "2714 Portland St",
    city: "Los Angeles",
    beds: "3",
    baths: "3",
    sqft: 955,
    price: "$5,595",
    image:
      "https://images.cdn.appfolio.com/mbtenants/images/3920c0d6-4837-43f0-bb16-796e73aca7c6/large.jpg",
    tag: "Furnished",
    description:
      "Premium furnished apartments with private patio, gated parking, and surveillance.",
  },
  {
    id: "c1f56d1f-e834-44f6-917d-bd146e3242a3",
    address: "2728 Ellendale Pl",
    city: "Los Angeles",
    beds: "3",
    baths: "2",
    sqft: 0,
    price: "$4,150",
    image:
      "https://images.cdn.appfolio.com/mbtenants/images/b3a002b5-8fb0-461f-baaf-368818b08360/large.jpg",
    tag: "Tree-Lined Street",
    description:
      "Spacious apartments on a quiet, tree-lined street with wood flooring and modern kitchens.",
  },
  {
    id: "ec5d5e7e-c6f1-4c71-80ff-e4d1befdfa52",
    address: "707 W 23rd St",
    city: "Los Angeles",
    beds: "4",
    baths: "3.5",
    sqft: 2039,
    price: "$3,999",
    image:
      "https://images.cdn.appfolio.com/mbtenants/images/c3685716-2b78-4347-88e4-dad7ee8d60ff/large.jpg",
    tag: "Spacious",
    description:
      "Gated parking, in-unit laundry, keyless entry, and room A/C units near campus.",
  },
];

const fallbackUnits = [
  {
    address: "909 W 30th St",
    unit: "Unit 2",
    beds: "Studio",
    baths: "1",
    rent: "$1,995",
    available: "Aug 1",
    image:
      "https://images.cdn.appfolio.com/mbtenants/images/6168a921-b217-41f6-a275-760a92c91111/large.jpg",
  },
  {
    address: "1121 28th St",
    unit: "",
    beds: "4",
    baths: "4",
    rent: "$5,999",
    available: "Aug 15",
    image:
      "https://images.cdn.appfolio.com/mbtenants/images/cca84c0e-ab19-4982-9518-711b70f41c44/large.jpg",
  },
  {
    address: "2670 Ellendale Pl",
    unit: "",
    beds: "2 + Den",
    baths: "1",
    rent: "$3,350",
    available: "Aug 15",
    image:
      "https://images.cdn.appfolio.com/mbtenants/images/dc4338e1-3ad5-4a75-b1c9-f798907d1c08/large.jpg",
  },
  {
    address: "643 W 30th St",
    unit: "Unit 1",
    beds: "Studio",
    baths: "1",
    rent: "$1,895",
    available: "Aug 15",
    image:
      "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/540ec344-c4bc-47c1-8906-3cbed09992c0/original.jpg",
  },
  {
    address: "2801 Orchard Ave",
    unit: "Unit 10",
    beds: "2",
    baths: "1",
    rent: "$3,099",
    available: "Aug 15",
    image:
      "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/846952bd-d01c-4928-87eb-bdedfb65c0c4/original.jpg",
  },
  {
    address: "1137 W 29th St",
    unit: "Unit 5",
    beds: "1",
    baths: "1",
    rent: "$1,949",
    available: "Aug 15",
    image:
      "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/9966fd0f-ab3a-4f99-88f9-90d9d21bdbbb/original.jpg",
  },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Now";
  const d = new Date(dateStr);
  if (d <= new Date()) return "Now";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function mapPropertiesToCards(properties: Property[]) {
  return properties.slice(0, 3).map((p) => ({
    id: p.id,
    address: p.address,
    city: p.city || "Los Angeles",
    beds: String(p.totalUnits > 0 ? `1-${Math.min(p.totalUnits, 4)}` : "1+"),
    baths: "1+",
    sqft: 0,
    price: p.minRent > 0 ? `$${p.minRent.toLocaleString()}` : "Call",
    image: p.photos?.[0] || fallbackProperties[0].image,
    tag: p.availableUnits > 0 ? `${p.availableUnits} Available` : "Leasing",
    description: p.description || p.name,
  }));
}

function mapUnitsToCards(units: Unit[]) {
  return units.slice(0, 6).map((u) => ({
    address: u.address || u.propertyName,
    unit: u.unitNumber ? `Unit ${u.unitNumber}` : "",
    beds: u.beds === 0 ? "Studio" : String(u.beds),
    baths: String(u.baths),
    rent: u.rent > 0 ? `$${u.rent.toLocaleString()}` : "Call",
    available: formatDate(u.availableDate),
    image: u.photos?.[0] || fallbackUnits[0].image,
  }));
}

export default async function HomePage() {
  // Fetch live data from Appfolio API (filtered by "Moxie PM" portfolio tag)
  const [apiProperties, apiUnits] = await Promise.all([
    fetchProperties(),
    fetchAvailableUnits(),
  ]);

  // Use API data if available, otherwise fall back to hardcoded listings
  const properties =
    apiProperties.length > 0
      ? mapPropertiesToCards(apiProperties)
      : fallbackProperties;
  const units =
    apiUnits.length > 0 ? mapUnitsToCards(apiUnits) : fallbackUnits;
  const totalUnits =
    apiUnits.length > 0 ? apiUnits.length : fallbackUnits.length;
  const isLive = apiProperties.length > 0 || apiUnits.length > 0;

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full Viewport */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=2000&q=80"
            alt="Los Angeles skyline at golden hour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <p className="text-amber-400 font-medium tracking-widest uppercase text-sm mb-4">
              Premium Los Angeles Living
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
              Live Where
              <span className="block text-amber-400">LA Comes Alive</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-lg leading-relaxed">
              Curated apartments near USC and across Los Angeles. Professionally
              managed. Beautifully maintained. Unmistakably Los Angeles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 h-12"
              >
                <Link href="/availability">
                  View Available Units
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8"
              >
                <Link href="/properties">Explore Properties</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-950 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { value: "50+", label: "Properties Managed" },
              { value: "1,200+", label: "Happy Residents" },
              { value: "7+", label: "Years in LA" },
              { value: "24hr", label: "Maintenance Response" },
            ].map((stat, i) => (
              <div key={i} className="py-6 md:py-8 text-center">
                <p className="text-2xl md:text-3xl font-bold text-amber-400">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-amber-600 font-medium tracking-widest uppercase text-sm mb-2">
                Featured
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Our Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 mt-4 md:mt-0"
            >
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={
                  isLive
                    ? `/properties/${property.id}`
                    : `https://mbtenants.appfolio.com/listings/detail/${property.id}`
                }
                target={isLive ? undefined : "_blank"}
                className="group cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        {property.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                        {property.address}
                      </h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {property.city}, CA
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
                      <span className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4" />
                        {property.beds} Bed
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4" />
                        {property.baths} Bath
                      </span>
                      {property.sqft > 0 && (
                        <span className="text-xs text-slate-400">
                          {property.sqft.toLocaleString()} sqft
                        </span>
                      )}
                      <span className="ml-auto font-bold text-lg text-slate-900">
                        {property.price}
                        <span className="text-sm font-normal text-slate-500">
                          /mo
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Available Now */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-amber-600 font-medium tracking-widest uppercase text-sm mb-2">
                Available Now
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Current Listings
              </h2>
              <p className="text-slate-600">
                {totalUnits}+ units available across Los Angeles
              </p>
            </div>
            <Link
              href={
                isLive
                  ? "/availability"
                  : "https://mbtenants.appfolio.com/listings"
              }
              target={isLive ? undefined : "_blank"}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 mt-4 md:mt-0"
            >
              See all availability
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((listing, i) => (
              <Link
                key={i}
                href={
                  isLive
                    ? "/availability"
                    : "https://mbtenants.appfolio.com/listings"
                }
                target={isLive ? undefined : "_blank"}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {listing.available}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {listing.address}
                      {listing.unit ? ` - ${listing.unit}` : ""}
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      Los Angeles, CA
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" />
                          {listing.beds} Bd
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" />
                          {listing.baths} Ba
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {listing.rent}
                        <span className="text-xs font-normal text-slate-500">
                          /mo
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8"
            >
              <Link
                href={
                  isLive
                    ? "/availability"
                    : "https://mbtenants.appfolio.com/listings"
                }
                target={isLive ? undefined : "_blank"}
              >
                View All {totalUnits}+ Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Moxie Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-600 font-medium tracking-widest uppercase text-sm mb-2">
                The Moxie Difference
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Property management
                <span className="block text-amber-700">done right.</span>
              </h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                We&apos;re not a faceless corporation. We&apos;re a team of LA
                locals who care about the homes we manage and the people who
                live in them.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: Shield,
                    title: "Quality You Can Trust",
                    description:
                      "Every property is well-maintained with regular upgrades, gated entry, and surveillance cameras.",
                  },
                  {
                    icon: Clock,
                    title: "24-Hour Response",
                    description:
                      "Maintenance issues don't wait, and neither do we. Fast, reliable service around the clock.",
                  },
                  {
                    icon: Star,
                    title: "Near Campus Living",
                    description:
                      "Properties steps from USC and across LA — furnished options, in-unit laundry, and pet-friendly.",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo collage with actual Appfolio property photos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/627485f5-1b39-446f-8b17-3ca9fa940297/original.jpg"
                    alt="Portland Street furnished interior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/217e5f2b-54b5-412c-995d-e3186cb3127c/original.jpg"
                    alt="Ellendale Place apartment interior"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.cdn.appfolio.com/mbtenants/images/0c2f9757-e246-49fc-8b80-e5e52e67de10/large.jpg"
                    alt="Portland Street property exterior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/8cce85fb-2ead-4d05-abac-55cfb3630329/original.jpg"
                    alt="W 23rd Street interior"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-amber-400 font-medium tracking-widest uppercase text-sm mb-2">
              Simple Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Move In With Ease
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From browsing to move-in, we make finding your LA home seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Browse",
                desc: "Explore our curated portfolio of available units across LA.",
              },
              {
                step: "02",
                title: "Tour",
                desc: "Schedule a private showing at your convenience.",
              },
              {
                step: "03",
                title: "Apply",
                desc: "Complete our streamlined online application in minutes.",
              },
              {
                step: "04",
                title: "Move In",
                desc: "Get approved and start enjoying your new home.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-amber-400/30 mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 md:py-36">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=2000&q=80"
            alt="Aerial view of Los Angeles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Your Place in LA
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Browse available units and schedule a tour today. Your next home is
            waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 h-12"
            >
              <Link href="/availability">
                View Available Units
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10 h-12 px-8"
            >
              <a href="tel:310-362-8105" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                310-362-8105
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
