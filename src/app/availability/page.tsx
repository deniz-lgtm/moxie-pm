import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Bed, Bath, Calendar, Home } from "lucide-react";

export default function AvailabilityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Units</h1>
          <p className="text-slate-600 mb-6">
            Find your perfect home from our current availability across Los Angeles
          </p>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search by neighborhood or property..." />
            </div>
            <div className="flex gap-2 flex-wrap">
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
              <select className="px-4 py-2 border rounded-lg bg-white">
                <option>Move-in Date</option>
                <option>Immediate</option>
                <option>Within 30 days</option>
                <option>Within 60 days</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">Showing <span className="font-medium text-slate-900">12</span> available units</p>
          <select className="px-3 py-2 border rounded-lg bg-white text-sm">
            <option>Sort by: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Units Grid */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg border shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-48 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Home className="h-8 w-8" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">Unit {String.fromCharCode(64 + i)} - Property Name</h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        123 Main St, Los Angeles, CA
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-3">
                        <span className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {i % 3 + 1} Beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {i % 2 + 1} Baths
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Available {i % 2 === 0 ? "Now" : `Mar ${i * 5}`}
                        </span>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-slate-900">${2 + i * 0.3}00/mo</p>
                      <p className="text-sm text-slate-500">{700 + i * 100} sq ft</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 md:w-32">
                  <Button asChild className="flex-1 md:w-full">
                    <Link href="/apply">Apply</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 md:w-full">
                    <Link href={`/properties/${i}`}>Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-slate-100">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </section>
    </div>
  );
}
