/**
 * Enhanced Video Optimization Utility
 * Simplified to focus on core functionality
 */

// Initialize video optimization
export const initVideoOptimization = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return

  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupVideos)
  } else {
    setupVideos()
  }

  // Cleanup function
  return () => {
    // Find all video elements
    const videos = document.querySelectorAll("video")

    // Remove all event listeners
    videos.forEach((video) => {
      video.removeAttribute("data-optimized")
      video.oncanplay = null
      video.onerror = null
    })
  }
}

// Set up video optimization
function setupVideos() {
  // Find all video elements
  const videos = document.querySelectorAll("video")

  if (videos.length === 0) return

  // Process each video
  videos.forEach((video) => {
    // Skip already optimized videos
    if (video.hasAttribute("data-optimized")) return

    // Mark as optimized
    video.setAttribute("data-optimized", "true")

    // Apply performance optimizations
    optimizeVideoElement(video)

    // Handle video loading events
    video.oncanplay = () => {
      // Video is ready to play
      if (isElementInViewport(video)) {
        video.play().catch((err) => console.log("Video play error:", err))
      }
    }

    // Handle errors
    video.onerror = () => {
      console.log("Video error occurred")
      // Show poster image as fallback
      if (video.poster) {
        const container = video.parentElement
        if (container) {
          container.style.backgroundImage = `url(${video.poster})`
          container.style.backgroundSize = "cover"
          container.style.backgroundPosition = "center"
        }
      }
    }
  })

  // Handle page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // When page becomes visible again, play videos in viewport
      videos.forEach((video) => {
        if (isElementInViewport(video)) {
          video.play().catch((err) => console.log("Video play error:", err))
        }
      })
    }
  })
}

// Apply performance optimizations to video element
function optimizeVideoElement(video) {
  // Ensure video attributes are set
  video.setAttribute("playsinline", "")
  video.setAttribute("muted", "")
  video.setAttribute("preload", "auto")

  // Force hardware acceleration
  video.style.transform = "translateZ(0)"
  video.style.willChange = "transform"
  video.style.backfaceVisibility = "hidden"

  // Ensure visibility
  video.style.display = "block"
  video.style.opacity = "1"
  video.style.visibility = "visible"

  // Preload video
  if (video.readyState < 2) {
    video.load()
  }
}

// Check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
}
