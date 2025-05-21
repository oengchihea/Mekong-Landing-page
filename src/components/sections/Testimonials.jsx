// src/components/sections/Testimonials.jsx
// Remove "use client" directive and CSS import
import { useState, useEffect } from "react"

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Oeng Chihea",
      role: "Food Critic",
      quote:
        "Mekong offers one of the most refined dining experiences in the city. The attention to detail in every dish is remarkable.",
      avatar: "/images/chihea.jpg",
    },
    {
      id: 2,
      name: "Cheong Daivai",
      role: "Regular Guest",
      quote:
        "I've been coming here for years and the quality has never wavered. The seasonal menu always offers something new to discover.",
      avatar: "/images/daivai.jpg",
    },
    {
      id: 3,
      name: "Cheong Choovai",
      role: "Food Blogger",
      quote:
        "From the ambiance to the service to the exquisite food, Mekong creates a memorable experience that keeps me coming back.",
      avatar: "/images/choonvai.jpg",
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-container">
        <div className="section-header text-center">
          <span className="subtitle animate-on-scroll fade-up">What People Say</span>
          <h2 className="animate-on-scroll fade-up delay-200">Testimonials</h2>
        </div>

        <div className="testimonials-slider animate-on-scroll fade-up delay-400">
          <div className="testimonials-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-slide">
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials