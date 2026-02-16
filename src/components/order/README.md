# Order Components

This directory contains reusable components specifically designed for order placement and tracking functionality in the Stock Management System (SMS). All components follow the Neo-Enterprise design system with appropriate glassmorphism usage.

## Components

### ImageWithFallback
A robust image component with loading states and error handling.

**Props:**
- `src` (string): Image source URL
- `alt` (string): Alt text for accessibility
- `className` (string): Additional CSS classes
- `fallbackSrc` (string): Fallback image URL (default: placeholder)
- `loading` (string): Loading behavior (default: "lazy")

**Features:**
- Lazy loading for performance
- Automatic fallback on error
- Loading skeleton animation
- Graceful error state display

### OrderSummaryCard
Displays product information in order context with optional quantity selector.

**Props:**
- `product` (object): Product data including name, price, image, specifications
- `quantity` (number): Current quantity (default: 1)
- `className` (string): Additional CSS classes
- `showQuantitySelector` (boolean): Enable quantity selection
- `onQuantityChange` (function): Callback for quantity changes

**Features:**
- Product image with fallback
- Category badge display
- Key specifications preview
- Quantity management
- Price calculation display

### OrderForm
Complete customer information form with validation.

**Props:**
- `onSubmit` (function): Form submission callback
- `loading` (boolean): Loading state for submission
- `className` (string): Additional CSS classes
- `initialData` (object): Pre-populate form fields

**Features:**
- Real-time validation
- Required field indicators
- Phone number format validation
- Email validation (optional field)
- Accessible form design
- Error state management

### OrderStatusTimeline
Visual timeline showing order progress with status indicators.

**Props:**
- `currentStatus` (string): Current order status ('submitted', 'confirmed', 'under_process', 'completed')
- `className` (string): Additional CSS classes
- `orderDate` (string): Order placement date
- `estimatedDelivery` (string): Estimated delivery timeframe

**Features:**
- Color-coded status indicators
- Progress line animation
- Status descriptions
- Estimated delivery display
- Responsive design

### PaymentRedirectNotice
Secure payment transition screen with countdown and security messaging.

**Props:**
- `onRedirect` (function): Callback for payment redirect
- `redirectDelay` (number): Delay before auto-redirect in milliseconds (default: 3000)
- `className` (string): Additional CSS classes

**Features:**
- Glassmorphism container (approved usage)
- Security assurance messaging
- Countdown timer
- Manual redirect option
- Trust-building design elements

## Design System Compliance

### Neo-Enterprise (80%) Usage
- **Forms**: Solid white backgrounds for data clarity
- **Primary buttons**: Solid Deep Blue for trust and reliability
- **Data display**: Clean, professional layouts
- **Error states**: Clear, non-aggressive messaging

### Glassmorphism (20%) Usage
- **PaymentRedirectNotice**: Glass container for transition messaging
- **Secondary buttons**: Glass-style cancel/back actions
- **Empty states**: Subtle glass effects where appropriate

### Color Coding
- **Submitted/Confirmed**: Cyan (`text-cyan-600 bg-cyan-100`)
- **Under Process**: Yellow (`text-yellow-600 bg-yellow-100`)
- **Completed**: Green (`text-green-600 bg-green-100`)
- **Error**: Red (`text-red-600 bg-red-100`)

## Usage Guidelines

### Order Placement Flow
```jsx
import { OrderSummaryCard, OrderForm, PaymentRedirectNotice } from '../components/order';

// Step 1: Product Summary
<OrderSummaryCard 
  product={productData} 
  quantity={quantity}
  showQuantitySelector={true}
  onQuantityChange={setQuantity}
/>

// Step 2: Customer Information
<OrderForm 
  onSubmit={handleOrderSubmit}
  loading={submitting}
/>

// Step 3: Payment Redirect
<PaymentRedirectNotice 
  onRedirect={handlePaymentRedirect}
  redirectDelay={5000}
/>
```

### Order Tracking Flow
```jsx
import { OrderStatusTimeline, OrderSummaryCard } from '../components/order';

<OrderStatusTimeline 
  currentStatus={order.status}
  orderDate={order.orderDate}
  estimatedDelivery={order.estimatedDelivery}
/>

<OrderSummaryCard 
  product={order.product}
  quantity={order.quantity}
/>
```

### Image Handling
```jsx
import { ImageWithFallback } from '../components/order';

<ImageWithFallback
  src="https://example.com/product-image.jpg"
  alt="Product Name"
  className="w-full h-48 object-cover rounded-lg"
  loading="lazy"
/>
```

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML structure
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Clear focus indicators and logical tab order
- **Form Labels**: Proper form labeling and error associations

## Performance Considerations

- **Lazy Loading**: Images load only when needed
- **Debounced Inputs**: Form validation optimized to reduce excessive calls
- **Skeleton States**: Smooth loading transitions prevent layout shift
- **Optimized Images**: Proper sizing and compression for web delivery

## Security & Trust

- **Form Validation**: Client-side validation with server-side verification expected
- **Secure Messaging**: Clear communication about payment security
- **Error Handling**: Graceful error states that don't expose system details
- **Data Sanitization**: Proper input handling and validation

These components are designed to handle money-related transactions with the highest level of trust, security, and professional appearance while maintaining excellent user experience across all devices.