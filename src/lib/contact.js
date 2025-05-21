// src/lib/contact.js
export async function submitReservation(formData) {
  try {
    // Make an API call to your Next.js API route
    const response = await fetch("/api/send-email", {
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
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending email:", error);

    // Return error response
    return {
      success: false,
      message: "There was an error submitting your reservation. Please try again or call us directly.",
    };
  }
}