# Implementation Plan: Public Website Pages

## Overview

This implementation plan breaks down the development of five public-facing pages for the SMS Nile Tech furniture e-commerce platform. The implementation leverages existing components (ProductCard, OrderForm, GlassCard, OptimizedImage, SearchInput, etc.) and follows the established glass-morphism design language. Tasks are organized to build incrementally, with testing integrated throughout.

## Tasks

- [ ] 1. Implement Home Page
  - [x] 1.1 Create Home page component structure with responsive layout
    - Implement hero section with GlassCard, welcome messaging, and CTA buttons
    - Create featured products section using ProductCard components in grid layout
    - Create categories section with navigation cards
    - Add responsive breakpoints (mobile: 1 column, tablet: 2 columns, desktop: 3-4 columns)
    - Implement skeleton states using SkeletonCard during data loading
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.8_
  
  - [ ]* 1.2 Write unit tests for Home page
    - Test hero section renders with correct elements
    - Test featured products section displays ProductCard components
    - Test categories section renders with navigation links
    - Test skeleton states appear during loading
    - Test responsive layout classes at different viewport sizes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 1.3 Implement navigation handlers for Home page
    - Add click handlers for category cards that navigate to products page with category filter
    - Add click handlers for featured products that navigate to product detail page
    - Ensure navigation uses React Router Link components
    - _Requirements: 1.6, 1.7_
  
  - [ ]* 1.4 Write unit tests for Home page navigation
    - Test category click navigates to products page with correct filter
    - Test product click navigates to product detail page
    - _Requirements: 1.6, 1.7_

- [x] 2. Checkpoint - Verify Home page functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Implement Products Listing Page
  - [x] 3.1 Create Products page component with search and filter UI
    - Implement page header with title and SearchInput component
    - Create filter bar with category Select dropdown and sort Select dropdown
    - Add view mode toggle button (grid/list) with icons
    - Implement responsive layout for filter controls
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 Implement product filtering and search logic
    - Create filterProducts utility function for search, category, and sort filtering
    - Implement real-time search filtering on name and description
    - Implement category filtering
    - Implement sort options (price ascending/descending, name alphabetical)
    - Update URL params to maintain filter state
    - _Requirements: 2.2, 2.3, 2.8_
  
  - [ ]* 3.3 Write property test for search filtering
    - **Property 1: Search Filtering Correctness**
    - **Validates: Requirements 2.2**
  
  - [ ]* 3.4 Write property test for category filtering
    - **Property 2: Category Filtering Correctness**
    - **Validates: Requirements 2.3**
  
  - [x] 3.5 Implement products display with view modes
    - Render ProductCard components in grid or list mode based on viewMode state
    - Display ProductCardSkeleton components during loading
    - Display EmptyState component when no products match filters
    - Implement responsive grid (1 column mobile, 2 columns tablet, 3-4 columns desktop)
    - Add click handlers to navigate to product detail page
    - _Requirements: 2.1, 2.4, 2.5, 2.6, 2.7, 2.9_
  
  - [ ]* 3.6 Write unit tests for Products page
    - Test search input filters products in real-time
    - Test category filter displays only matching products
    - Test view mode toggle switches between grid and list
    - Test skeleton states during loading
    - Test EmptyState displays when no results
    - Test navigation to product detail on card click
    - Test responsive layout classes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.9_

