// src/pages/api/check-env.js
export default function handler(req, res) {
  // This endpoint checks if environment variables are set
  // and returns their status (but not their values for security)

  const hasBrevoApiKey = !!process.env.BREVO_API_KEY
  const hasEmailUser = !!process.env.EMAIL_USER

  // Only return a masked version of the email for verification
  let emailUser = null
  if (hasEmailUser && process.env.EMAIL_USER) {
    const parts = process.env.EMAIL_USER.split("@")
    if (parts.length === 2) {
      const username = parts[0]
      const domain = parts[1]
      // Mask the username part except first and last character
      const maskedUsername =
        username.length > 2
          ? `${username[0]}${"*".repeat(username.length - 2)}${username[username.length - 1]}`
          : username
      emailUser = `${maskedUsername}@${domain}`
    }
  }

  res.status(200).json({
    hasBrevoApiKey,
    hasEmailUser,
    emailUser,
  })
}