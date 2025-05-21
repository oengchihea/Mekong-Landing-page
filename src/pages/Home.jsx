// src/pages/Home.jsx
// Remove "use client" directive and CSS import
import { useEffect } from "react"
import Header from "../components/Header"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import Menu from "../components/sections/Menu"
import Testimonials from "../components/sections/Testimonials"
import Gallery from "../components/sections/Gallery"
import Contact from "../components/sections/Contact"
import Footer from "../components/Footer"
import { initAnimations } from "../utils/animations"

const Home = () => {
  useEffect(() => {
    // Initialize scroll animations when component mounts
    initAnimations()
  }, [])

  return (
    <div className="home-container">
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Home