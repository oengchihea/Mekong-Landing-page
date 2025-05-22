"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)

  // Check device orientation and size
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsLandscape(window.innerHeight <= 500 && window.innerWidth > window.innerHeight)
    }

    // Initial check
    checkDevice()

    // Add event listener for window resize
    window.addEventListener("resize", checkDevice)

    // Cleanup
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="hero-logo animate-on-scroll fade-up">
          <div className="hero-logo-frame">
            <Image
              src="/images/mekong-tonle.png"
              alt="Mekong Tonle Restaurant"
              width={isMobile ? 126 : 146}
              height={isMobile ? 126 : 146}
              className="hero-logo-image"
              priority
            />
          </div>
        </div>
        <h1 className="hero-title-main animate-on-scroll fade-up">Welcome to Tonle</h1>
        <h2 className="hero-title-highlight animate-on-scroll fade-up delay-200">Mekong</h2>
        <h3 className="hero-subtitle animate-on-scroll fade-up delay-300">A Culinary Journey</h3>
        <p className="animate-on-scroll fade-up delay-400">
          Experience the finest dining with our chef-crafted menu featuring locally sourced ingredients
        </p>
        <div className={`hero-buttons animate-on-scroll fade-up delay-600 ${isMobile ? "hero-buttons-mobile" : ""}`}>
          <a href="#menu" className="btn btn-primary">
            Explore Menu
          </a>
          <a href="#reservation" className="btn btn-secondary">
            Book a Table
          </a>
        </div>
      </div>
      <div className="hero-image animate-on-scroll fade-in">
        <div className="image-overlay"></div>
      </div>
      {!isLandscape && (
        <div className="scroll-indicator animate-on-scroll fade-in delay-800">
          <span>Scroll Down</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      )}
    </section>
  )
}

export default Hero
