import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Home, Bed, Bath } from "lucide-react";
import { fetchProperties } from "@/lib/appfolio";
import { Property } from "@/types";

// Mock data fallback
const mockProperties: Property[] = [
  {
    id: "1",
    name: "Sunset Gardens",
    address: "123 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    zip: "90026",
    fullAddress: "123 Sunset Blvd, Los Angeles, CA 90026",
    description: "Modern apartments in the heart of Echo Park with stunning views.",
    amenities: ["Pool", "Gym", "Parking", "Pet Friendly"],
    photos: [],
    minRent: 2200,
    maxRent: 3200,
    availableUnits: 3,
    totalUnits: 24,
  },
  {
    id: "2",
    name: "Highland Terrace",
    address: "456 Highland Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90028",
    fullAddress: "456 Highland Ave, Los Angeles, CA 90028",
    description: "Spacious units near Hollywood with easy freeway access.",
    amenities: ["Roof Deck", "In-unit Laundry", "Parking"],
    photos: [],
    minRent: 2500,
    maxRent: 3800,
    availableUnits: 2,
    totalUnits: 18,
  },
  {
    id: "3",
    name: "Vermont Villas",
    address: "789 Vermont Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90029",
    fullAddress: "789 Vermont Ave, Los Angeles, CA 90029",
    description: "Family-friendly community with large floor plans.",
    amenities: ["Playground", "Parking", "BBQ Area"],
    photos: [],
    minRent: 2800,
    maxRent: 4200,
    availableUnits: 5,
    totalUnits: 32,
  },
];

async function getProperties(): Promise<Property[]> {
  // Try to fetch from Appfolio, fall back to mock data
  const properties = await fetchProperties();
  return properties.length > 0 ? properties : mockProperties;
}

export default async function PropertiesPage() {
  const properties = await getProperties();

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
          {properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`} className="group">
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Home className="h-12 w-12" />
                  </div>
                  {property.availableUnits > 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        {property.availableUnits} Available
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.city}, {property.state}
                  </div>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-xs text-slate-500">Starting at</span>
                      <p className="font-bold text-lg">${property.minRent.toLocaleString()}/mo</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No properties found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
