import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Home, Bed, Bath } from "lucide-react";

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Our Properties</h1>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search by location or property name..." />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border rounded-lg bg-white">
                <option>All Bedrooms</option>
                <option>Studio</option>
                <option>1 Bedroom</option>
                <option>2 Bedrooms</option>
                <option>3+ Bedrooms</option>
              </select>
              <select className="px-4 py-2 border rounded-lg bg-white">
                <option>All Prices</option>
                <option>Under $2,000</option>
                <option>$2,000 - $3,000</option>
                <option>$3,000 - $4,000</option>
                <option>$4,000+</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Property Cards - Placeholders */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Link key={i} href={`/properties/${i}`} className="group">
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Home className="h-12 w-12" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                      Available
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    Property Name {i}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    Los Angeles, CA
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      2 Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      2 Baths
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-xs text-slate-500">Starting at</span>
                      <p className="font-bold text-lg">$2,500/mo</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg">Load More Properties</Button>
        </div>
      </section>
    </div>
  );
}
