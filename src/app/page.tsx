import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, MapPin, Home, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Quality Living in
              <span className="block text-blue-400">Los Angeles</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Discover well-maintained apartments in prime LA neighborhoods. 
              Professional management, responsive service, and places you'll love to call home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href="/availability">
                  View Available Units
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 hover:bg-white/10">
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Properties</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore our carefully curated selection of quality apartments across Los Angeles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Cards - Placeholder */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Home className="h-12 w-12" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">Property Name {i}</h3>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    Los Angeles, CA
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Beautiful apartment with modern amenities and great location.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">$2,500+/mo</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/properties">View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Moxie Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Moxie Management?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We're committed to providing exceptional living experiences through quality properties 
              and responsive management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Quality Properties",
                description: "Well-maintained apartments in desirable neighborhoods with modern amenities.",
              },
              {
                icon: Star,
                title: "Responsive Service",
                description: "Fast maintenance response and friendly staff dedicated to your satisfaction.",
              },
              {
                icon: MapPin,
                title: "Prime Locations",
                description: "Properties situated in vibrant LA neighborhoods close to dining, shopping, and transit.",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <feature.icon className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Rent Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Rent</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Finding your new home is easy with our streamlined process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Browse", desc: "Explore our available properties and find your perfect match." },
              { step: "2", title: "Schedule", desc: "Book a tour to see the property in person." },
              { step: "3", title: "Apply", desc: "Complete our simple online application process." },
              { step: "4", title: "Move In", desc: "Get approved and start enjoying your new home." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your New Home?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our available units and schedule a tour today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/availability">View Available Units</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
