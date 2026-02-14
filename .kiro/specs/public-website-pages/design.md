# Design Document: Public Website Pages

## Overview

This design document outlines the implementation approach for five public-facing pages of the SMS Nile Tech furniture e-commerce platform: Home, Products Listing, Product Detail, Order Placement, and News. The implementation leverages the existing React component library, Tailwind CSS styling system, and glass-morphism design language established in the authentication pages.

The design follows a component-based architecture where each page is composed of reusable components from the existing library (Button, Card, GlassCard, Modal, SearchInput, OptimizedImage, etc.) and specialized components (ProductCard, OrderForm). All pages support responsive layouts, dark/light themes, and performance optimizations including lazy loading and skeleton states.

## Architecture

### Technology Stack
- **Frontend Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks (useState, useEffect, useContext)
- **Authentication**: Existing AuthContext
- **Icons**: Custom icon component library

### Page Structure

Each page follows a consistent structure:

```
Page Component
├── Layout Wrapper (responsive container)
├── Header/Navigation (if needed)
├── Main Content Area
│   ├── Glass Cards for sections
│   ├── Reusable components
│   └── Skeleton states during loading
└── Footer (if needed)
```

### Design Patterns

1. **Container/Presentational Pattern**: Pages act as containers managing state and data fetching, while components handle presentation
2. **Composition Pattern**: Complex UIs built by composing smaller, reusable components
3. **Render Props/Hooks**: Shared logic extracted into custom hooks
4. **Lazy Loading**: Images and heavy components loaded on-demand
5. **Optimistic UI**: Immediate feedback for user actions with skeleton states

## Components and Interfaces

### 1. Home Page Component

**File**: `frontend/src/pages/public/Home.jsx`

**Purpose**: Landing page showcasing hero section, featured products, and category navigation

**Component Structure**:
```jsx
Home
├── HeroSection
│   ├── GlassCard (hero content)
│   ├── Heading and description
│   └── CTA Buttons (Browse Products, View Categories)
├── FeaturedProductsSection
│   ├── Section heading
│   └── ProductCard grid (3-4 featured items)
├── CategoriesSection
│   ├── Section heading
│   └── Category cards with images and links
└── Footer/CTA Section
```

**State Management**:
- `featuredProducts`: Array of product objects
- `categories`: Array of category objects
- `loading`: Boolean for skeleton state

**Key Features**:
- Animated hero section with glass-morphism effects
- Responsive grid layouts (1 column mobile, 2-3 columns tablet, 3-4 columns desktop)
- Skeleton states during data loading
- Smooth scroll animations
- Category cards with hover effects

### 2. Products Listing Page Component

**File**: `frontend/src/pages/public/Products.jsx`

**Purpose**: Display all products with search, filtering, and view mode toggle

**Component Structure**:
```jsx
Products
├── PageHeader
│   ├── Title and description
│   └── SearchInput component
├── FilterBar
│   ├── Category Select dropdown
│   ├── Sort Select dropdown
│   └── View mode toggle (grid/list)
├── ProductsGrid/List
│   ├── ProductCard components (grid or list mode)
│   └── ProductCardSkeleton during loading
└── EmptyState (when no results)
```

**State Management**:
- `products`: Array of all product objects
- `filteredProducts`: Array of filtered product objects
- `searchQuery`: String for search input
- `selectedCategory`: String for category filter
- `sortBy`: String for sort option
- `viewMode`: String ('grid' or 'list')
- `loading`: Boolean for skeleton state

**Key Features**:
- Real-time search filtering
- Category and sort filtering
- Grid/list view toggle with smooth transitions
- Responsive layouts
- Skeleton states with ProductCardSkeleton
- EmptyState for no results
- Maintains filter state in URL params

**Filtering Logic**:
```javascript
const filterProducts = (products, searchQuery, category, sortBy) => {
  let filtered = products;
  
  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Category filter
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  // Sort
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return filtered;
};
```

### 3. Product Detail Page Component

**File**: `frontend/src/pages/public/ProductDetail.jsx`

**Purpose**: Display detailed product information with image gallery and order CTA

**Component Structure**:
```jsx
ProductDetail
├── Breadcrumb navigation
├── ProductImageGallery
│   ├── Main image display (OptimizedImage)
│   └── Thumbnail navigation
├── ProductInfo (GlassCard)
│   ├── Product name and category badge
│   ├── Price display
│   ├── Description
│   ├── Specifications list
│   └── Order button
├── RelatedProducts
│   ├── Section heading
│   └── ProductCard grid (3-4 items)
└── BackButton
```

