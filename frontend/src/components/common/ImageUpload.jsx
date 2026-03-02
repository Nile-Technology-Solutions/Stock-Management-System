import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from '../icons';

/**
 * ImageUpload Component
 * Handles image preview and upload with temporary storage
 * Easy to integrate with backend later
 */
const ImageUpload = ({ 
  images = [], 
  onChange, 
  maxImages = 5,
  label = "Product Images"
}) => {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState(images);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (previews.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Convert files to base64 for temporary storage
    const newPreviews = [];
    let processed = 0;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          id: Date.now() + processed,
          url: reader.result, // base64 string
          file: file,
          name: file.name
        });
        processed++;

        if (processed === files.length) {
          const updated = [...previews, ...newPreviews];
          setPreviews(updated);
          if (onChange) onChange(updated);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        <span className="text-slate-400 text-xs ml-2">(Max {maxImages})</span>
      </label>

      <div className="grid grid-cols-3 gap-3">
        {/* Preview existing images */}
        {previews.map((preview, idx) => (
          <div key={preview.id || idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
            <img 
              src={preview.url} 
              alt={preview.name || `Preview ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-[10px] truncate">{preview.name || 'Image'}</p>
            </div>
          </div>
        ))}

        {/* Upload button */}
        {previews.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500 transition-colors bg-slate-50 dark:bg-slate-900"
          >
            <Upload className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-2 uppercase tracking-wider">Add Image</span>
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {previews.length === 0 && (
        <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
          <ImageIcon className="w-4 h-4" />
          <span>No images uploaded yet</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
