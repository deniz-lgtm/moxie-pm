import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchAvailableUnits } from "@/lib/appfolio";
import { Unit } from "@/types";
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

// Photo lookup by RentableUid (listingId) — scraped from Appfolio listing pages
const photosByListingId: Record<string, string> = {
  // 2714 Portland St - Oasis at the ROW
  "9be44f86-b345-4126-aa5f-e3bf34813968":
    "https://images.cdn.appfolio.com/mbtenants/images/3920c0d6-4837-43f0-bb16-796e73aca7c6/large.jpg",
  // 2728 Ellendale Place Unit 5 - Trojan House
  "c1f56d1f-e834-44f6-917d-bd146e3242a3":
    "https://images.cdn.appfolio.com/mbtenants/images/b3a002b5-8fb0-461f-baaf-368818b08360/large.jpg",
  // 707 W 23rd St
  "ec5d5e7e-c6f1-4c71-80ff-e4d1befdfa52":
    "https://images.cdn.appfolio.com/mbtenants/images/c3685716-2b78-4347-88e4-dad7ee8d60ff/large.jpg",
  // 909 W 30th St Unit 2
  "2733c98c-c839-49f8-a00a-fa4d7d1a739d":
    "https://images.cdn.appfolio.com/mbtenants/images/6168a921-b217-41f6-a275-760a92c91111/large.jpg",
  // 1121 28th St - The Hidden Gem
  "6f5eb389-dac9-4fa2-b3eb-45909c5c82e5":
    "https://images.cdn.appfolio.com/mbtenants/images/cca84c0e-ab19-4982-9518-711b70f41c44/large.jpg",
  // 2670 Ellendale Pl - Oasis West
  "4ae0fc0d-81b2-4e81-984d-60c14cff77ca":
    "https://images.cdn.appfolio.com/mbtenants/images/dc4338e1-3ad5-4a75-b1c9-f798907d1c08/large.jpg",
  // 643 W 30th St Unit 1
  "10f90bc9-aa70-4f7f-92e9-6b9d2ad04b60":
    "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/540ec344-c4bc-47c1-8906-3cbed09992c0/original.jpg",
  // 2801 Orchard Ave Unit 10
  "f2f2cdce-6826-43fe-aaac-0e1d7a41c35e":
    "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/846952bd-d01c-4928-87eb-bdedfb65c0c4/original.jpg",
  // 1137 W 29th St Unit 5 - Sunshine Shack
  "e54032b3-bf92-4321-a620-a8c760f460ad":
    "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/9966fd0f-ab3a-4f99-88f9-90d9d21bdbbb/original.jpg",
  // 2801 Orchard Ave Unit 2
  "8bebc4ab-3241-4583-bb11-6130b220ad00":
    "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/846952bd-d01c-4928-87eb-bdedfb65c0c4/original.jpg",
  // 643 W 30th St Unit 17
  "19f0d7dd-4a13-49f9-9d42-4674cfd14fca":
    "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/540ec344-c4bc-47c1-8906-3cbed09992c0/original.jpg",
  // 1013 W 24th St
  "0f957893-75f1-4580-a41a-7b4c59d11231":
    "https://images.cdn.appfolio.com/mbtenants/images/c3685716-2b78-4347-88e4-dad7ee8d60ff/large.jpg",
  // 1118 3/4 W 30th St - Hula House
  "4f94d3a6-895a-4a99-9a62-493e61a973cb":
    "https://images.cdn.appfolio.com/mbtenants/images/6168a921-b217-41f6-a275-760a92c91111/large.jpg",
  // 1173 W 29th St Unit 1
  "4766c2c1-699f-4947-a854-cd50179bc4b3":
    "https://images.cdn.appfolio.com/mbtenants/leads_marketing_photos/9966fd0f-ab3a-4f99-88f9-90d9d21bdbbb/original.jpg",
  // 2728 Ellendale Place Unit 9 - Trojan House
  "02400e78-0362-4bd5-bde5-12e5c21561f6":
    "https://images.cdn.appfolio.com/mbtenants/images/b3a002b5-8fb0-461f-baaf-368818b08360/large.jpg",
};

