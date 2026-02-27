import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Phone, Mail, Check } from "lucide-react";

// This would normally fetch from Appfolio API
async function getProperty(id: string) {
  // Placeholder data
  return {
    id,
    name: "Property Name",
    address: "123 Main St, Los Angeles, CA 90001",
    description: "Beautiful apartment in a prime location with modern amenities and responsive management.",
    price: "$2,500 - $3,500",
    beds: "1-3",
    baths: "1-2",
    sqft: "700-1,200",
    amenities: [
      "In-unit laundry",
      "Parking included",
      "Pet friendly",
      "Air conditioning",
      "Hardwood floors",
      "Updated kitchen",
    ],
    availableUnits: [
      { unit: "1A", beds: 1, baths: 1, sqft: 700, price: "$2,500", available: "Now" },
      { unit: "2B", beds: 2, baths: 1, sqft: 900, price: "$3,200", available: "Mar 1" },
      { unit: "3C", beds: 2, baths: 2, sqft: 1100, price: "$3,500", available: "Mar 15" },
    ],
  };
}

export default async function PropertyDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const property = await getProperty(id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Image Gallery */}
      <section className="bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
            <div className="bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
              Main Photo
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                Photo 2
              </div>
              <div className="bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                Photo 3
              </div>
              <div className="bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                Photo 4
              </div>
              <div className="bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                + More
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Info */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.name}</h1>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.address}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-3xl font-bold text-slate-900">{property.price}</p>
                  <p className="text-slate-500">per month</p>
                </div>
              </div>

              <div className="flex gap-6 py-4 border-y">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-slate-400" />
                  <span>{property.beds} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-slate-400" />
                  <span>{property.baths} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-slate-400" />
                  <span>{property.sqft} sq ft</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">About This Property</h2>
                <p className="text-slate-600 leading-relaxed">{property.description}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-slate-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Units */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Available Units</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Unit</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Beds</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Baths</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Sq Ft</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Rent</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Available</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.availableUnits.map((unit, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-4 px-4 font-medium">{unit.unit}</td>
                        <td className="py-4 px-4">{unit.beds}</td>
                        <td className="py-4 px-4">{unit.baths}</td>
                        <td className="py-4 px-4">{unit.sqft}</td>
                        <td className="py-4 px-4 font-medium">{unit.price}</td>
                        <td className="py-4 px-4">
                          <span className="text-green-600 text-sm">{unit.available}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Button size="sm" asChild>
                            <Link href="/apply">Apply</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Interested?</h3>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/apply">Apply Now</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Schedule a Tour</Link>
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Contact Leasing</h4>
                <div className="space-y-2 text-sm">
                  <a href="tel:310-362-8105" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                    <Phone className="h-4 w-4" />
                    310-362-8105
                  </a>
                  <a href="mailto:leasing@moxiepm.com" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                    <Mail className="h-4 w-4" />
                    leasing@moxiepm.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