**State Management**:
- `product`: Object with product details
- `selectedImage`: String URL of currently displayed image
- `relatedProducts`: Array of related product objects
- `loading`: Boolean for skeleton state

**Key Features**:
- Image gallery with thumbnail navigation
- Click thumbnail to change main image
- Responsive layout (stacked on mobile, side-by-side on desktop)
- OptimizedImage with lazy loading and fallback
- Related products section
- Order button navigates to order placement with product ID
- Breadcrumb navigation

**Image Gallery Logic**:
```javascript
const ImageGallery = ({ images, selectedImage, onImageSelect }) => {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-w-16 aspect-h-12 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
        <OptimizedImage
          src={selectedImage}
          alt="Product"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onImageSelect(img)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === img 
                ? 'border-cyan-400 ring-2 ring-cyan-400/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400/50'
            }`}
          >
            <OptimizedImage
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 4. Order Placement Page Component

**File**: `frontend/src/pages/public/OrderPlacement.jsx`

**Purpose**: Allow users to place orders with product summary and customer information form

**Component Structure**:
```jsx
OrderPlacement
├── PageHeader
├── TwoColumnLayout (responsive)
│   ├── ProductSummary (GlassCard)
│   │   ├── Product image
│   │   ├── Product name
│   │   ├── Product price
│   │   └── Quantity selector
│   └── OrderForm component
└── BackButton
```

**State Management**:
- `product`: Object with product details
- `quantity`: Number for order quantity
- `loading`: Boolean for form submission
- `orderSuccess`: Boolean for success state

**Key Features**:
- Pre-populated product information from URL params
- OrderForm component with validation
- Product summary card with image and details
- Quantity selector
- Responsive layout (stacked on mobile, side-by-side on desktop)
- Success modal/page after order submission
- Integration with existing OrderForm component

**Order Submission Flow**:
```javascript
const handleOrderSubmit = async (formData) => {
  setLoading(true);
  try {
    const orderData = {
      product: product,
      quantity: quantity,
      customer: formData,
      totalPrice: product.price * quantity,
      orderDate: new Date().toISOString()
    };
    
    // API call to create order
    const response = await createOrder(orderData);
    
    setOrderSuccess(true);
    // Navigate to success page or show modal
    navigate(`/order-success/${response.orderId}`);
  } catch (error) {
    setError('Failed to place order. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### 5. News Page Component

**File**: `frontend/src/pages/public/News.jsx`

**Purpose**: Display news articles and company updates

**Component Structure**:
```jsx
News
├── PageHeader
│   ├── Title and description
│   └── SearchInput (optional)
├── NewsGrid
│   ├── NewsCard components
│   │   ├── Featured image (OptimizedImage)
│   │   ├── Title
│   │   ├── Excerpt
│   │   ├── Date
│   │   └── Read more link
│   └── SkeletonCard during loading
└── EmptyState (when no articles)
```

**State Management**:
- `articles`: Array of news article objects
- `loading`: Boolean for skeleton state
- `selectedArticle`: Object for modal/detail view (optional)

**Key Features**:
- Grid layout for article cards (1 column mobile, 2 columns tablet, 3 columns desktop)
- Card or GlassCard components for articles
- OptimizedImage for article featured images
- Date formatting
- Excerpt truncation
- Click to view full article (modal or separate page)
- SkeletonCard during loading
- EmptyState when no articles

**Article Card Structure**:
```jsx
const NewsCard = ({ article }) => {
  return (
    <GlassCard className="group cursor-pointer hover:shadow-xl transition-all duration-300">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <OptimizedImage
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {formatDate(article.date)}
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 line-clamp-3">
          {article.excerpt}
        </p>
        <Link 
          to={`/news/${article.id}`}
          className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 font-medium"
        >
          Read More
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </GlassCard>
  );
};
```

### Shared Components and Utilities

#### Custom Hooks

**useProducts Hook**:
```javascript
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // API call or mock data
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return { products, loading, error };
};
```

**useProductDetail Hook**:
```javascript
const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);
  
  return { product, loading, error };
};
```

#### Utility Functions

**formatPrice**:
```javascript
const formatPrice = (price) => {
  if (typeof price === 'string' && price.includes('$')) {
    return price;
  }
  return `$${parseFloat(price).toFixed(2)}`;
};
```

**formatDate**:
```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

**truncateText**:
```javascript
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
```

## Data Models

### Product Model

