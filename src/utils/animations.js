// Modify the animation function to be more defensive
export const initAnimations = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return

  const animatedElements = document.querySelectorAll(".animate-on-scroll")

  if (animatedElements.length === 0) return

  const animateOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8

    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top

      if (elementTop < triggerBottom) {
        element.classList.add("animated")
      }
    })
  }

  // Run once on load
  animateOnScroll()

  // Add scroll event listener
  window.addEventListener("scroll", animateOnScroll)

  // Clean up function
  return () => {
    window.removeEventListener("scroll", animateOnScroll)
  }
}
