/**
 * Utility function to handle smooth scrolling
 * @param {string} targetId - The ID of the target element to scroll to
 * @param {number} offset - Optional offset from the top (e.g., for fixed headers)
 */
export const scrollToElement = (targetId, offset = 0) => {
  const targetElement = document.getElementById(targetId)

  if (targetElement) {
    const targetPosition = targetElement.offsetTop - offset

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })

    // Update URL without page jump
    window.history.pushState(null, null, `#${targetId}`)
  }
}

/**
 * Initialize smooth scrolling for all anchor links on the page
 * @param {number} headerOffset - Offset for the fixed header
 */
export const initSmoothScroll = (headerOffset = 0) => {
  if (typeof window === "undefined") return

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)

      // Get dynamic header height if no offset provided
      let offset = headerOffset
      if (offset === 0 && document.querySelector(".site-header")) {
        offset = document.querySelector(".site-header").offsetHeight
      }

      scrollToElement(targetId, offset)
    })
  })
}