```javascript
{
  id: string | number,
  name: string,
  category: string,
  description: string,
  price: string | number,
  images: string[], // Array of image URLs
  image: string, // Primary image URL (for backward compatibility)
  specifications: {
    material: string,
    dimensions: string,
    weight: string,
    color: string,
    // ... other specs
  },
  isPopular: boolean,
  isNew: boolean,
  rating: number,
  stock: number,
  relatedProductIds: (string | number)[]
}
```

### Order Model

```javascript
{
  id: string | number,
  productId: string | number,
  product: Product,
  quantity: number,
  customer: {
    fullName: string,
    phoneNumber: string,
    email: string,
    deliveryLocation: string,
    additionalNotes: string
  },
  totalPrice: number,
  orderDate: string, // ISO date string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
}
```

### News Article Model

```javascript
{
  id: string | number,
  title: string,
  excerpt: string,
  content: string,
  image: string, // Featured image URL
  author: string,
  date: string, // ISO date string
  category: string,
  tags: string[]
}
```

### Category Model

```javascript
{
  id: string | number,
  name: string,
  description: string,
  image: string,
  productCount: number
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Search Filtering Correctness

*For any* search query string and any list of products, when the search filter is applied, all returned products should have either their name or description containing the search query (case-insensitive).

**Validates: Requirements 2.2**

### Property 2: Category Filtering Correctness

*For any* selected category and any list of products, when the category filter is applied, all returned products should have a category matching the selected category.

**Validates: Requirements 2.3**

### Property 3: Image Gallery Thumbnail Selection

*For any* thumbnail in the image gallery, when a user clicks that thumbnail, the main image display should update to show the clicked thumbnail's image URL.

**Validates: Requirements 3.3**

### Property 4: Form Validation Error Display

*For any* invalid form data submitted to the OrderForm, the form should display validation errors for all invalid fields and prevent submission.

**Validates: Requirements 4.4**

## Error Handling

### Error Scenarios and Handling Strategies

#### 1. Data Fetching Errors

**Scenario**: API calls fail to fetch products, product details, or news articles

**Handling**:
- Display error message with retry button
- Use existing error state patterns from components
- Provide fallback to cached data if available
- Log errors for debugging

**Implementation**:
```javascript
const [error, setError] = useState(null);

const handleRetry = () => {
  setError(null);
  fetchData();
};

