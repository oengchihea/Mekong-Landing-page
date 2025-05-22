"use client"

import { useEffect, useState } from "react"

const About = () => {
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
    <section id="about" className="about-section">
      {/* Background Video */}
      <div className="about-background-video">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-element"
          poster="/images/about-poster.jpg" // Fallback image while video loads
        >
          <source src="/video/food.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="about-container">
        <div className="about-content">
          <div className="section-header">
            <span className="subtitle animate-on-scroll fade-up">Our Story</span>
            <h2 className="animate-on-scroll fade-up delay-200">About Mekong</h2>
          </div>

          <div className="about-text animate-on-scroll fade-up delay-400">
            <p>
              Founded in 2010, Mekong has been serving exquisite cuisine in a warm and elegant atmosphere. Our passion
              for culinary excellence drives us to create memorable dining experiences for our guests.
            </p>
            <p>
              Led by award-winning Chef Michael Laurent, our kitchen team crafts each dish with precision and
              creativity, using only the freshest seasonal ingredients sourced from local farmers and suppliers.
            </p>
          </div>

          <div className="about-features">
            <div className="feature animate-on-scroll fade-up delay-500">
              <div className="feature-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Gourmet Cuisine</h3>
              <p>Expertly crafted dishes that blend traditional techniques with modern innovation</p>
            </div>

            <div className="feature animate-on-scroll fade-up delay-600">
              <div className="feature-icon">
                <i className="fas fa-wine-glass-alt"></i>
              </div>
              <h3>Fine Wines</h3>
              <p>Curated selection of wines from around the world to complement your meal</p>
            </div>

            <div className="feature animate-on-scroll fade-up delay-700">
              <div className="feature-icon">
                <i className="fas fa-concierge-bell"></i>
              </div>
              <h3>Impeccable Service</h3>
              <p>Attentive and personalized service to enhance your dining experience</p>
            </div>

            <div className="feature animate-on-scroll fade-up delay-800">
              <div className="feature-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Authentic Ingredients</h3>
              <p>Fresh, locally-sourced ingredients that capture the essence of Southeast Asian cuisine</p>
            </div>
          </div>

          <div className="about-cta animate-on-scroll fade-up delay-900">
            <a href="#contact" className="btn btn-primary">
              Contact Us
            </a>
          </div>
        </div>

        <div className="about-images-container animate-on-scroll slide-in-right">
          <div className="about-image primary-image">
            <img
              src="/images/guide.jpg"
              alt="Mekong Cooking Demonstration"
              loading="lazy" // Add lazy loading for images
            />
          </div>
          {/* Only show secondary image if not in landscape mode on mobile */}
          {!isLandscape && (
            <div className="about-image secondary-image animate-on-scroll fade-in delay-300">
              <img
                src="/images/place.jpg"
                alt="Mekong Restaurant Interior"
                loading="lazy" // Add lazy loading for images
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default About
