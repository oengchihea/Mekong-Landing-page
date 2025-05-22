// lib/contact.js
export async function submitReservation(formData) {
  try {
    console.log("Submitting reservation with data:", formData)

    // First, try the direct method which might be more reliable
    const directResponse = await fetch("/api/send-email-direct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const directData = await directResponse.json()

    // If direct method succeeds, return the result
    if (directResponse.ok) {
      console.log("Direct email method succeeded:", directData)
      return directData
    }

    console.log("Direct method failed, trying standard method...")
    console.log("Direct method error:", directData)

    // If direct method fails, try the standard method
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Both email methods failed. Standard method error:", data)
      throw new Error(data.message || "Failed to submit reservation")
    }

    console.log("Standard email method succeeded:", data)
    return data
  } catch (error) {
    console.error("Error submitting reservation:", error)
    throw error
  }
}

/**
 * Tests the email configuration
 * @returns {Promise<Object>} - The response from the API
 */
export async function testEmailConfig() {
  try {
    const response = await fetch("/api/test-brevo", {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to test email configuration")
    }

    return data
  } catch (error) {
    console.error("Error testing email configuration:", error)
    throw error
  }
}
