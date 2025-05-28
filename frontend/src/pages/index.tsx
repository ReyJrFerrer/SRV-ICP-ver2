import React from "react";
import Link from "next/link";
import { useAuth } from "@bundly/ares-react";

import Header from "@app/components/header";
import Hero from "@app/components/shared/Hero";
import Features from "@app/components/shared/Features";
import Footer from "@app/components/shared/Footer";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Ready to get started?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/client" as="/client">
                <button className="btn-primary">
                  I Need a Service
                </button>
              </Link>
              <Link href="/provider" as="/provider">
                <button className="btn-secondary">
                  I Provide Services
                </button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-blue-600 text-white rounded-xl p-8 md:p-12 shadow-lg">
              <div className="md:flex items-center justify-between">
                <div className="mb-6 md:mb-0 md:w-2/3">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the SRV community today</h2>
                  <p className="text-blue-100">
                    Whether you need services or provide them, SRV is your trusted platform built on the Internet Computer.
                  </p>
                </div>
                <div>
                  {isAuthenticated ? (
                    <p className="text-xl">You're already signed in!</p>
                  ) : (
                    <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                      Sign Up Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