- [x] 4. Checkpoint - Verify Products page functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Product Detail Page
  - [ ] 5.1 Create ProductDetail page component structure
    - Implement breadcrumb navigation
    - Create two-column responsive layout (stacked on mobile, side-by-side on desktop)
    - Add back button for navigation
    - Fetch product data using useProductDetail custom hook
    - Display skeleton state during loading
    - Handle product not found error state
    - _Requirements: 3.1, 3.7_
  
  - [x] 5.2 Implement image gallery component
    - Create main image display using OptimizedImage with eager loading
    - Create thumbnail grid (4 columns) below main image
    - Implement thumbnail click handler to update main image
    - Add active thumbnail styling (border and ring)
    - Handle image loading errors with OptimizedImage fallback
    - _Requirements: 3.2, 3.3, 3.8_
  
  - [ ]* 5.3 Write property test for image gallery
    - **Property 3: Image Gallery Thumbnail Selection**
    - **Validates: Requirements 3.3**
  
  - [x] 5.4 Implement product information section
    - Display product name, category badge, price, and description in GlassCard
    - Display product specifications in structured format
    - Add order button that navigates to order placement page with product ID
    - Implement responsive layout for product info
    - _Requirements: 3.1, 3.4, 3.5, 3.9_
  
  - [x] 5.5 Implement related products section
    - Fetch related products based on product category or relatedProductIds
    - Display related products using ProductCard components in grid
    - Implement responsive grid (1 column mobile, 2-3 columns tablet, 3-4 columns desktop)
    - _Requirements: 3.6_
  
  - [ ]* 5.6 Write unit tests for ProductDetail page
    - Test product information displays correctly
    - Test image gallery renders with thumbnails
    - Test thumbnail click updates main image
    - Test order button navigates with product ID
    - Test related products section displays
    - Test responsive layout classes
    - Test image error handling
    - Test product not found error state
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 6. Checkpoint - Verify ProductDetail page functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Order Placement Page
  - [x] 7.1 Create OrderPlacement page component structure
    - Implement page header with title
    - Create two-column responsive layout (stacked on mobile, side-by-side on desktop)
    - Fetch product data from URL params using useProductDetail hook
    - Add back button for navigation
    - _Requirements: 4.1, 4.2, 4.9_
  
  - [x] 7.2 Implement product summary section
    - Display product image using OptimizedImage in GlassCard
    - Display product name, category, and price
    - Add quantity selector with increment/decrement buttons
    - Calculate and display total price based on quantity
    - _Requirements: 4.2, 4.5, 4.8_
  
  - [x] 7.3 Integrate OrderForm component
    - Render OrderForm component with onSubmit handler
    - Pre-fill form with authenticated user data if available
    - Allow unauthenticated users to fill form manually
    - Handle form submission to create order
    - Navigate to success page after successful order creation
    - Display error message if order creation fails
    - _Requirements: 4.1, 4.3, 4.4, 4.6, 4.7_
  
  - [ ]* 7.4 Write property test for form validation
    - **Property 4: Form Validation Error Display**
    - **Validates: Requirements 4.4**
  
  - [ ]* 7.5 Write unit tests for OrderPlacement page
    - Test product summary displays with correct information
    - Test quantity selector updates total price
    - Test OrderForm renders
    - Test form pre-fills for authenticated users
    - Test form allows input for unauthenticated users
    - Test order submission success flow
    - Test order submission error handling
    - Test responsive layout classes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.9_

- [x] 8. Checkpoint - Verify OrderPlacement page functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement News Page
  - [x] 9.1 Create News page component structure
    - Implement page header with title and description
    - Create news grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
    - Fetch news articles data
    - Display SkeletonCard components during loading
    - Display EmptyState when no articles available
    - _Requirements: 5.1, 5.3, 5.4, 5.5_
  
  - [x] 9.2 Create NewsCard component
    - Display article featured image using OptimizedImage with lazy loading
    - Display article title, excerpt, and formatted date
    - Add "Read More" link that navigates to full article
    - Use GlassCard for card styling
    - Add hover effects consistent with design system
    - Handle image loading errors with OptimizedImage fallback
    - _Requirements: 5.1, 5.2, 5.6, 5.7_
  
  - [ ]* 9.3 Write unit tests for News page
    - Test news articles display with required fields
    - Test article click navigates to full article
    - Test skeleton states during loading
    - Test EmptyState displays when no articles
    - Test responsive layout classes
    - Test image error handling
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7_

- [x] 10. Checkpoint - Verify News page functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement shared utilities and hooks
  - [x] 11.1 Create custom hooks for data fetching
    - Implement useProducts hook for fetching all products
    - Implement useProductDetail hook for fetching single product by ID
    - Implement useNews hook for fetching news articles
    - Add loading and error states to all hooks
    - _Requirements: 2.1, 3.1, 5.1_
  
  - [x] 11.2 Create utility functions
    - Implement formatPrice function for consistent price display
    - Implement formatDate function for news article dates
    - Implement truncateText function for excerpts
    - Export filterProducts function from Products page for reuse
    - _Requirements: 2.2, 2.3, 5.1_
  
  - [ ]* 11.3 Write unit tests for utilities
    - Test formatPrice with various input formats
    - Test formatDate with various date formats
    - Test truncateText with different lengths
    - Test filterProducts with various filter combinations
    - _Requirements: 2.2, 2.3, 5.1_

