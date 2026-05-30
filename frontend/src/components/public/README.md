# Public Components

This directory contains reusable components specifically designed for the public-facing interface of AddHomes Creative Woodworks. All components follow a modern design system with subtle glassmorphism accents.

## Components

### ProductCard
A card component for displaying product information in grid layouts.

**Props:**
- `product` (object): Product data including id, name, category, description, price, image
- `className` (string): Additional CSS classes
- `variant` (string): Card variant (default: "standard")

**Usage:**
```jsx
<ProductCard product={productData} />
```

### CategoryFilter
A filter component for product categories with glassmorphism styling.

**Props:**
- `categories` (array): List of available categories
- `selectedCategory` (string): Currently selected category
- `onCategoryChange` (function): Callback when category changes
- `className` (string): Additional CSS classes

### ProductImageGallery
An image gallery component with thumbnail navigation.

**Props:**
- `images` (array): Array of image URLs
- `productName` (string): Product name for alt text
- `className` (string): Additional CSS classes

### ProductSpecs
A specifications display component for product details.

**Props:**
- `specifications` (object): Key-value pairs of product specifications
- `className` (string): Additional CSS classes

### SearchInput
A search input component with debounced search functionality.

**Props:**
- `onSearch` (function): Callback function for search
- `placeholder` (string): Input placeholder text
- `className` (string): Additional CSS classes

### ProductCardSkeleton
A loading skeleton for product cards to improve perceived performance.

**Props:**
- `className` (string): Additional CSS classes

### PublicWrapper
A layout wrapper component for consistent spacing and styling.

**Props:**
- `children` (ReactNode): Child components
- `className` (string): Additional CSS classes
- `maxWidth` (string): Maximum width constraint
- `padding` (string): Padding variant

## Design Principles

All components follow the Neo-Enterprise design system:

- **80% Neo-Enterprise**: Clean, professional, business-appropriate
- **20% Glassmorphism**: Subtle glass effects for modern touch
- **Performance-focused**: Optimized for fast loading and smooth interactions
- **Accessible**: WCAG compliant with proper contrast and keyboard navigation
- **Responsive**: Mobile-first design that scales across all devices

## Usage Guidelines

1. Always import components from the index file for consistency
2. Use glassmorphism sparingly - only where specified in design system
3. Maintain proper contrast ratios for accessibility
4. Test components across different screen sizes
5. Follow the established color palette and typography scale