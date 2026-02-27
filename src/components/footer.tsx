import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Moxie Management</h3>
            <p className="text-sm mb-4 max-w-md">
              Quality apartment rentals in Los Angeles. We provide well-maintained 
              properties and responsive management to make your rental experience exceptional.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:310-362-8105" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" />
                310-362-8105
              </a>
              <a href="mailto:info@moxiepm.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4" />
                info@moxiepm.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-white">Properties</Link>
              </li>
              <li>
                <Link href="/availability" className="hover:text-white">Availability</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white">Apply Now</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link href="/maintenance" className="hover:text-white">Maintenance Request</Link>
              </li>
              <li>
                <Link href="/tenant-portal" className="hover:text-white">Tenant Portal</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Moxie Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
