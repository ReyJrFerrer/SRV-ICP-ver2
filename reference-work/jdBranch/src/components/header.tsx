import { InternetIdentityButton } from "@bundly/ares-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">SRV</span>
            <span className="text-gray-700 font-medium hidden sm:inline">Service Booking</span>
          </Link>
        </div>
        <div className="lg:flex lg:gap-x-12">
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
            Services
          </Link>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end">
          <InternetIdentityButton />
        </div>
      </nav>
    </header>
  );
}
