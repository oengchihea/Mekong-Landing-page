"use client"

import { useEffect, useState, useRef } from "react"
import { Utensils, Wine, Bell, Leaf } from "lucide-react"

const About = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const videoRef = useRef(null)
  const lastScrollY = useRef(0)

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

  // Enhanced video handling with continuous dish-pulling focus
  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    // Directly set styles to ensure visibility
    video.style.display = "block"
    video.style.opacity = "1"
    video.style.visibility = "visible"
    video.style.zIndex = "0"

    // Force hardware acceleration
    video.style.transform = "translateX(-50%) translateY(-50%) translateZ(0)"

    // Ensure video plays
    const playVideo = () => {
      if (video.paused) {
        video.play().catch((err) => console.log("Video play error:", err))
      }
    }

    // Try to play video immediately
    playVideo()

    // Also try when metadata is loaded
    video.addEventListener("loadedmetadata", playVideo)

    // And when enough data is available
    video.addEventListener("canplay", playVideo)

    // Define the key moments in the video
    // Adjust these values based on your actual video timing for about.mp4
    const dishPullingStart = 3.0 // When the man starts pulling dishes
    const dishPullingEnd = 5.0 // When the action completes

    // Simple time update handler for continuous looping
    const handleTimeUpdate = () => {
      // If we reach the end of the dish-pulling sequence, loop back
      if (video.currentTime >= dishPullingEnd) {
        // Loop back to the start of the dish-pulling sequence
        video.currentTime = dishPullingStart
      }
    }

    // Add timeupdate event listener
    video.addEventListener("timeupdate", handleTimeUpdate)

    // Handle scroll events for responsive behavior
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // If the video is in view and user scrolls significantly
      if (isElementInViewport(video) && Math.abs(currentScrollY - lastScrollY.current) > 50) {
        // Determine scroll direction
        const scrollingDown = currentScrollY > lastScrollY.current

        if (scrollingDown) {
          // If scrolling down, continue playing normally
          playVideo()
        } else {
          // If scrolling up, go back to the start of the dish-pulling
          video.currentTime = dishPullingStart
          playVideo()
        }
      }

      lastScrollY.current = currentScrollY
    }

    // Add scroll event listener with throttling
    let scrollTimer
    const throttledScroll = () => {
      if (scrollTimer) return
      scrollTimer = setTimeout(() => {
        handleScroll()
        scrollTimer = null
      }, 100)
    }

    window.addEventListener("scroll", throttledScroll)

    // Handle visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        playVideo()
      }
    })

    return () => {
      video.removeEventListener("loadedmetadata", playVideo)
      video.removeEventListener("canplay", playVideo)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      window.removeEventListener("scroll", throttledScroll)
      document.removeEventListener("visibilitychange", playVideo)
    }
  }, [])

  // Helper function to check if element is in viewport
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  return (
    <section id="about" className="about-section">
      {/* Background Video */}
      <div
        className="about-background-video"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="video-element"
          poster="/images/about-poster.jpg"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            transform: "translateX(-50%) translateY(-50%) translateZ(0)",
            objectFit: "cover",
            zIndex: 0,
            opacity: 1,
            visibility: "visible",
          }}
        >
          <source src="/video/about.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className="video-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        ></div>
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
                <Utensils size={24} strokeWidth={2} />
              </div>
              <h3>Gourmet Cuisine</h3>
              <p>Expertly crafted dishes that blend traditional techniques with modern innovation</p>
            </div>

            <div className="feature animate-on-scroll fade-up delay-600">
              <div className="feature-icon">
                <Wine size={24} strokeWidth={2} />
              </div>
              <h3>Fine Wines</h3>
              <p>Curated selection of wines from around the world to complement your meal</p>
            </div>

            <div className="feature animate-on-scroll fade-up delay-700">
              <div className="feature-icon">
                <Bell size={24} strokeWidth={2} />
              </div>
              <h3>Impeccable Service</h3>
              <p>Attentive and personalized service to enhance your dining experience</p>
            </div>

            <div className="feature animate-on-scroll fade-up delay-800">
              <div className="feature-icon">
                <Leaf size={24} strokeWidth={2} />
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
            <img src="/images/guide.jpg" alt="Mekong Cooking Demonstration" loading="lazy" />
          </div>
          {!isLandscape && (
            <div className="about-image secondary-image animate-on-scroll fade-in delay-300">
              <img src="/images/place.jpg" alt="Mekong Restaurant Interior" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default About
