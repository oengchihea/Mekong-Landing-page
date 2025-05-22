"use client"

import { useEffect, useRef } from "react"
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
  const lastScrollY = useRef(0)
  const lastReloadTime = useRef(0)

  useEffect(() => {
    // Initialize animations when component mounts
    const cleanup = initAnimations()

    // Enhanced video playback with frequent reloading
    const enhanceVideos = () => {
      const videos = document.querySelectorAll("video")

      videos.forEach((video) => {
        // Force visibility
        video.style.display = "block"
        video.style.opacity = "1"
        video.style.visibility = "visible"

        // Force hardware acceleration
        video.style.transform = "translateX(-50%) translateY(-50%) translateZ(0)"

        // Try to play
        if (video.paused) {
          video.play().catch((err) => console.log("Video play error:", err))
        }
      })
    }

    // Initial enhancement
    enhanceVideos()

    // Frequent reload on scroll
    const handleScroll = () => {
      const now = Date.now()
      const currentScrollY = window.scrollY

      // Only reload if enough time has passed (1 second)
      if (now - lastReloadTime.current > 1000) {
        const videos = document.querySelectorAll("video")

        // Determine scroll direction
        const scrollingDown = currentScrollY > lastScrollY.current

        videos.forEach((video) => {
          if (isElementInViewport(video)) {
            // Save current time
            const currentTime = video.currentTime

            // Determine new time based on scroll direction
            let newTime
            if (scrollingDown) {
              // When scrolling down, jump forward slightly
              newTime = (currentTime + 0.5) % video.duration
            } else {
              // When scrolling up, jump backward slightly
              newTime = (currentTime - 0.5 + video.duration) % video.duration
            }

            // Apply the new time
            video.currentTime = newTime

            // Ensure it's playing
            if (video.paused) {
              video.play().catch((err) => console.log("Video play error:", err))
            }
          }
        })

        // Update last reload time
        lastReloadTime.current = now
      }

      // Update last scroll position
      lastScrollY.current = currentScrollY
    }

    // Add scroll event listener with throttling
    let scrollTimer
    const throttledScroll = () => {
      if (scrollTimer) return
      scrollTimer = setTimeout(() => {
        handleScroll()
        scrollTimer = null
      }, 50) // Reduced throttle to 50ms for more responsiveness
    }

    window.addEventListener("scroll", throttledScroll)

    // Return cleanup function
    return () => {
      if (cleanup) cleanup()
      window.removeEventListener("scroll", throttledScroll)
      if (scrollTimer) clearTimeout(scrollTimer)
    }
  }, [])

  // Helper function to check if element is in viewport
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

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
