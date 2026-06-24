import { useEffect, useState } from "react";
import "./ProductGallery.css";

export default function ProductGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(
    images[0] || null
  );



  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!images.length) {
    return (
      <div className="gallery-container">
        <div className="main-image">
          <p>No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="thumbnail-list">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Product ${index + 1}`}
            className={`thumbnail ${selectedImage === img ? "active" : ""
              }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      <div className="main-image">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Product"
          />
        )}
      </div>
    </div>
  );
}