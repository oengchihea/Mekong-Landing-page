"use client"

import { useState, useEffect } from "react"

const Gallery = () => {
  // Featured gallery items with detailed information
  const galleryItems = [
    {
      id: 1,
      title: "SIGNATURE DISHES",
      description:
        "Discover our most celebrated dishes that showcase the authentic flavors of Cambodia. Each dish is carefully crafted using traditional techniques passed down through generations, combined with modern presentation to create an unforgettable dining experience.",
      location: "SIEM REAP",
      established: "SINCE 2010",
      number: "01",
      mainImage: "/images/signature.jpg",
      category: "food",
      images: ["/images/signature.jpg", "/images/season.jpg", "/images/dessert.jpg", "/images/food.jpg"],
    },
    {
      id: 2,
      title: "AUTHENTIC AMBIANCE",
      description:
        "Step into our thoughtfully designed space that blends traditional Cambodian architecture with contemporary comfort. Every corner tells a story of our heritage while providing the perfect setting for memorable dining experiences.",
      location: "CAMBODIA",
      established: "HERITAGE",
      number: "02",
      mainImage: "/images/tonle_mekong.jpg",
      category: "interior",
      images: ["/images/tonle_mekong.jpg", "/images/private.jpg", "/images/setup.jpg"],
    },
    {
      id: 3,
      title: "CHEF'S MASTERY",
      description:
        "Meet our talented culinary team who bring passion and expertise to every dish. With years of experience in traditional Cambodian cuisine, our chefs create innovative interpretations of classic recipes.",
      location: "KITCHEN",
      established: "DAILY",
      number: "03",
      mainImage: "/images/chef.jpg",
      category: "chef",
      images: ["/images/chef.jpg", "/images/seafood.jpg"],
    },
  ]

  const [activeItem, setActiveItem] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)

  const currentGallery = galleryItems[activeItem]

  // Handle gallery navigation
  const handleGalleryChange = (index) => {
    setActiveItem(index)
  }

  // Lightbox handlers
  const openLightbox = (imageSrc) => {
    setCurrentImage(imageSrc)
    setLightboxOpen(true)
    document.body.classList.add("no-scroll")
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentImage(null)
    document.body.classList.remove("no-scroll")
  }

  // Initialize animations
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".gallery-animate")
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("visible")
        }, index * 100)
      })
    }, 200)

    return () => clearTimeout(timer)
  }, [activeItem])

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        {/* Gallery Header */}
        <div className="gallery-header gallery-animate">
          <h2 className="gallery-title">
            OUR
            <br />
            <span className="gallery-title-accent">GALLERY</span>
          </h2>
        </div>

        {/* Gallery Navigation */}
        <div className="gallery-navigation gallery-animate">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              className={`gallery-nav-btn ${activeItem === index ? "active" : ""}`}
              onClick={() => handleGalleryChange(index)}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Main Gallery Content */}
        <div className="gallery-content">
          {/* Left Side - Main Image */}
          <div className="gallery-main-image gallery-animate">
            <img
              src={currentGallery.mainImage || "/placeholder.svg"}
              alt={currentGallery.title}
              onClick={() => openLightbox(currentGallery.mainImage)}
            />
            <div className="image-overlay" onClick={() => openLightbox(currentGallery.mainImage)}>
              <i className="fas fa-search-plus"></i>
            </div>
          </div>

          {/* Center - Project Details */}
          <div className="gallery-details gallery-animate">
            <h3 className="project-title">{currentGallery.title}</h3>
            <p className="project-description">{currentGallery.description}</p>

            <div className="project-meta">
              <div className="meta-item">
                <span className="meta-label">LOCATION</span>
                <span className="meta-value">{currentGallery.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">ESTABLISHED</span>
                <span className="meta-value">{currentGallery.established}</span>
              </div>
            </div>
          </div>

          {/* Right Side - Project Number and Gallery Grid */}
          <div className="gallery-sidebar">
            <div className="project-number gallery-animate">{currentGallery.number}</div>

            {/* Image Mosaic */}
            <div className="gallery-mosaic gallery-animate">
              {currentGallery.images.map((image, index) => (
                <div key={index} className={`mosaic-item mosaic-item-${index + 1}`} onClick={() => openLightbox(image)}>
                  <img src={image || "/placeholder.svg"} alt={`${currentGallery.title} ${index + 1}`} />
                  <div className="mosaic-overlay">
                    <i className="fas fa-expand"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Indicators */}
        <div className="gallery-indicators gallery-animate">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              className={`indicator ${activeItem === index ? "active" : ""}`}
              onClick={() => handleGalleryChange(index)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div className="lightbox">
          <div className="lightbox-overlay" onClick={closeLightbox}></div>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>
            <img src={currentImage || "/placeholder.svg"} alt="Gallery Image" />
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery
