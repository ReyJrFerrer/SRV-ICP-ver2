import { InternetIdentityButton } from "@bundly/ares-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1 items-center">
          <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <Image 
              src="/logo.svg" 
              alt="SRV Logo"
              width={140} // Increased width
              height={70} // Increased height
              priority
            />
          </Link>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end">
          <InternetIdentityButton />
        </div>
      </nav>
    </header>
  );
}