if (error) {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        {error.message}
      </p>
      <Button onClick={handleRetry}>
        Try Again
      </Button>
    </div>
  );
}
```

#### 2. Image Loading Errors

**Scenario**: Product images or news article images fail to load

**Handling**:
- Use OptimizedImage component with built-in error handling
- Display fallback placeholder image
- Show error icon and message
- Gracefully degrade without breaking layout

**Implementation**: Already handled by OptimizedImage component

#### 3. Form Validation Errors

**Scenario**: User submits OrderForm with invalid or missing data

**Handling**:
- Display inline validation errors below each field
- Highlight invalid fields with red border
- Prevent form submission until all errors are resolved
- Clear errors as user corrects input

**Implementation**: Already handled by OrderForm component

#### 4. Empty States

**Scenario**: No products match filters, no news articles available, no related products

**Handling**:
- Use EmptyState or EnhancedEmptyState components
- Provide helpful messaging and suggestions
- Offer actions to resolve (clear filters, browse all products)
- Maintain consistent styling

**Implementation**:
```javascript
if (filteredProducts.length === 0) {
  return (
    <EmptyState
      icon={<Package className="w-12 h-12" />}
      title="No Products Found"
      description="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
      action={
        <Button onClick={clearFilters}>
          Clear Filters
        </Button>
      }
    />
  );
}
```

#### 5. Navigation Errors

**Scenario**: User navigates to non-existent product or invalid route

**Handling**:
- Check if product exists before rendering detail page
- Display 404-style error message
- Provide navigation back to products page
- Use React Router error boundaries

**Implementation**:
```javascript
if (!product && !loading) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Product Not Found
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Button onClick={() => navigate('/products')}>
        Browse All Products
      </Button>
    </div>
  );
}
```

#### 6. Order Submission Errors

**Scenario**: Order creation fails due to network issues or server errors

**Handling**:
- Display clear error message
- Preserve form data so user doesn't lose input
- Provide retry option
- Suggest alternative actions (contact support)

**Implementation**:
```javascript
const handleOrderSubmit = async (formData) => {
  try {
    setLoading(true);
    await createOrder(formData);
    navigate('/order-success');
  } catch (error) {
    setError('Failed to place order. Please try again or contact support.');
    // Form data is preserved in state
  } finally {
    setLoading(false);
  }
};
```

## Testing Strategy

### Dual Testing Approach

This feature will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, error conditions, and component rendering
- **Property tests**: Verify universal properties across all inputs using randomized test data

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Unit Testing

**Framework**: Jest + React Testing Library

**Test Coverage**:

1. **Component Rendering Tests**
   - Verify each page renders without crashing
   - Check that required elements are present in the DOM
   - Test skeleton states during loading
   - Test empty states when no data available

2. **User Interaction Tests**
   - Test button clicks trigger correct actions
   - Test form submissions with valid/invalid data
   - Test navigation between pages
   - Test view mode toggles (grid/list)
   - Test image gallery thumbnail clicks

3. **Responsive Layout Tests**
   - Test component rendering at different viewport sizes
   - Verify responsive classes are applied correctly
   - Test mobile, tablet, and desktop layouts

4. **Theme Tests**
   - Test dark mode styling
   - Test light mode styling
   - Verify theme classes are applied

5. **Error Handling Tests**
   - Test error states when data fetching fails
   - Test image loading errors
   - Test form validation errors
   - Test empty states

**Example Unit Test**:
```javascript
describe('Products Page', () => {
  it('should display products in grid view by default', () => {
    const mockProducts = [
      { id: 1, name: 'Chair', category: 'Seating', price: '$100' },
      { id: 2, name: 'Table', category: 'Tables', price: '$200' }
    ];
    
    render(<Products products={mockProducts} />);
    
    const productCards = screen.getAllByRole('link');
    expect(productCards).toHaveLength(2);
    expect(screen.getByText('Chair')).toBeInTheDocument();
    expect(screen.getByText('Table')).toBeInTheDocument();
  });
  
  it('should display empty state when no products match filters', () => {
    render(<Products products={[]} />);
    
    expect(screen.getByText(/No Products Found/i)).toBeInTheDocument();
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: public-website-pages, Property {number}: {property_text}`

**Property Tests**:

Each correctness property from the design document will be implemented as a property-based test:

1. **Property 1: Search Filtering Correctness**
   - Generate random product lists and search queries
   - Verify all filtered results contain the search query
   - Tag: `Feature: public-website-pages, Property 1: Search Filtering Correctness`

2. **Property 2: Category Filtering Correctness**
   - Generate random product lists and category selections
   - Verify all filtered results match the selected category
   - Tag: `Feature: public-website-pages, Property 2: Category Filtering Correctness`

3. **Property 3: Image Gallery Thumbnail Selection**
   - Generate random image arrays and thumbnail selections
   - Verify main image updates to selected thumbnail
   - Tag: `Feature: public-website-pages, Property 3: Image Gallery Thumbnail Selection`

4. **Property 4: Form Validation Error Display**
   - Generate random invalid form data
   - Verify validation errors are displayed for all invalid fields
   - Tag: `Feature: public-website-pages, Property 4: Form Validation Error Display`

**Example Property Test**:
```javascript
import fc from 'fast-check';

// Feature: public-website-pages, Property 1: Search Filtering Correctness
describe('Property 1: Search Filtering Correctness', () => {
  it('should only return products containing the search query', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.integer(),
          name: fc.string(),
          description: fc.string(),
          category: fc.string(),
          price: fc.string()
        })),
        fc.string(),
        (products, searchQuery) => {
          const filtered = filterProducts(products, searchQuery, 'all', 'default');
          
          if (searchQuery.trim() === '') {
            // Empty search should return all products
            return filtered.length === products.length;
          }
          
          // All filtered products should contain the search query
          return filtered.every(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Scope**: Test interactions between components and pages

**Test Scenarios**:
1. Navigate from home page to products page
2. Navigate from products page to product detail page
3. Navigate from product detail to order placement
4. Complete order flow from product selection to submission
5. Filter products and navigate to detail, then back (state preservation)

### Manual Testing Checklist

**Visual Testing**:
- [ ] Verify glass-morphism effects match authentication pages
- [ ] Check color consistency across all pages
- [ ] Test hover effects and transitions
- [ ] Verify responsive layouts on actual devices
- [ ] Test dark/light theme switching

**Accessibility Testing**:
- [ ] Keyboard navigation works on all pages
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible

**Performance Testing**:
- [ ] Verify lazy loading works for images
- [ ] Check skeleton states appear immediately
- [ ] Test page load times
- [ ] Verify smooth scrolling and transitions

**Cross-Browser Testing**:
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Verify consistent behavior across browsers
