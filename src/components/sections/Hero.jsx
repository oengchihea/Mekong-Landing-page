// src/components/sections/Hero.jsx
// Remove CSS import

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h1 className="animate-on-scroll fade-up">Welcome to Mekong</h1>
        <h2 className="animate-on-scroll fade-up delay-200">A Culinary Journey</h2>
        <p className="animate-on-scroll fade-up delay-400">
          Experience the finest dining with our chef-crafted menu featuring locally sourced ingredients
        </p>
        <div className="hero-buttons animate-on-scroll fade-up delay-600">
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
      <div className="scroll-indicator animate-on-scroll fade-in delay-800">
        <span>Scroll Down</span>
        <i className="fas fa-chevron-down"></i>
      </div>
    </section>
  )
}

export default Hero