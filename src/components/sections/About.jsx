// src/components/sections/About.jsx
// Remove CSS import

const About = () => {
  return (
    <section id="about" className="about-section">
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
            <img src="/images/guide.jpg" alt="Mekong Cooking Demonstration" />
          </div>
          <div className="about-image secondary-image animate-on-scroll fade-in delay-300">
            <img src="/images/place.jpg" alt="Mekong Restaurant Interior" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About