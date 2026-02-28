const ProductSpecs = ({ 
  specifications = {}, 
  className = "" 
}) => {
  const specEntries = Object.entries(specifications);
  
  if (specEntries.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Specifications</h3>
      
      <div className="space-y-3">
        {specEntries.map(([key, value]) => (
          <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
            <span className="text-sm font-medium text-slate-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <span className="text-sm text-slate-900 font-medium">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecs;