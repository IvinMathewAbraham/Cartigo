import { useEffect, useState } from "react";
import "./ProductGallery.css";

export default function ProductGallery({ images = [], productName = "Product" }) {
  const [selectedImage, setSelectedImage] = useState(images[0] || null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!images.length) {
    return (
      <div className="cartigo-gallery-container">
        <div className="gallery-main-viewport">
          <p className="no-image-text">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cartigo-gallery-container">
      {/* Thumbnail rail */}
      <div className="gallery-thumbnail-rail" role="tablist" aria-label="Product thumbnails">
        {images.map((img, index) => (
          <button
            key={index}
            className={`gallery-thumb-btn ${selectedImage === img ? "active" : ""}`}
            onClick={() => setSelectedImage(img)}
            role="tab"
            aria-selected={selectedImage === img}
            aria-label={`Thumbnail ${index + 1}`}
          >
            <img src={img} alt={`${productName} thumbnail ${index + 1}`} />
          </button>
        ))}
      </div>

      {/* Main 1:1 image canvas */}
      <div className="gallery-main-viewport">
        {selectedImage && (
          <img
            src={selectedImage}
            alt={productName}
            className="gallery-active-image"
          />
        )}
      </div>
    </div>
  );
}