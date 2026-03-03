import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Building, Award, Users, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Moxie Management</h1>
            <p className="text-xl text-slate-300">
              Providing quality rental homes and exceptional service to the Los Angeles community since 2018.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Moxie Management was founded with a simple mission: to provide well-maintained, 
                quality rental properties with responsive, professional management. We believe 
                that finding a home should be straightforward and that tenants deserve reliable 
                service.
              </p>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Starting with a small portfolio of properties near USC, we've expanded across 
                Los Angeles while maintaining our commitment to quality and tenant satisfaction.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Today, we manage diverse properties throughout LA, from student housing to 
                multifamily apartments, always with the same focus on excellence.
              </p>
            </div>
            <div className="bg-slate-100 rounded-lg h-80 flex items-center justify-center text-slate-400">
              <Building className="h-24 w-24" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Quality",
                description: "We maintain our properties to high standards and invest in regular improvements.",
              },
              {
                icon: Users,
                title: "Service",
                description: "Responsive, friendly management that treats tenants with respect and addresses concerns quickly.",
              },
              {
                icon: Clock,
                title: "Reliability",
                description: "Consistent communication and follow-through on commitments to our tenants and partners.",
              },
            ].map((value, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <value.icon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Properties Managed" },
              { value: "1,200+", label: "Happy Tenants" },
              { value: "7+", label: "Years Experience" },
              { value: "24hr", label: "Maintenance Response" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h2>
              <p className="text-slate-600 mb-8">
                Have questions about our properties or ready to apply? We're here to help.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <a href="tel:310-362-8105" className="font-medium text-slate-900">310-362-8105</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a href="mailto:info@moxiepm.com" className="font-medium text-slate-900">info@moxiepm.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Office</p>
                    <p className="font-medium text-slate-900">Los Angeles, CA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <Input placeholder="(310) 555-0123" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="How can we help you?"
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
