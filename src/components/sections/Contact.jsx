"use client"

import { useState, useEffect } from "react"
import { submitReservation } from "../../lib/contact" // Updated import path

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
    confirmationCode: "",
  })

  const [validationErrors, setValidationErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})

  // Format today's date for the min attribute of date input
  const today = new Date().toISOString().split("T")[0]

  // Get date 3 months from now for max date
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateString = maxDate.toISOString().split("T")[0]

  // Set default time to 7:00 PM if not set
  useEffect(() => {
    if (!formData.time) {
      setFormData((prev) => ({ ...prev, time: "19:00" }))
    }
  }, [formData.time])

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Full name is required"
    if (name.trim().length < 2) return "Name must be at least 2 characters"
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name can only contain letters, spaces, hyphens, and apostrophes"
    return ""
  }

  const validateEmail = (email) => {
    if (!email.trim()) return "Email address is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required"
    const cleanPhone = phone.replace(/[\s\-$$$$.]/g, "")
    if (cleanPhone.length < 8) return "Phone number must be at least 8 digits"
    if (cleanPhone.length > 15) return "Phone number is too long"
    if (!/^[+\-\s$$$$\d]+$/.test(phone)) return "Please enter a valid phone number"
    return ""
  }

  const validateDate = (date) => {
    if (!date) return "Reservation date is required"
    const selectedDate = new Date(date)
    const todayDate = new Date(today)
    const maxDateObj = new Date(maxDateString)

    if (selectedDate < todayDate) return "Please select a future date"
    if (selectedDate > maxDateObj) return "Reservations can only be made up to 3 months in advance"

    // Check if it's a valid day (not too far in the past due to timezone)
    const dayOfWeek = selectedDate.getDay()
    // You could add specific day restrictions here if needed

    return ""
  }

  const validateTime = (time, date) => {
    if (!time) return "Reservation time is required"

    const [hours, minutes] = time.split(":").map(Number)
    const timeInMinutes = hours * 60 + minutes

    // Restaurant hours: 11:00 AM to 10:00 PM
    const openTime = 11 * 60 // 11:00 AM
    const closeTime = 22 * 60 // 10:00 PM

    if (timeInMinutes < openTime) return "We open at 11:00 AM"
    if (timeInMinutes > closeTime) return "Last reservation is at 10:00 PM"

    // Check if it's today and time has passed
    if (date === today) {
      const now = new Date()
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes()
      if (timeInMinutes <= currentTimeInMinutes + 60) {
        return "Please select a time at least 1 hour from now"
      }
    }

    return ""
  }

  const validateGuests = (guests) => {
    if (!guests) return "Number of guests is required"
    return ""
  }

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return validateName(value)
      case "email":
        return validateEmail(value)
      case "phone":
        return validatePhone(value)
      case "date":
        return validateDate(value)
      case "time":
        return validateTime(value, formData.date)
      case "guests":
        return validateGuests(value)
      default:
        return ""
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    // Validate field if it has been touched
    if (touchedFields[name]) {
      const error = validateField(name, value)
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }

    // Special case: if date changes, revalidate time
    if (name === "date" && touchedFields.time) {
      const timeError = validateTime(formData.time, value)
      setValidationErrors((prev) => ({
        ...prev,
        time: timeError,
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target

    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }))

    const error = validateField(name, value)
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const validateForm = () => {
    const errors = {}

    errors.name = validateName(formData.name)
    errors.email = validateEmail(formData.email)
    errors.phone = validatePhone(formData.phone)
    errors.date = validateDate(formData.date)
    errors.time = validateTime(formData.time, formData.date)
    errors.guests = validateGuests(formData.guests)

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(Object.entries(errors).filter(([_, error]) => error !== ""))

    setValidationErrors(filteredErrors)
    setTouchedFields({
      name: true,
      email: true,
      phone: true,
      date: true,
      time: true,
      guests: true,
    })

    return Object.keys(filteredErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate entire form
    if (!validateForm()) {
      setFormStatus({
        submitted: true,
        success: false,
        message: "Please correct the errors below before submitting.",
        isSubmitting: false,
      })
      return
    }

    // Set submitting state
    setFormStatus((prev) => ({
      ...prev,
      isSubmitting: true,
      message: "Sending your reservation request...",
      submitted: true,
      success: false,
    }))

    try {
      // Log the data being sent
      console.log("Submitting form data:", formData)

      // Call the API to submit the reservation
      const response = await submitReservation(formData)

      // Handle successful submission
      setFormStatus({
        submitted: true,
        success: true,
        message:
          response.message ||
          "Your reservation request has been sent successfully! We'll confirm your booking within 30 minutes.",
        isSubmitting: false,
        confirmationCode: response.confirmationCode || "",
      })

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "19:00",
        guests: "2",
        message: "",
      })

      // Clear validation errors and touched fields
      setValidationErrors({})
      setTouchedFields({})
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus({
        submitted: true,
        success: false,
        message:
          error.message || "There was an error submitting your reservation. Please try again or call us directly.",
        isSubmitting: false,
      })
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Check if form is valid
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.date &&
    formData.time &&
    formData.guests &&
    Object.keys(validationErrors).length === 0

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
                  <p>+855 (0) 63 964 667</p>
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
                <p>
                  Thank you for your reservation request for {formData.guests}{" "}
                  {Number.parseInt(formData.guests) === 1 ? "person" : "people"} on {formatDate(formData.date)} at{" "}
                  {formatTime(formData.time)}. We'll confirm your reservation within 30 minutes.
                </p>
                {formStatus.confirmationCode && (
                  <p className="confirmation-code">
                    Your confirmation code: <strong>{formStatus.confirmationCode}</strong>
                  </p>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setFormStatus({
                      submitted: false,
                      success: false,
                      message: "",
                      isSubmitting: false,
                      confirmationCode: "",
                    })
                    setValidationErrors({})
                    setTouchedFields({})
                  }}
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div
                  className={`form-group ${validationErrors.name ? "has-error" : ""} ${touchedFields.name && !validationErrors.name ? "has-success" : ""}`}
                >
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={
                      validationErrors.name ? "error" : touchedFields.name && !validationErrors.name ? "success" : ""
                    }
                    required
                  />
                  {validationErrors.name && <span className="error-message">{validationErrors.name}</span>}
                  {touchedFields.name && !validationErrors.name && formData.name && (
                    <span className="success-message-inline">
                      <i className="fas fa-check"></i>
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div
                    className={`form-group ${validationErrors.email ? "has-error" : ""} ${touchedFields.email && !validationErrors.email ? "has-success" : ""}`}
                  >
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="your.email@example.com"
                      className={
                        validationErrors.email
                          ? "error"
                          : touchedFields.email && !validationErrors.email
                            ? "success"
                            : ""
                      }
                      required
                    />
                    {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
                    {touchedFields.email && !validationErrors.email && formData.email && (
                      <span className="success-message-inline">
                        <i className="fas fa-check"></i>
                      </span>
                    )}
                  </div>

                  <div
                    className={`form-group ${validationErrors.phone ? "has-error" : ""} ${touchedFields.phone && !validationErrors.phone ? "has-success" : ""}`}
                  >
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="(855) 123-4567"
                      className={
                        validationErrors.phone
                          ? "error"
                          : touchedFields.phone && !validationErrors.phone
                            ? "success"
                            : ""
                      }
                      required
                    />
                    {validationErrors.phone && <span className="error-message">{validationErrors.phone}</span>}
                    {touchedFields.phone && !validationErrors.phone && formData.phone && (
                      <span className="success-message-inline">
                        <i className="fas fa-check"></i>
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div
                    className={`form-group ${validationErrors.date ? "has-error" : ""} ${touchedFields.date && !validationErrors.date ? "has-success" : ""}`}
                  >
                    <label htmlFor="date">Reservation Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={today}
                      max={maxDateString}
                      className={
                        validationErrors.date ? "error" : touchedFields.date && !validationErrors.date ? "success" : ""
                      }
                      required
                    />
                    {validationErrors.date && <span className="error-message">{validationErrors.date}</span>}
                    {touchedFields.date && !validationErrors.date && formData.date && (
                      <span className="success-message-inline">
                        <i className="fas fa-check"></i>
                      </span>
                    )}
                  </div>

                  <div
                    className={`form-group ${validationErrors.time ? "has-error" : ""} ${touchedFields.time && !validationErrors.time ? "has-success" : ""}`}
                  >
                    <label htmlFor="time">Preferred Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min="11:00"
                      max="22:00"
                      step="1800"
                      className={
                        validationErrors.time ? "error" : touchedFields.time && !validationErrors.time ? "success" : ""
                      }
                      required
                    />
                    {validationErrors.time && <span className="error-message">{validationErrors.time}</span>}
                    {touchedFields.time && !validationErrors.time && formData.time && (
                      <span className="success-message-inline">
                        <i className="fas fa-check"></i>
                      </span>
                    )}
                  </div>

                  <div
                    className={`form-group ${validationErrors.guests ? "has-error" : ""} ${touchedFields.guests && !validationErrors.guests ? "has-success" : ""}`}
                  >
                    <label htmlFor="guests">Number of Guests *</label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        validationErrors.guests
                          ? "error"
                          : touchedFields.guests && !validationErrors.guests
                            ? "success"
                            : ""
                      }
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5 People</option>
                      <option value="6">6 People</option>
                      <option value="7+">7+ People (Call for availability)</option>
                    </select>
                    {validationErrors.guests && <span className="error-message">{validationErrors.guests}</span>}
                    {touchedFields.guests && !validationErrors.guests && formData.guests && (
                      <span className="success-message-inline">
                        <i className="fas fa-check"></i>
                      </span>
                    )}
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
                    placeholder="Any special requests, dietary requirements, or celebration details?"
                  ></textarea>
                  <small className="form-help">
                    Optional: Let us know about any allergies, dietary restrictions, or special occasions.
                  </small>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary btn-block ${formStatus.isSubmitting ? "disabled" : ""}`}
                  disabled={formStatus.isSubmitting}
                >
                  {formStatus.isSubmitting ? (
                    <span>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                      Sending Reservation...
                    </span>
                  ) : (
                    "Reserve Your Table"
                  )}
                </button>

                {formStatus.submitted && !formStatus.success && (
                  <div className="form-message error">
                    <i className="fas fa-exclamation-triangle"></i>
                    {formStatus.message}
                  </div>
                )}

                {formStatus.isSubmitting && (
                  <div className="form-message info">
                    <i className="fas fa-clock"></i>
                    {formStatus.message}
                  </div>
                )}

                <p className="form-disclaimer">
                  * Required fields. By submitting this form, you agree to our reservation policy. We'll confirm your
                  booking within 30 minutes during business hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
