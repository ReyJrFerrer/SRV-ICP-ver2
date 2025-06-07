// frontend/src/pages/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useClient } from "@bundly/ares-react"; 
import Head from 'next/head';
import Link from "next/link";
import Image from "next/image"; // Import Image component

// Import your other shared components
import HeroSection from "@app/components/shared/Hero";
import FeaturesSection from "@app/components/shared/Features";
import AboutUs from "@app/components/shared/AboutUs";
import SDGSection from "@app/components/shared/SDGSection";
import Footer from "@app/components/shared/Footer";
import WhyChooseSRV from "@app/components/shared/WhyChooseSRV";


export default function HomePage() {

  return (
    <>
      <Head>
        <title>SRV - Your Service Hub</title>
        <meta name="description" content="Find and book local services with ease on the Internet Computer." />
        <link rel="icon" href="/logo.jpeg" /> 
      </Head>
      
      <main className="bg-gray-50">

        <HeroSection onLoginClick={function (): void {
          throw new Error("Function not implemented.");
        } } isLoginLoading={false} />
        <FeaturesSection />
        <WhyChooseSRV />

       <SDGSection /> 
       <AboutUs /> 
      </main>
      <Footer/> 
    </>
  );
}