const defaultPhoto =
  "https://images.cdn.appfolio.com/mbtenants/images/3920c0d6-4837-43f0-bb16-796e73aca7c6/large.jpg";

function getPhoto(unit: Unit): string {
  return photosByListingId[unit.listingId] || defaultPhoto;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Now";
  const d = new Date(dateStr);
  if (d <= new Date()) return "Now";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAddress(addr: string): string {
  // Remove city/state/zip suffix for display
  return addr.replace(/\s+(Los Angeles|LA),?\s*CA\s*\d*/i, "").trim();
}

function getListingUrl(unit: Unit): string {
  if (unit.listingId) {
    return `https://mbtenants.appfolio.com/listings/detail/${unit.listingId}`;
  }
  return "https://mbtenants.appfolio.com/listings";
}

// Pick featured listings: highest rent first (premium properties)
function getFeatured(units: Unit[]): Unit[] {
  return [...units]
    .sort((a, b) => b.rent - a.rent)
    .slice(0, 3);
}

export default async function HomePage() {
  const apiUnits = await fetchAvailableUnits();

  const hasLiveData = apiUnits.length > 0;
  const featured = hasLiveData ? getFeatured(apiUnits) : [];
  const listings = hasLiveData ? apiUnits : [];
  const totalListings = listings.length;

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
                <Link href="https://mbtenants.appfolio.com/listings" target="_blank">
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
              { value: hasLiveData ? `${totalListings}` : "50+", label: hasLiveData ? "Units Available" : "Properties Managed" },
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
              href="https://mbtenants.appfolio.com/listings"
              target="_blank"
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 mt-4 md:mt-0"
            >
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((unit) => (
              <a
                key={unit.id}
                href={getListingUrl(unit)}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={getPhoto(unit)}
                      alt={formatAddress(unit.address)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        {unit.marketingTitle || `${unit.beds === 0 ? "Studio" : `${unit.beds} Bed`} | ${unit.baths} Bath`}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                        {formatAddress(unit.address)}
                      </h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {unit.propertyName}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                      {unit.marketingDescription || unit.amenities || "Premium LA living near USC"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
                      <span className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4" />
                        {unit.beds === 0 ? "Studio" : `${unit.beds} Bed`}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4" />
                        {unit.baths} Bath
                      </span>
                      {unit.sqft > 0 && (
                        <span className="text-xs text-slate-400">
                          {unit.sqft.toLocaleString()} sqft
                        </span>
                      )}
                      <span className="ml-auto font-bold text-lg text-slate-900">
                        ${unit.rent.toLocaleString()}
                        <span className="text-sm font-normal text-slate-500">
                          /mo
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
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
                {totalListings} units available across Los Angeles
              </p>
            </div>
            <Link
              href="https://mbtenants.appfolio.com/listings"
              target="_blank"
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 mt-4 md:mt-0"
            >
              See all availability
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((unit) => (
              <a
                key={unit.id}
                href={getListingUrl(unit)}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={getPhoto(unit)}
                      alt={formatAddress(unit.address)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {formatDate(unit.availableDate)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {formatAddress(unit.address)}
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      Los Angeles, CA
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" />
                          {unit.beds === 0 ? "Studio" : `${unit.beds} Bd`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" />
                          {unit.baths} Ba
                        </span>
                        {unit.sqft > 0 && (
                          <span className="text-xs text-slate-400">
                            {unit.sqft.toLocaleString()} sf
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">
                        ${unit.rent.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500">
                          /mo
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8"
            >
              <Link
                href="https://mbtenants.appfolio.com/listings"
                target="_blank"
              >
                View All Listings
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
              <Link href="https://mbtenants.appfolio.com/listings" target="_blank">
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
