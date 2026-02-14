const Skeleton = ({ 
  className = "", 
  variant = "text",
  width,
  height,
  rounded = true,
  animate = true
}) => {
  const variants = {
    text: 'h-4 bg-slate-200 dark:bg-slate-700',
    title: 'h-8 bg-slate-200 dark:bg-slate-700',
    heading: 'h-10 bg-slate-200 dark:bg-slate-700',
    avatar: 'w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full',
    circle: 'rounded-full bg-slate-200 dark:bg-slate-700',
    image: 'w-full aspect-square bg-slate-200 dark:bg-slate-700',
    rectangle: 'w-full bg-slate-200 dark:bg-slate-700',
    button: 'h-10 w-24 bg-slate-200 dark:bg-slate-700',
  };

  const roundedClass = rounded && variant !== 'avatar' && variant !== 'circle' ? 'rounded' : '';
  const animateClass = animate ? 'animate-pulse' : '';
  
  const widthStyle = width ? { width } : {};
  const heightStyle = height ? { height } : {};
  const style = { ...widthStyle, ...heightStyle };

  return (
    <div 
      className={`${variants[variant]} ${roundedClass} ${animateClass} ${className}`}
      style={style}
      aria-hidden="true"
      role="status"
      aria-label="Loading..."
    />
  );
};

export default Skeleton;
