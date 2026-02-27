import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-1">
              Moxie<span className="text-amber-500">.</span>
            </h3>
            <p className="text-sm text-amber-500/80 font-medium tracking-wide uppercase mb-4">
              Property Management
            </p>
            <p className="text-sm mb-6 max-w-sm leading-relaxed">
              Premium apartment rentals across Los Angeles. Curated properties,
              professional management, and a commitment to quality living.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="tel:310-362-8105"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-amber-500" />
                310-362-8105
              </a>
              <a
                href="mailto:info@moxiepm.com"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-amber-500" />
                info@moxiepm.com
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/availability"
                  className="hover:text-white transition-colors"
                >
                  Availability
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/apply"
                  className="hover:text-white transition-colors"
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/maintenance"
                  className="hover:text-white transition-colors"
                >
                  Maintenance Request
                </Link>
              </li>
              <li>
                <Link
                  href="/tenant-portal"
                  className="hover:text-white transition-colors"
                >
                  Tenant Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Moxie Management. All rights
            reserved.
          </p>
          <p className="text-slate-500">Premium LA Living, Professionally Managed</p>
        </div>
      </div>
    </footer>
  );
}
