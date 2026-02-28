const ProductCardSkeleton = ({ className = "" }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-3">
        {/* Category Badge Skeleton */}
        <div className="w-16 h-5 bg-slate-200 rounded-md animate-pulse"></div>
        
        {/* Title Skeleton */}
        <div className="w-3/4 h-6 bg-slate-200 rounded animate-pulse"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-200 rounded animate-pulse"></div>
          <div className="w-2/3 h-4 bg-slate-200 rounded animate-pulse"></div>
        </div>
        
        {/* Price Skeleton */}
        <div className="flex justify-between items-center pt-2">
          <div className="w-20 h-6 bg-slate-200 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;