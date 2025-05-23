"use client"

import { useEffect, useRef } from "react"

const Hero = () => {
  const videoRef = useRef(null)

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = () => {
      if (video.paused) {
        video.play().catch((err) => console.log("Video play error:", err))
      }
    }

    // Try to play video when it's loaded enough
    video.addEventListener("canplay", playVideo)
    video.addEventListener("loadeddata", playVideo)

    // Try to play immediately if already loaded
    if (video.readyState >= 2) {
      playVideo()
    }

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        playVideo()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      video.removeEventListener("canplay", playVideo)
      video.removeEventListener("loadeddata", playVideo)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <section id="home" className="hero-section">
      {/* Video Background Container */}
      <div className="hero-video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/mekong.jpg"
          className="hero-video"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span>AUTHENTIC CAMBODIAN CUISINE</span>
        </div>

        <h1 className="hero-title">
          Welcome to <span className="hero-highlight">Tonle Mekong</span>
        </h1>

        <p className="hero-description">
          Experience the finest dining with our chef-crafted menu featuring locally sourced ingredients and traditional
          Cambodian flavors that tell a story of heritage and innovation.
        </p>

        <div className="hero-buttons">
          <a href="#menu" className="btn btn-primary">
            <span>Explore Menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="#reservation" className="btn btn-secondary">
            <span>Book a Table</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Scroll Down</span>
        <div className="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 13L12 18L17 13M7 6L12 11L17 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero
