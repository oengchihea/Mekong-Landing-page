"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      // Handle header background change on scroll
      const isScrolled = window.scrollY > 50
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }

      // Handle active section highlighting
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    // Implement smooth scrolling for all anchor links
    const implementSmoothScroll = () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault()

          // Close mobile menu if open
          if (mobileMenuOpen) {
            setMobileMenuOpen(false)
          }

          const targetId = this.getAttribute("href").substring(1)
          const targetElement = document.getElementById(targetId)

          if (targetElement) {
            // Calculate header height for offset
            const headerHeight = document.querySelector(".site-header").offsetHeight
            const targetPosition = targetElement.offsetTop - headerHeight

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            })

            // Update active section
            setActiveSection(targetId)
          } else {
            console.error(`Element with id "${targetId}" not found`)
          }
        })
      })
    }

    window.addEventListener("scroll", handleScroll)

    // Small delay to ensure DOM is fully loaded
    setTimeout(implementSmoothScroll, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled, mobileMenuOpen])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <div className={`logo-frame ${scrolled ? "logo-frame-scrolled" : ""}`}>
            <Image
              src="/images/mekong-tonle.png"
              alt="Mekong Tonle Restaurant"
              width={86}
              height={86}
              className="logo-image"
              priority
            />
          </div>
        </div>

        <div className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <a href="#home" className={activeSection === "home" ? "active" : ""}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" className={activeSection === "about" ? "active" : ""}>
                About
              </a>
            </li>
            <li>
              <a href="#menu" className={activeSection === "menu" ? "active" : ""}>
                Menu
              </a>
            </li>
            <li>
              <a href="#testimonials" className={activeSection === "testimonials" ? "active" : ""}>
                Testimonials
              </a>
            </li>
            <li>
              <a href="#gallery" className={activeSection === "gallery" ? "active" : ""}>
                Gallery
              </a>
            </li>
            <li>
              <a href="#reservation" className={activeSection === "reservation" ? "active" : ""}>
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-cta">
          <a href="#reservation" className="btn btn-primary">
            Reserve a Table
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
