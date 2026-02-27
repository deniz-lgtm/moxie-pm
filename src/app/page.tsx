import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

const featuredProperties = [
  {
    name: "The Vermont",
    neighborhood: "University Park",
    address: "Near USC Campus",
    price: "$2,200",
    beds: "1-2",
    baths: "1",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    tag: "Popular",
  },
  {
    name: "The Wilshire",
    neighborhood: "Mid-Wilshire",
    address: "Wilshire Corridor",
    price: "$2,800",
    beds: "1-3",
    baths: "1-2",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    tag: "Newly Renovated",
  },
  {
    name: "The Adams",
    neighborhood: "West Adams",
    address: "Historic West Adams",
    price: "$2,500",
    beds: "2-3",
    baths: "1-2",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    tag: "Available Now",
  },
];

const neighborhoods = [
  {
    name: "University Park",
    description: "Steps from USC",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mid-Wilshire",
    description: "Heart of LA",
    image:
      "https://images.unsplash.com/photo-1515896769750-31548aa180ed?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Koreatown",
    description: "Vibrant & Connected",
    image:
      "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "West Adams",
    description: "Historic Charm",
    image:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80",
  },
];

export default function HomePage() {
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
              Curated apartments in LA&apos;s most sought-after neighborhoods.
              Professionally managed. Beautifully maintained. Unmistakably Los
              Angeles.
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
            {featuredProperties.map((property, i) => (
              <Link
                key={i}
                href={`/properties/${i + 1}`}
                className="group cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        {property.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                          {property.name}
                        </h3>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {property.neighborhood} &middot; {property.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
                      <span className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4" />
                        {property.beds} Bed
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4" />
                        {property.baths} Bath
                      </span>
                      <span className="ml-auto font-bold text-lg text-slate-900">
                        From {property.price}
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

      {/* Neighborhoods Section */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-medium tracking-widest uppercase text-sm mb-2">
              Neighborhoods
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Prime LA Locations
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Our properties are in the neighborhoods you want to live in —
              close to dining, culture, transit, and everything LA has to offer.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {neighborhoods.map((hood, i) => (
              <Link
                key={i}
                href="/properties"
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={hood.image}
                  alt={hood.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg">{hood.name}</h3>
                  <p className="text-white/70 text-sm">{hood.description}</p>
                </div>
              </Link>
            ))}
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
                      "Every property is well-maintained with regular upgrades and professional upkeep.",
                  },
                  {
                    icon: Clock,
                    title: "24-Hour Response",
                    description:
                      "Maintenance issues don't wait, and neither do we. Fast, reliable service around the clock.",
                  },
                  {
                    icon: Star,
                    title: "Curated Living",
                    description:
                      "We hand-select our properties in LA's best neighborhoods for location, quality, and value.",
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

            {/* Image collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
                    alt="Modern apartment interior with natural light"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
                    alt="Bright living room with modern furnishings"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                    alt="Premium property exterior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=600&q=80"
                    alt="Beautiful apartment kitchen"
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
