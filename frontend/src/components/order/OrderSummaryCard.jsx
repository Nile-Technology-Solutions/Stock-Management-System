import ImageWithFallback from './ImageWithFallback';

const OrderSummaryCard = ({ 
  product, 
  quantity = 1, 
  className = "",
  showQuantitySelector = false,
  onQuantityChange 
}) => {
  if (!product) return null;

  const handleQuantityChange = (newQuantity) => {
    if (onQuantityChange && newQuantity > 0) {
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
      
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 mb-1">{product.name}</h4>
          {product.category && (
            <span className="inline-block px-2 py-1 text-xs font-medium text-cyan-700 bg-cyan-50 rounded-md mb-2">
              {product.category}
            </span>
          )}
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          
          {/* Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Quantity:</span>
              {showQuantitySelector ? (
                <select
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm font-medium text-slate-900">{quantity}</span>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{product.price}</p>
              {quantity > 1 && (
                <p className="text-xs text-slate-500">
                  {product.price} × {quantity}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Product Info */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h5 className="text-sm font-medium text-slate-700 mb-2">Key Specifications</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </span>
                <span className="text-slate-700 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryCard;