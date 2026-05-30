import { useState } from 'react';
import { getImageUrl } from '../../utils/imageHelper';

const ProductImageGallery = ({
  images = [],
  productName = "",
  className = ""
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback to placeholder if no images provided
  const processedImages = images.map(img => typeof img === 'string' ? getImageUrl(img) : getImageUrl(img?.url));
  const galleryImages = processedImages.length > 0 ? processedImages : ['/api/placeholder/600/400'];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
          <img
            src={galleryImages[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            className={`w-full h-96 object-cover transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Click to zoom
            </div>
          </div>

          {/* Image counter */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* Navigation arrows for multiple images */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-slate-700"
            >
              <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-slate-700"
            >
              <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-slate-200 dark:scrollbar-track-slate-700">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/30 scale-105'
                  : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:scale-105'
                }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedImage === index && (
                <div className="absolute inset-0 bg-cyan-400/20 backdrop-blur-[1px]" />
              )}
              {selectedImage === index && (
                <div className="absolute top-1 right-1 bg-cyan-400 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;