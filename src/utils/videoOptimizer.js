/**
 * Enhanced Video Optimization Utility
 * Ensures smooth playback of background videos during scrolling
 * with frequent reloading for a more dynamic experience
 */

// Initialize video optimization for all background videos
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
    const videos = document.querySelectorAll(".video-element")

    // Remove all event listeners and observers
    videos.forEach((video) => {
      video.removeAttribute("data-optimized")
      video.removeAttribute("data-last-reload")
      video.oncanplay = null
      video.oncanplaythrough = null
      video.onerror = null
    })

    // Clear any scroll timers
    if (window._videoScrollTimer) {
      clearTimeout(window._videoScrollTimer)
    }
  }
}

// Set up video optimization
function setupVideos() {
  // Find all video elements
  const videos = document.querySelectorAll(".video-element")

  if (videos.length === 0) return

  // Store last scroll position to detect direction
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop

  // Create a single IntersectionObserver for all videos
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target

        // When video enters viewport
        if (entry.isIntersecting) {
          // Play video if it's paused
          if (video.paused && video.readyState >= 2) {
            video.play().catch((err) => console.log("Video play error:", err))
          }
        }
      })
    },
    {
      threshold: 0.1, // Trigger when at least 10% of the video is visible
      rootMargin: "100px 0px", // Start loading 100px before video enters viewport
    },
  )

  // Process each video
  videos.forEach((video) => {
    // Skip already optimized videos
    if (video.hasAttribute("data-optimized")) return

    // Mark as optimized
    video.setAttribute("data-optimized", "true")
    video.setAttribute("data-last-reload", Date.now().toString())

    // Apply performance optimizations
    optimizeVideoElement(video)

    // Start observing
    observer.observe(video)

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
      video.poster && (video.style.backgroundImage = `url(${video.poster})`)
    }
  })

  // Handle scroll events for frequent reloading
  const handleScroll = () => {
    // Throttle scroll events
    if (window._videoScrollTimer) return

    window._videoScrollTimer = setTimeout(() => {
      // Get current scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Determine scroll direction
      const scrollingDown = scrollTop > lastScrollTop
      lastScrollTop = scrollTop

      // Process videos that are in viewport
      videos.forEach((video) => {
        if (!isElementInViewport(video)) return

        const lastReload = Number.parseInt(video.getAttribute("data-last-reload") || "0")
        const now = Date.now()

        // Check if it's time to reload (1 second since last reload)
        if (now - lastReload > 1000) {
          // 1 second
          // Save current time and volume
          const currentTime = video.currentTime
          const volume = video.volume

          // Determine new time based on scroll direction
          let newTime
          if (scrollingDown) {
            // When scrolling down, jump forward slightly
            newTime = (currentTime + 0.5) % video.duration
          } else {
            // When scrolling up, jump backward slightly
            newTime = (currentTime - 0.5 + video.duration) % video.duration
          }

          // Apply the new time
          video.currentTime = newTime

          // Restore volume
          video.volume = volume

          // Ensure it's playing
          if (video.paused) {
            video.play().catch((err) => console.log("Video play error:", err))
          }

          // Update last reload time
          video.setAttribute("data-last-reload", now.toString())
        }
      })

      window._videoScrollTimer = null
    }, 50) // Reduced throttle to 50ms for more responsiveness
  }

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll)

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

  // Optimize for mobile
  if (window.innerWidth <= 768) {
    // Slightly reduce quality for better performance on mobile
    video.style.filter = "blur(0.5px)"
    video.style.opacity = "0.95"
  }

  // Preload video
  if (video.readyState < 2) {
    // HAVE_CURRENT_DATA or less
    video.load()
  }
}

// Check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
}
