"use client"

// src/components/sections/Contact.jsx
import { useState } from "react"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
    isSubmitting: false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Set submitting state
    setFormStatus((prev) => ({
      ...prev,
      isSubmitting: true,
      message: "Sending your reservation request...",
      submitted: true,
      success: true,
    }))

    try {
      // Log the data being sent
      console.log("Submitting form data:", formData)

      // Use the direct API endpoint
      const response = await fetch("/api/send-email-direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          message: formData.message,
        }),
      })

      // Log the response for debugging
      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Network response was not ok: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log("Response data:", result)

      setFormStatus({
        submitted: true,
        success: result.success,
        message: result.message,
        isSubmitting: false,
      })

      if (result.success) {
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "2",
          message: "",
        })

        // Reset status after 5 seconds
        setTimeout(() => {
          setFormStatus({
            submitted: false,
            success: false,
            message: "",
            isSubmitting: false,
          })
        }, 5000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus({
        submitted: true,
        success: false,
        message: "There was an error submitting your reservation. Please try again or call us directly.",
        isSubmitting: false,
      })
    }
  }

  return (
    <section id="reservation" className="contact-section">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info animate-on-scroll slide-in-left">
            <div className="section-header">
              <span className="subtitle">Get in Touch</span>
              <h2>Make a Reservation</h2>
            </div>

            <p>
              Reserve your table online and enjoy a seamless dining experience at Mekong. For special requests or larger
              parties, please call us directly.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Location</h4>
                  <p>123 Gourmet Street, Culinary District</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>reservations@mekong.com</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Hours</h4>
                  <p>Mon-Fri: 11am - 10pm</p>
                  <p>Sat: 10am - 11pm</p>
                  <p>Sun: 10am - 9pm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container animate-on-scroll slide-in-right">
            {formStatus.submitted && formStatus.success && !formStatus.isSubmitting ? (
              <div className="success-message">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>Reservation Request Sent!</h3>
                <p>{formStatus.message}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setFormStatus({ submitted: false, success: false, message: "", isSubmitting: false })}
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="guests">Guests</label>
                    <select id="guests" name="guests" value={formData.guests} onChange={handleChange}>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5 People</option>
                      <option value="6">6 People</option>
                      <option value="7+">7+ People</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Special Requests</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={formStatus.isSubmitting}>
                  {formStatus.isSubmitting ? (
                    <span>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                      Sending...
                    </span>
                  ) : (
                    "Reserve Now"
                  )}
                </button>

                {formStatus.submitted && !formStatus.success && (
                  <div className="form-message error">{formStatus.message}</div>
                )}

                {formStatus.isSubmitting && <div className="form-message info">{formStatus.message}</div>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
