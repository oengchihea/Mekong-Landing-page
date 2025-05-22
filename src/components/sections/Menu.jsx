"use client"

import { useState, useEffect, useRef } from "react"

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("starters")
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef(null)
  const lastScrollY = useRef(0)
  const lastReloadTime = useRef(0)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Enhanced video handling with frequent reloading
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

    // Frequent reload on scroll
    const handleScroll = () => {
      const now = Date.now()
      const currentScrollY = window.scrollY

      // Only reload if enough time has passed (1 second)
      if (now - lastReloadTime.current > 1000 && isElementInViewport(video)) {
        // Determine scroll direction
        const scrollingDown = currentScrollY > lastScrollY.current

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
        playVideo()

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

    // Handle visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        playVideo()
      }
    })

    return () => {
      video.removeEventListener("loadedmetadata", playVideo)
      video.removeEventListener("canplay", playVideo)
      window.removeEventListener("scroll", throttledScroll)
    }
  }, [])

  // Helper function to check if element is in viewport
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  const menuCategories = [
    { id: "starters", name: "Starters" },
    { id: "mains", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "drinks", name: "Drinks" },
  ]

  const menuItems = {
    starters: [
      {
        name: "Truffle Arancini",
        description: "Crispy risotto balls with wild mushrooms and truffle oil",
        price: "$14",
      },
      {
        name: "Seared Scallops",
        description: "Pan-seared scallops with cauliflower purée and bacon crumble",
        price: "$18",
      },
      {
        name: "Burrata Salad",
        description: "Creamy burrata with heirloom tomatoes, basil, and aged balsamic",
        price: "$16",
      },
    ],
    mains: [
      {
        name: "Filet Mignon",
        description: "8oz grass-fed beef with garlic mashed potatoes and seasonal vegetables",
        price: "$38",
      },
      {
        name: "Pan-Seared Salmon",
        description: "Wild-caught salmon with lemon beurre blanc, asparagus, and herb risotto",
        price: "$32",
      },
      {
        name: "Mushroom Risotto",
        description: "Arborio rice with wild mushrooms, truffle oil, and parmesan",
        price: "$26",
      },
    ],
    desserts: [
      {
        name: "Chocolate Soufflé",
        description: "Warm chocolate soufflé with vanilla bean ice cream",
        price: "$12",
      },
      {
        name: "Crème Brûlée",
        description: "Classic vanilla bean crème brûlée with caramelized sugar",
        price: "$10",
      },
      {
        name: "Berry Panna Cotta",
        description: "Silky vanilla panna cotta with mixed berry compote",
        price: "$11",
      },
    ],
    drinks: [
      {
        name: "Signature Martini",
        description: "House-infused vodka with elderflower and citrus",
        price: "$14",
      },
      {
        name: "Barrel-Aged Manhattan",
        description: "Bourbon, sweet vermouth, and bitters aged in oak barrels",
        price: "$16",
      },
      {
        name: "Sommelier's Wine Selection",
        description: "Ask your server about our rotating premium wine selection",
        price: "Varies",
      },
    ],
  }

  return (
    <section id="menu" className="menu-section">
      {/* Background Video */}
      <div
        className="menu-background-video"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="video-element"
          poster="/images/menu-poster.jpg"
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
          <source src="/video/menu.mp4" type="video/mp4" />
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
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 1,
          }}
        ></div>
      </div>

      <div className="menu-container">
        <div className="section-header text-center">
          <span className="subtitle animate-on-scroll fade-up">Culinary Delights</span>
          <h2 className="animate-on-scroll fade-up delay-200">Our Menu</h2>
          <p className="animate-on-scroll fade-up delay-300">
            Explore our seasonal offerings crafted with passion and the finest ingredients
          </p>
        </div>

        <div className="menu-categories animate-on-scroll fade-up delay-400">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={`menu-category-btn ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
              aria-label={`View ${category.name}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="menu-items">
          {menuItems[activeCategory].map((item, index) => (
            <div
              key={index}
              className="menu-item animate-on-scroll fade-up"
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              <div className="menu-item-header">
                <h3 className="menu-item-name">{item.name}</h3>
                <span className="menu-item-price">{item.price}</span>
              </div>
              <p className="menu-item-description">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="menu-cta text-center animate-on-scroll fade-up delay-800">
          <a href="#reservation" className="btn btn-primary">
            Reserve a Table
          </a>
          <a href="/full-menu.pdf" className="btn btn-secondary">
            View Full Menu
          </a>
        </div>
      </div>
    </section>
  )
}

export default Menu
