import { useState } from 'react';

const ProductImageGallery = ({ 
  images = [], 
  productName = "",
  className = "" 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Fallback to placeholder if no images provided
  const galleryImages = images.length > 0 ? images : ['/api/placeholder/600/400'];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="aspect-w-16 aspect-h-12 bg-slate-100 rounded-xl overflow-hidden">
        <img
          src={galleryImages[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-96 object-cover"
        />
      </div>
      
      {/* Thumbnail Navigation */}
      {galleryImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === index
                  ? 'border-cyan-400 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;