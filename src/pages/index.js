"use client"

import { useEffect } from "react"
import Head from "next/head"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import Menu from "../components/sections/Menu"
import Gallery from "../components/sections/Gallery"
import Testimonials from "../components/sections/Testimonials"
import Contact from "../components/sections/Contact"
import { initAnimations } from "../utils/animations"

export default function Home() {
  useEffect(() => {
    // Initialize animations when component mounts
    const cleanup = initAnimations()

    // Return cleanup function
    return cleanup
  }, [])

  return (
    <div className="home-container">
      <Head>
        <title>Mekong Restaurant - Exquisite Dining Experience</title>
        <meta
          name="description"
          content="Experience the finest dining with our chef-crafted menu featuring locally sourced ingredients at Mekong Restaurant."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Menu Section */}
        <Menu />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Gallery Section */}
        <Gallery />

        {/* Contact/Reservation Section */}
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
