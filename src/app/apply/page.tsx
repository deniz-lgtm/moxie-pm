import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Apply Now</h1>
          <p className="text-slate-600 mb-8">
            Complete the application below. We'll review and get back to you within 24-48 hours.
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <Input required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <Input required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <Input type="email" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <Input type="tel" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Desired Property</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Select a property...</option>
                <option>Property 1</option>
                <option>Property 2</option>
                <option>Property 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income *</label>
              <Input placeholder="$" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Move-in Date</label>
              <Input type="date" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Additional Information</label>
              <textarea 
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                placeholder="Tell us about yourself, pets, parking needs, etc."
              />
            </div>

            <Button className="w-full" size="lg">Submit Application</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
