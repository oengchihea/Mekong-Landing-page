// src/pages/test-email.js
"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { testEmailConfig } from "../lib/contact"

export default function TestEmail() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [envVars, setEnvVars] = useState({
    hasBrevoApiKey: false,
    hasEmailUser: false,
    emailUser: null,
  })

  // Check environment variables on the server side
  useEffect(() => {
    async function checkEnvVars() {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()
        setEnvVars(data)
      } catch (err) {
        console.error("Failed to check environment variables:", err)
      }
    }

    checkEnvVars()
  }, [])

  const handleTestEmail = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await testEmailConfig()
      setResult(data)
    } catch (err) {
      setError({ message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Head>
        <title>Email Configuration Test - MEKONG Restaurant</title>
      </Head>

      <h1 style={{ color: "#e67e22", borderBottom: "2px solid #e67e22", paddingBottom: "10px" }}>
        Email Configuration Test
      </h1>

      <div style={{ marginTop: "20px" }}>
        <p>
          This page helps you test if your email configuration is working correctly. Click the button below to send a
          test email.
        </p>

        <button
          onClick={handleTestEmail}
          disabled={loading}
          style={{
            backgroundColor: "#e67e22",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Sending Test Email..." : "Send Test Email"}
        </button>

        {result && (
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f8f0", borderRadius: "5px" }}>
            <h2 style={{ color: "#2e7d32" }}>Success!</h2>
            <p>Email was sent successfully.</p>
            <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px", overflow: "auto" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff0f0", borderRadius: "5px" }}>
            <h2 style={{ color: "#d32f2f" }}>Error</h2>
            <p>{error.message || "An unknown error occurred"}</p>
            {error.details && (
              <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px", overflow: "auto" }}>
                {JSON.stringify(error.details, null, 2)}
              </pre>
            )}
            <div style={{ marginTop: "15px" }}>
              <h3>Troubleshooting Steps:</h3>
              <ul>
                <li>Check if your BREVO_API_KEY is set correctly in Vercel environment variables</li>
                <li>Check if your EMAIL_USER is set correctly in Vercel environment variables</li>
                <li>Verify that your Brevo account is active and has email sending permissions</li>
                <li>Check Vercel logs for more detailed error information</li>
              </ul>
            </div>
          </div>
        )}

        <div style={{ marginTop: "30px", borderTop: "1px solid #e0e0e0", paddingTop: "20px" }}>
          <h3>Environment Variables Status:</h3>
          <p>This information is only visible to administrators and helps diagnose configuration issues.</p>
          <ul>
            <li>
              <strong>BREVO_API_KEY:</strong> {envVars.hasBrevoApiKey ? "✅ Set" : "❌ Not set"}
              <br />
              <small>
                {envVars.hasBrevoApiKey
                  ? "The API key is configured. If emails are not sending, the key might be invalid."
                  : "The API key is not configured. Add it to your Vercel environment variables."}
              </small>
            </li>
            <li>
              <strong>EMAIL_USER:</strong> {envVars.hasEmailUser ? "✅ Set" : "❌ Not set"}
              <br />
              <small>
                {envVars.hasEmailUser
                  ? `Email is configured as: ${envVars.emailUser}`
                  : "The email address is not configured. Add it to your Vercel environment variables."}
              </small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}