- [ ] 12. Implement performance optimizations
  - [ ] 12.1 Add lazy loading and optimization
    - Verify all images use OptimizedImage component with loading="lazy"
    - Verify skeleton states appear immediately during data fetching
    - Add scroll position restoration for browser back navigation
    - Test image lazy loading behavior
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 12.2 Write performance tests
    - Test OptimizedImage components have lazy loading attribute
    - Test skeleton states render immediately
    - _Requirements: 7.1, 7.2, 7.4_

- [ ] 13. Implement theme and responsive design
  - [ ] 13.1 Verify theme support across all pages
    - Test dark mode styling on all pages
    - Test light mode styling on all pages
    - Verify glass-morphism effects (backdrop-blur, transparency)
    - Verify color palette consistency (cyan-400, sky-400, slate-900, slate-100)
    - Verify hover effects and transitions
    - _Requirements: 8.1, 8.2, 8.4, 8.5, 8.6_
  
  - [ ] 13.2 Verify responsive layouts across all pages
    - Test mobile layouts (< 768px) on all pages
    - Test tablet layouts (768px - 1024px) on all pages
    - Test desktop layouts (> 1024px) on all pages
    - Verify Tailwind responsive breakpoints (sm, md, lg, xl) are used consistently
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [ ]* 13.3 Write theme and responsive tests
    - Test dark mode classes are applied
    - Test light mode classes are applied
    - Test responsive classes at different viewport sizes
    - _Requirements: 6.1, 6.2, 6.3, 8.1, 8.2_

- [ ] 14. Implement error handling and empty states
  - [ ] 14.1 Add error handling to all pages
    - Add error state with retry button for data fetching failures
    - Add product not found handling on ProductDetail page
    - Add order submission error handling on OrderPlacement page
    - Verify OptimizedImage error states work correctly
    - _Requirements: 10.1, 10.3, 10.4_
  
  - [ ] 14.2 Add empty states to all pages
    - Add EmptyState to Products page when no results
    - Add EmptyState to News page when no articles
    - Add EmptyState to related products section when none available
    - Verify EmptyState components have helpful messaging and actions
    - _Requirements: 10.2, 10.5, 10.6_
  
  - [ ]* 14.3 Write error handling tests
    - Test error states display with retry option
    - Test empty states display with appropriate messaging
    - Test image error handling
    - Test order submission error handling
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 15. Implement navigation and routing
  - [ ] 15.1 Verify navigation integration
    - Verify all navigation uses React Router Link components
    - Verify product detail URLs include product ID in path
    - Verify order placement URLs include product ID as parameter
    - Test direct URL access loads correct page with data
    - Test browser back/forward navigation works correctly
    - _Requirements: 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 15.2 Write navigation tests
    - Test product detail URL structure
    - Test order placement URL structure
    - Test direct URL access
    - _Requirements: 9.2, 9.3, 9.5_

- [ ] 16. Final integration and polish
  - [ ] 16.1 Integration testing
    - Test complete user flow: Home → Products → Product Detail → Order Placement
    - Test filter state preservation when navigating back from product detail
    - Test theme switching works across all pages
    - Test responsive behavior on actual devices
    - _Requirements: 2.8, 8.1, 8.2_
  
  - [ ] 16.2 Visual polish and consistency
    - Verify glass-morphism effects match authentication pages
    - Verify color consistency across all pages
    - Verify hover effects and transitions are smooth
    - Verify spacing and typography are consistent
    - _Requirements: 1.8, 8.4, 8.5, 8.6_
  
  - [ ]* 16.3 Write integration tests
    - Test navigation flow from home to order placement
    - Test filter state preservation
    - Test theme switching across pages
    - _Requirements: 2.8, 8.1, 8.2_

- [ ] 17. Final checkpoint - Complete testing and review
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation leverages existing components to minimize new code
- All pages follow the established glass-morphism design language
- Responsive design is built-in from the start using Tailwind CSS breakpoints
