// src/pages/api/test-brevo.js
import * as SibApiV3Sdk from "@getbrevo/brevo"

export default async function handler(req, res) {
  try {
    // Get API key from environment variables
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const EMAIL_USER = process.env.EMAIL_USER

    // Enhanced debugging information
    console.log("==== BREVO TEST DEBUGGING ====")
    console.log("EMAIL_USER exists:", !!EMAIL_USER)
    console.log("EMAIL_USER value:", EMAIL_USER || "not set")
    console.log("BREVO_API_KEY exists:", !!BREVO_API_KEY)
    console.log("BREVO_API_KEY first 5 chars:", BREVO_API_KEY ? BREVO_API_KEY.substring(0, 5) + "..." : "not set")

    // Validate environment variables
    if (!BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "BREVO_API_KEY is not set in environment variables",
        envVars: {
          EMAIL_USER_EXISTS: !!EMAIL_USER,
          BREVO_API_KEY_EXISTS: !!BREVO_API_KEY,
        },
      })
    }

    if (!EMAIL_USER) {
      return res.status(500).json({
        success: false,
        message: "EMAIL_USER is not set in environment variables",
        envVars: {
          EMAIL_USER_EXISTS: !!EMAIL_USER,
          BREVO_API_KEY_EXISTS: !!BREVO_API_KEY,
        },
      })
    }

    console.log("Configuring Brevo API...")
    // Configure API key authorization
    const apiClient = SibApiV3Sdk.ApiClient.instance
    const apiKey = apiClient.authentications["api-key"]
    apiKey.apiKey = BREVO_API_KEY

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    console.log("Creating test email...")
    // Create a test email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = "Brevo API Test - MEKONG Restaurant"
    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h1 style="color: #e67e22;">Test Email</h1>
          <p>This is a test email from the MEKONG Restaurant reservation system using Brevo API.</p>
          <p>If you're seeing this, your email configuration is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <p>Environment: ${process.env.NODE_ENV || "unknown"}</p>
        </body>
      </html>
    `
    sendSmtpEmail.sender = { name: "MEKONG Restaurant", email: EMAIL_USER }
    sendSmtpEmail.to = [{ email: EMAIL_USER, name: "Test Recipient" }]

    console.log("Sending test email...")
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log("Email sent successfully:", data)

    return res.status(200).json({
      success: true,
      message: "Email sent successfully via Brevo API!",
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      sentTo: EMAIL_USER,
    })
  } catch (error) {
    console.error("Error sending test email:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
      details: error.response?.body || null,
    })
  }
}
