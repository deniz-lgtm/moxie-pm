"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/availability", label: "Availability" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On non-homepage, always use solid background
  const useSolid = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        useSolid
          ? "bg-white/95 backdrop-blur border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`text-xl font-bold transition-colors ${
              useSolid ? "text-slate-900" : "text-white"
            }`}
          >
            Moxie<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                useSolid
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={
              useSolid
                ? "text-slate-600 hover:text-slate-900"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }
          >
            <a href="tel:310-362-8105" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">310-362-8105</span>
            </a>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            <Link href="/availability">View Availability</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={useSolid ? "" : "text-white hover:bg-white/10"}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-6 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                asChild
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                <Link href="/availability" onClick={() => setIsOpen(false)}>
                  View Availability
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="tel:310-362-8105"
                  className="flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  310-362-8105
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
