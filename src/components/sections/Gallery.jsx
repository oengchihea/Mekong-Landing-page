// src/components/sections/Gallery.jsx
// Remove "use client" directive and CSS import
import { useState, useEffect } from "react"

const Gallery = () => {
  // Define all gallery images in a single array
  const galleryImages = [
    {
      id: 1,
      src: "/images/signature.jpg",
      alt: "Signature Dish",
      category: "food",
    },
    {
      id: 2,
      src: "/images/tonle_mekong.jpg",
      alt: "Restaurant Interior",
      category: "interior",
    },
    {
      id: 3,
      src: "/images/season.jpg",
      alt: "Seasonal Special",
      category: "food",
    },
    {
      id: 4,
      src: "/images/chef.jpg",
      alt: "Chef in Action",
      category: "chef",
    },
    {
      id: 5,
      src: "/images/dessert.jpg",
      alt: "Dessert Platter",
      category: "food",
    },
    {
      id: 6,
      src: "/images/private.jpg",
      alt: "Private Dining Room",
      category: "interior",
    },
    {
      id: 7,
      src: "/images/food.jpg",
      alt: "Gourmet Specialty",
      category: "food",
    },
    // New images
    {
      id: 8,
      src: "/images/seafood.jpg",
      alt: "Gourmet Appetizers",
      category: "food",
    },
    {
      id: 9,
      src: "/images/setup.jpg",
      alt: "Banquet Setup",
      category: "interior",
    },
  ]

  // State for active filter and lightbox
  const [activeFilter, setActiveFilter] = useState("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter categories
  const filters = [
    { id: "all", name: "All" },
    { id: "food", name: "Food" },
    { id: "interior", name: "Interior" },
    { id: "chef", name: "Chef" },
  ]

  // Get filtered images based on active filter
  const getFilteredImages = () => {
    if (activeFilter === "all") {
      return galleryImages
    }
    return galleryImages.filter((image) => image.category === activeFilter)
  }

  // Current filtered images
  const filteredImages = getFilteredImages()

  // Handle filter button click
  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId)
  }

  // Lightbox handlers
  const openLightbox = (image) => {
    const index = filteredImages.findIndex((img) => img.id === image.id)
    setCurrentImage(image)
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.classList.add("no-scroll")
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.classList.remove("no-scroll")
  }

  const navigateLightbox = (direction) => {
    const newIndex = (currentIndex + direction + filteredImages.length) % filteredImages.length
    setCurrentIndex(newIndex)
    setCurrentImage(filteredImages[newIndex])
  }

  // Initialize animations when component mounts or filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const items = document.querySelectorAll(".gallery-item")
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("visible")
          }, index * 50)
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [activeFilter])

  // Count images in each category
  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return galleryImages.length
    return galleryImages.filter((img) => img.category === categoryId).length
  }

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        <div className="section-header text-center">
          <span className="subtitle">Visual Journey</span>
          <h2>Our Gallery</h2>
        </div>

        <div className="gallery-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.name} <span className="filter-count">({getCategoryCount(filter.id)})</span>
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => openLightbox(image)}
              data-category={image.category}
              data-id={image.id}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                onError={(e) => {
                  console.error(`Failed to load image: ${image.src}`)
                  e.target.src = "/placeholder.svg"
                }}
              />
              <div className="gallery-item-overlay">
                <div className="overlay-content">
                  <i className="fas fa-search-plus"></i>
                  <p>{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && currentImage && (
        <div className="lightbox">
          <div className="lightbox-overlay" onClick={closeLightbox}></div>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>
            <button className="lightbox-nav prev" onClick={() => navigateLightbox(-1)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <img src={currentImage.src || "/placeholder.svg"} alt={currentImage.alt} />
            <button className="lightbox-nav next" onClick={() => navigateLightbox(1)}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <p className="lightbox-caption">{currentImage.alt}</p>
            <p className="lightbox-counter">
              {currentIndex + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery