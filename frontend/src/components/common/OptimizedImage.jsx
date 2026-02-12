import { useState } from 'react';
import { Image as ImageIcon, AlertTriangle } from '../icons';

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  fallbackSrc,
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = (e) => {
    setImageState('loaded');
    onLoad?.(e);
  };

  const handleError = (e) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageState('loading');
    } else {
      setImageState('error');
    }
    onError?.(e);
  };

  const baseClasses = "transition-opacity duration-200";
  const finalClasses = `${baseClasses} ${className}`;

  if (imageState === 'error') {
    return (
      <div 
        className={`flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt || 'Image failed to load'}
      >
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-xs">Failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageState === 'loading' && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 ${className}`}
          style={{ width, height }}
        >
          <div className="text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            <p className="text-xs">Loading...</p>
          </div>
        </div>
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`${finalClasses} ${imageState === 'loading' ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;