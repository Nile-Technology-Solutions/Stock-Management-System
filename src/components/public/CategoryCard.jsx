import { Link } from 'react-router-dom';
import { ArrowRight } from '../../components/icons';

const CategoryCard = ({ category, className = "" }) => {
  return (
    <Link
      to={`/products?category=${category.name}`}
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700 hover:border-cyan-400/30 ${className}`}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      {/* Image container */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category icon overlay */}
        <div className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          {category.icon && (
            <category.icon className="w-5 h-5 text-cyan-600" />
          )}
        </div>
        
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-pulse" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors duration-200">
            {category.name}
          </h3>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {category.description}
        </p>
        
        {/* Subtle glow line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-sky-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      </div>
    </Link>
  );
};

export default CategoryCard;