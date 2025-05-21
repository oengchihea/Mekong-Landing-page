// src/pages/api/send-email-direct.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  // Debug logging
  console.log("==== EMAIL DEBUGGING (DIRECT) ====")
  console.log("EMAIL_USER:", process.env.EMAIL_USER)
  console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY)
  console.log(
    "BREVO_API_KEY first 10 chars:",
    process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) : "none",
  )

  try {
    const { name, email, phone, date, time, guests, message } = req.body

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and phone number",
      })
    }

    // If API key is not configured, use mock mode
    if (!process.env.BREVO_API_KEY || !process.env.EMAIL_USER) {
      console.log("MOCK MODE: Would send email with the following data:", {
        name,
        email,
        phone,
        date: date ? new Date(date).toLocaleDateString() : "Not specified",
        time: time || "Not specified",
        guests,
        message: message || "None",
      })

      return res.status(200).json({
        success: true,
        message:
          "Thank you! Your reservation request has been received. We will contact you shortly to confirm. (MOCK MODE)",
      })
    }

    // Format the date for better readability
    const formattedDate = date ? new Date(date).toLocaleDateString() : "Not specified"

    // Format the time for better readability
    const formattedTime = time || "Not specified"

    // Helper function to send email using Brevo API directly
    async function sendEmailDirect(options) {
      try {
        console.log(`Preparing to send email to: ${options.to}`)

        // Create email data
        const emailData = {
          sender: { name: options.senderName || "MEKONG Restaurant", email: process.env.EMAIL_USER },
          to: [{ email: options.to, name: options.toName || options.to }],
          subject: options.subject,
          htmlContent: options.html,
        }

        if (options.text) {
          emailData.textContent = options.text
        }

        console.log("Email configuration complete, sending now...")

        // Send email using fetch API
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify(emailData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`)
        }

        const result = await response.json()
        console.log("Email sent successfully:", JSON.stringify(result))
        return result
      } catch (error) {
        console.error("Error sending email with Brevo:", error)
        throw error
      }
    }

    // Create a nicely formatted HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">New Reservation Request - MEKONG Restaurant</h1>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #333;">Customer Information</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h2 style="color: #333;">Reservation Details</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Number of Guests:</strong> ${guests}</p>
          <p><strong>Special Requests:</strong> ${message || "None"}</p>
        </div>
        
        <div style="margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          <p>This reservation was submitted through the MEKONG Restaurant website.</p>
        </div>
      </div>
    `

    // Plain text version
    const textContent = `
      New Reservation Request - MEKONG Restaurant
      
      Customer Information:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      
      Reservation Details:
      Date: ${formattedDate}
      Time: ${formattedTime}
      Number of Guests: ${guests}
      Special Requests: ${message || "None"}
      
      This reservation was submitted through the MEKONG Restaurant website.
    `

    // Generate a unique confirmation code for this reservation
    const confirmationCode = "MK-" + Math.random().toString(36).substring(2, 8).toUpperCase()

    // Create confirmation email for customer
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">Reservation Confirmation - MEKONG Restaurant</h1>
        
        <div style="margin: 20px 0;">
          <p>Dear ${name},</p>
          <p>Thank you for choosing MEKONG Restaurant. Your reservation has been received and is being processed.</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h2 style="color: #333;">Your Reservation Details</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Number of Guests:</strong> ${guests}</p>
          <p><strong>Confirmation Code:</strong> ${confirmationCode}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <p>If you need to modify or cancel your reservation, please contact us at:</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Email: reservations@mekong.com</p>
        </div>
        
        <div style="margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          <p>We look forward to serving you at MEKONG Restaurant!</p>
        </div>
      </div>
    `

    // Confirmation email plain text
    const confirmationText = `
      Reservation Confirmation - MEKONG Restaurant
      
      Dear ${name},
      
      Thank you for choosing MEKONG Restaurant. Your reservation has been received and is being processed.
      
      Your Reservation Details:
      Date: ${formattedDate}
      Time: ${formattedTime}
      Number of Guests: ${guests}
      Confirmation Code: ${confirmationCode}
      
      If you need to modify or cancel your reservation, please contact us at:
      Phone: +1 (555) 123-4567
      Email: reservations@mekong.com
      
      We look forward to serving you at MEKONG Restaurant!
    `

    console.log("Sending notification email to restaurant...")
    // Send notification to restaurant
    await sendEmailDirect({
      to: process.env.EMAIL_USER,
      subject: `New Reservation Request from ${name}`,
      html: htmlContent,
      text: textContent,
      senderName: "MEKONG Restaurant",
    })

    console.log("Sending confirmation email to customer...")
    // Send confirmation to customer
    try {
      await sendEmailDirect({
        to: email,
        toName: name,
        subject: "Your Reservation at MEKONG Restaurant is Confirmed",
        html: confirmationHtml,
        text: confirmationText,
        senderName: "MEKONG Restaurant",
      })
    } catch (confirmError) {
      console.error("Error sending confirmation email:", confirmError)
      // Continue even if confirmation email fails
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Thank you! Your reservation request has been received. We will contact you shortly to confirm.",
      confirmationCode: confirmationCode,
    })
  } catch (error) {
    console.error("Error processing reservation:", error)

    // Return error response
    return res.status(500).json({
      success: false,
      message: "There was an error submitting your reservation. Please try again or call us directly.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
