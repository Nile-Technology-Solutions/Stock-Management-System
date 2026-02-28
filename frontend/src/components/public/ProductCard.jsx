import { Link } from 'react-router-dom';
import { Star, TrendingUp, Sparkles, ArrowRight } from '../../components/icons';

const ProductCard = ({ 
  product, 
  className = "",
  variant = "standard",
  viewMode = "grid",
  showBadges = false
}) => {
  const { id, name, category, description, image, price, isPopular, isNew, rating } = product;

  const baseClasses = viewMode === 'grid' 
    ? "group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-cyan-400/30"
    : "group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-cyan-400/30 flex";
  
  const finalClasses = `${baseClasses} ${className}`;

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${id}`} className="block">
        <div className={finalClasses}>
          {/* Image */}
          <div className="relative w-48 h-32 bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
            <img
              src={image || '/api/placeholder/400/300'}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Badges */}
            {showBadges && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {isNew && (
                  <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-medium rounded-full shadow-lg">
                    New
                  </span>
                )}
                {isPopular && (
                  <span className="px-2 py-1 bg-gradient-to-r from-cyan-400 to-sky-400 text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Category and Rating */}
              <div className="flex items-center justify-between mb-2">
                {category && (
                  <span className="inline-block px-2 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30 rounded-md">
                    {category}
                  </span>
                )}
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{rating}</span>
                  </div>
                )}
              </div>
              
              {/* Product Name */}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
                {name}
              </h3>
              
              {/* Description */}
              {description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            
            {/* Price and CTA */}
            <div className="flex items-center justify-between">
              {price && (
                <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {price}
                </span>
              )}
              <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                View Details
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/products/${id}`} className="block">
      <div className={finalClasses}>
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        
        {/* Product Image */}
        <div className="relative aspect-w-16 aspect-h-12 bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <img
            src={image || '/api/placeholder/400/300'}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Image overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          {showBadges && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && (
                <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-medium rounded-full shadow-lg animate-pulse">
                  New
                </span>
              )}
              {isPopular && (
                <span className="px-2 py-1 bg-gradient-to-r from-cyan-400 to-sky-400 text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </span>
              )}
            </div>
          )}
          
          {/* Rating badge */}
          {rating && (
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{rating}</span>
            </div>
          )}
          
          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-pulse" />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-6 relative z-10">
          {/* Category Badge */}
          {category && (
            <span className="inline-block px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30 rounded-full mb-3 border border-cyan-200 dark:border-cyan-800">
              {category}
            </span>
          )}
          
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
            {name}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            {price && (
              <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {price}
              </span>
            )}
            <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-200">
              View Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
          
          {/* Subtle glow line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-sky-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;