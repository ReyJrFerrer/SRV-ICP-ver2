// frontend/src/components/shared/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // For using the logo

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-300"> {/* Dark gray background */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-2">
              <Image 
                  src="/logo.jpeg" // Assuming logo.jpeg is in the 'public' folder
                  alt="SRV Logo"
                  width={100} // Adjust size as needed
                  height={50}  // Adjust size as needed
              />
            </Link>
            <p className="text-sm text-gray-400">
              Your trusted platform for booking services on the Internet Computer.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-yellow-300 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-yellow-300 transition-colors">About</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-yellow-300 transition-colors">Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/client" className="text-gray-400 hover:text-yellow-300 transition-colors">Client Portal</Link></li>
              <li><Link href="/provider" className="text-gray-400 hover:text-yellow-300 transition-colors">Provider Portal</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-yellow-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">support@srv.icp</li>
              {/* Add social links here if desired, with hover:text-yellow-300 */}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-700 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} SRV Service Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}