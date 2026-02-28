import { useState } from 'react';
import { Image, AlertTriangle } from '../../components/icons';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = '/api/placeholder/400/300',
  loading = "lazy",
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
          <Image className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 ${className}`}
        {...props}
      />
      {hasError && imgSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;