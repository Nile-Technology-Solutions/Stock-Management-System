# Design Document: Public Pages Redesign

## Overview

This design document outlines the technical approach for redesigning the frontend public pages using Tailwind CSS. The redesign focuses on enhancing visual hierarchy, improving responsive layouts, ensuring component consistency, and boosting accessibility while maintaining all existing functionality. The project already has Tailwind CSS configured and uses a glassmorphism aesthetic that will be refined for better usability.

The redesign will touch six public pages: Home, Products, ProductDetail, News, OrderPlacement, and OrderTracking. All changes will be purely visual - no business logic, API calls, or form functionality will be modified.

## Architecture

### Design System Foundation

The redesign will establish a cohesive design system built on Tailwind CSS utilities, organized into the following layers:

1. **Design Tokens Layer**: Core values for colors, spacing, typography, shadows, and transitions defined in `tailwind.config.js`
2. **Component Layer**: Reusable UI components (GlassCard, Button, ProductCard, etc.) with consistent styling
3. **Page Layer**: Public pages that compose components following layout patterns
4. **Theme Layer**: Light and dark mode variants with smooth transitions

### Tailwind Configuration Structure

```javascript
// tailwind.config.js extensions
module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand colors with dark mode variants
        primary: { /* ... */ },
        secondary: { /* ... */ },
        accent: { /* ... */ }
      },
      spacing: {
        // Custom spacing scale if needed beyond defaults
      },
      typography: {
        // Custom typography scales
      },
      backdropBlur: {
        // Glassmorphism blur values
        xs: '2px',
        glass: '12px',
        'glass-strong': '16px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

### Component Architecture

Components will follow a consistent pattern:

```jsx
// Component structure pattern
const Component = ({ variant = 'default', size = 'md', ...props }) => {
  const baseClasses = "/* shared base styles */";
  const variantClasses = {
    default: "/* default variant */",
    elevated: "/* elevated variant */",
    bordered: "/* bordered variant */"
  };
  const sizeClasses = {
    sm: "/* small size */",
    md: "/* medium size */",
    lg: "/* large size */"
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {/* content */}
    </div>
  );
};
```

## Components and Interfaces

### 1. Design Token System

**Purpose**: Centralize all design values for consistency and maintainability.

**Token Categories**:

- **Colors**: Primary, secondary, accent, neutral, semantic (success, warning, error, info)
- **Spacing**: Based on 4px base unit (Tailwind's default scale)
- **Typography**: Font families, sizes, weights, line heights, letter spacing
- **Shadows**: Elevation levels for depth perception
- **Borders**: Radius values, widths, opacity levels
- **Transitions**: Duration and easing functions
- **Z-index**: Layering scale for stacked elements

**Implementation**:
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... through 900
    DEFAULT: '#0ea5e9',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.3)',
    border: 'rgba(255, 255, 255, 0.18)'
  }
}
```

### 2. Typography System

**Purpose**: Establish clear visual hierarchy through consistent text styling.

**Type Scale**:
- **h1**: text-4xl md:text-5xl lg:text-6xl, font-bold, leading-tight
- **h2**: text-3xl md:text-4xl lg:text-5xl, font-bold, leading-tight
- **h3**: text-2xl md:text-3xl lg:text-4xl, font-semibold, leading-snug
- **h4**: text-xl md:text-2xl lg:text-3xl, font-semibold, leading-snug
- **h5**: text-lg md:text-xl lg:text-2xl, font-medium, leading-normal
- **body-lg**: text-lg, font-normal, leading-relaxed
- **body**: text-base, font-normal, leading-relaxed
- **body-sm**: text-sm, font-normal, leading-normal
- **caption**: text-xs, font-normal, leading-tight

**Font Weights**:
- Regular (400): Body text, descriptions
- Medium (500): Subheadings, emphasized text
- Bold (700): Headings, primary emphasis

**Implementation Approach**:
Create utility classes or component wrappers for consistent typography application.

### 3. Responsive Layout System

**Purpose**: Ensure optimal layouts across all device sizes.

**Breakpoint Strategy**:
- **Mobile-first**: Base styles for mobile (< 640px)
- **sm (640px)**: Small tablets, large phones in landscape
- **md (768px)**: Tablets
- **lg (1024px)**: Small desktops, large tablets
- **xl (1280px)**: Standard desktops
- **2xl (1536px)**: Large desktops

**Layout Patterns**:

1. **Container System**:
```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
  {/* content */}
</div>
```

2. **Grid Layouts**:
```jsx
// Product grid example
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
  {/* items */}
</div>
```

3. **Flexbox Layouts**:
```jsx
// Navigation example
<nav className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
  {/* nav items */}
</nav>
```

**Touch Target Sizing**:
- Minimum 44x44px for all interactive elements on mobile
- Use `p-3` (12px) or larger for button padding
- Ensure adequate spacing between clickable elements

### 4. GlassCard Component Refinement

**Purpose**: Enhance the glassmorphism aesthetic while improving usability.

**Variants**:

1. **Default Glass**:
```jsx
className="
  backdrop-blur-glass
  bg-white/70 dark:bg-gray-900/70
  border border-white/20 dark:border-gray-700/30
  rounded-xl
  shadow-lg
"
```

2. **Elevated Glass**:
```jsx
className="
  backdrop-blur-glass-strong
  bg-white/80 dark:bg-gray-900/80
  border border-white/30 dark:border-gray-700/40
  rounded-xl
  shadow-2xl
  transform hover:scale-[1.02]
  transition-transform duration-300
"
```

3. **Bordered Glass**:
```jsx
className="
  backdrop-blur-glass
  bg-white/60 dark:bg-gray-900/60
  border-2 border-primary-500/30
  rounded-xl
  shadow-md
"
```

**Accessibility Enhancements**:
- Ensure text contrast meets WCAG AA standards (4.5:1 for normal text)
- Add subtle text shadows when needed: `text-shadow: 0 1px 2px rgba(0,0,0,0.1)`
- Test readability in both light and dark modes

**Component Interface**:
```jsx
<GlassCard
  variant="default" | "elevated" | "bordered"
  className={string}
  as="div" | "section" | "article"
  aria-label={string}
>
  {children}
</GlassCard>
```

### 5. Button System

**Purpose**: Provide consistent, accessible button styles across all pages.

**Button Variants**:

1. **Primary**:
```jsx
className="
  px-6 py-3
  bg-primary-600 hover:bg-primary-700
  dark:bg-primary-500 dark:hover:bg-primary-600
  text-white font-medium
  rounded-lg
  shadow-md hover:shadow-lg
  transition-all duration-150
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
"
```

2. **Secondary**:
```jsx
className="
  px-6 py-3
  bg-white/80 hover:bg-white
  dark:bg-gray-800/80 dark:hover:bg-gray-800
  text-gray-900 dark:text-gray-100 font-medium
  border border-gray-300 dark:border-gray-600
  rounded-lg
  shadow-sm hover:shadow-md
  transition-all duration-150
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
"
```

3. **Ghost**:
```jsx
className="
  px-6 py-3
  bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
  text-gray-700 dark:text-gray-300 font-medium
  rounded-lg
  transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
"
```

4. **Danger**:
```jsx
className="
  px-6 py-3
  bg-red-600 hover:bg-red-700
  dark:bg-red-500 dark:hover:bg-red-600
  text-white font-medium
  rounded-lg
  shadow-md hover:shadow-lg
  transition-all duration-150
  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
"
```

**Size Variants**:
- **sm**: px-4 py-2 text-sm
- **md**: px-6 py-3 text-base (default)
- **lg**: px-8 py-4 text-lg

**Component Interface**:
```jsx
<Button
  variant="primary" | "secondary" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  disabled={boolean}
  loading={boolean}
  onClick={function}
  type="button" | "submit" | "reset"
  aria-label={string}
>
  {children}
</Button>
```

### 6. ProductCard Component

**Purpose**: Display product information consistently across Home and Products pages.

**Layout Structure**:
```jsx
<GlassCard variant="default" className="group">
  {/* Image Container */}
  <div className="relative aspect-square overflow-hidden rounded-t-xl">
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      className="
        w-full h-full object-cover
        group-hover:scale-110
        transition-transform duration-300
      "
    />
    {product.badge && (
      <span className="absolute top-2 right-2 px-3 py-1 bg-accent-500 text-white text-xs font-medium rounded-full">
        {product.badge}
      </span>
    )}
  </div>
  
  {/* Content Container */}
  <div className="p-4 space-y-3">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
      {product.name}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
      {product.description}
    </p>
    
    {/* Price and CTA */}
    <div className="flex items-center justify-between pt-2">
      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
        ${product.price}
      </span>
      <Button variant="primary" size="sm">
        View Details
      </Button>
    </div>
  </div>
</GlassCard>
```

**Responsive Behavior**:
- Mobile: Full width with adequate padding
- Tablet: 2-column grid
- Desktop: 3-4 column grid depending on container width

### 7. Loading Skeleton System

**Purpose**: Provide visual feedback during content loading.

**Skeleton Component**:
```jsx
const Skeleton = ({ className, variant = 'text' }) => {
  const variants = {
    text: 'h-4 bg-gray-200 dark:bg-gray-700 rounded',
    title: 'h-8 bg-gray-200 dark:bg-gray-700 rounded',
    avatar: 'w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full',
    image: 'w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl'
  };
  
  return (
    <div className={`${variants[variant]} ${className} animate-pulse`} />
  );
};
```

**ProductCardSkeleton Example**:
```jsx
<GlassCard>
  <Skeleton variant="image" />
  <div className="p-4 space-y-3">
    <Skeleton variant="title" className="w-3/4" />
    <Skeleton variant="text" className="w-full" />
    <Skeleton variant="text" className="w-5/6" />
    <div className="flex items-center justify-between pt-2">
      <Skeleton variant="text" className="w-20" />
      <Skeleton variant="text" className="w-24 h-10" />
    </div>
  </div>
</GlassCard>
```

### 8. Empty State System

**Purpose**: Communicate when no data is available with helpful guidance.

**Empty State Component**:
```jsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  {/* Icon */}
  <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600">
    {icon}
  </div>
  
  {/* Message */}
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
    {title}
  </h3>
  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
    {description}
  </p>
  
  {/* Optional Action */}
  {action && (
    <Button variant="primary" onClick={action.onClick}>
      {action.label}
    </Button>
  )}
</div>
```

### 9. Form Component Enhancements

**Purpose**: Improve form visual presentation while preserving all functionality.

**Input Field Pattern**:
```jsx
<div className="space-y-2">
  <label
    htmlFor={id}
    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
  
  <input
    id={id}
    type={type}
    className="
      w-full px-4 py-3
      bg-white dark:bg-gray-800
      border border-gray-300 dark:border-gray-600
      rounded-lg
      text-gray-900 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors duration-150
    "
    aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
    aria-invalid={error ? 'true' : 'false'}
  />
  
  {helper && !error && (
    <p id={`${id}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
      {helper}
    </p>
  )}
  
  {error && (
    <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
      <ErrorIcon className="w-4 h-4" />
      {error}
    </p>
  )}
</div>
```

**Form Validation States**:
- Default: Standard border color
- Focus: Ring with primary color
- Error: Red border and text with error icon
- Success: Green border with success icon
- Disabled: Reduced opacity, no pointer events

### 10. Animation and Transition System

**Purpose**: Provide smooth, purposeful animations that enhance UX.

**Transition Utilities**:
```javascript
// tailwind.config.js
transitionDuration: {
  'micro': '100ms',
  'fast': '150ms',
  'normal': '300ms',
  'slow': '500ms'
}
```

**Common Animation Patterns**:

1. **Hover Scale**:
```jsx
className="transform hover:scale-105 transition-transform duration-fast"
```

2. **Fade In**:
```jsx
className="animate-fadeIn"
// Custom animation in tailwind.config.js
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  }
}
```

3. **Slide Up**:
```jsx
className="animate-slideUp"
// Custom animation
keyframes: {
  slideUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  }
}
```

4. **Reduced Motion Support**:
```jsx
className="motion-reduce:transition-none motion-reduce:transform-none"
```

### 11. Dark Mode Implementation

**Purpose**: Provide a comfortable viewing experience in low-light conditions.

**Strategy**:
- Use Tailwind's `dark:` variant for all color-related utilities
- Store theme preference in localStorage
- Respect system preference via `prefers-color-scheme`
- Provide manual toggle control

**Theme Toggle Component**:
```jsx
const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
```

**Color Adjustments for Dark Mode**:
- Background: white → gray-900
- Text: gray-900 → white
- Borders: gray-300 → gray-700
- Glass backgrounds: white/70 → gray-900/70
- Shadows: Reduce intensity or adjust color

### 12. Accessibility Implementation

**Purpose**: Ensure all users can access and interact with public pages.

**Focus Management**:
```jsx
// Focus visible utility
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
```

**Keyboard Navigation**:
- All interactive elements must be keyboard accessible
- Logical tab order following visual flow
- Escape key closes modals and dropdowns
- Arrow keys navigate within component groups

**ARIA Attributes**:
```jsx
// Button with loading state
<button
  aria-label="Add to cart"
  aria-busy={loading}
  aria-disabled={disabled}
>
  {loading ? 'Adding...' : 'Add to Cart'}
</button>

// Image with proper alt text
<img
  src={product.image}
  alt={`${product.name} - ${product.category}`}
  loading="lazy"
/>

// Decorative image
<img src={decorative.svg} alt="" role="presentation" />
```

**Screen Reader Announcements**:
```jsx
// Live region for dynamic updates
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

## Data Models

No new data models are required for this redesign. All existing data structures, API responses, and state management remain unchanged. The redesign only affects the presentation layer.

**Existing Models to Preserve**:
- Product model (id, name, description, price, image, category, etc.)
- Order model (id, items, total, status, etc.)
- User model (for role-based access)
- News/Article model (id, title, content, date, etc.)


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Color Contrast Compliance

*For any* text element and its background color combination in both light and dark modes, the contrast ratio should meet or exceed 4.5:1 for normal text (< 18pt) and 3:1 for large text (≥ 18pt or ≥ 14pt bold).

**Validates: Requirements 1.4, 7.5**

### Property 2: Touch Target Minimum Size

*For any* interactive element (button, link, input, etc.) when rendered at mobile viewport (< 640px), the element should have a minimum touch target size of 44x44 pixels.

**Validates: Requirements 2.1**

### Property 3: Desktop Line Length Optimization

*For any* text block displayed on desktop viewport (> 1024px), the line length should be between 45 and 75 characters for optimal readability.

**Validates: Requirements 2.3**

### Property 4: No Horizontal Overflow

*For any* page at any viewport size, there should be no horizontal scrolling (document width should not exceed viewport width).

**Validates: Requirements 2.5**

### Property 5: Accessibility Attributes Completeness

*For any* interactive element, form input, or meaningful image, the element should have appropriate accessibility attributes:
- Interactive elements: ARIA labels, roles, and states
- Form inputs: associated labels linked via htmlFor/id or aria-labelledby
- Images: alt attribute (descriptive for meaningful images, empty for decorative)

**Validates: Requirements 4.1, 4.4, 4.5**

### Property 6: Focus Indicator Visibility

*For any* focusable element (buttons, links, inputs, etc.), when the element receives keyboard focus, it should display a visible focus indicator with minimum 2px outline or ring.

**Validates: Requirements 4.2, 10.3**

### Property 7: Image Lazy Loading

*For any* image element that is initially positioned below the viewport fold, the image should have the loading="lazy" attribute to defer loading until needed.

**Validates: Requirements 5.1**

### Property 8: Responsive Image Implementation

*For any* image element, the image should implement responsive image techniques (srcset attribute or picture element) to serve appropriately sized images based on viewport.

**Validates: Requirements 5.2**

### Property 9: Reduced Motion Respect

*For any* animated element, when the user's system preference is set to prefers-reduced-motion, the element should either disable animations entirely or reduce them to minimal, non-distracting transitions.

**Validates: Requirements 6.5**

### Property 10: Interactive Element Hover States

*For any* interactive element (button, link, card), the element should have defined hover states that change the cursor to pointer and apply visual feedback (color, scale, shadow, or opacity change).

**Validates: Requirements 10.1**

### Property 11: Glass Surface Text Contrast

*For any* text displayed on a GlassCard or glassmorphism surface, the text should maintain sufficient contrast through appropriate text color, text shadows, or background adjustments to meet WCAG AA standards.

**Validates: Requirements 11.5**

## Error Handling

Since this is a visual redesign focused on the presentation layer, error handling remains unchanged from the existing implementation. However, the visual presentation of errors will be enhanced:

### Error State Presentation

**Form Validation Errors**:
- Display inline error messages below the relevant input field
- Use red color (error semantic color) with error icon
- Include descriptive, actionable error text
- Link error messages to inputs via aria-describedby
- Maintain error state until user corrects the input

**API/Network Errors**:
- Display error state components with clear messaging
- Provide retry actions where applicable
- Use appropriate error icons and semantic colors
- Ensure error messages are accessible to screen readers

**Empty States**:
- Display when no data is available (not an error, but a state)
- Include helpful messaging and optional actions
- Use neutral colors and appropriate icons

**Loading States**:
- Display skeleton screens during content loading
- Show loading spinners for operations > 500ms
- Disable interactive elements during processing
- Provide visual feedback that system is working

### Error Prevention

**Visual Feedback**:
- Disabled states clearly indicated (reduced opacity, no pointer cursor)
- Required fields marked with asterisk and label
- Helper text provides guidance before errors occur
- Real-time validation feedback where appropriate

## Testing Strategy

This redesign requires a dual testing approach combining traditional unit/integration tests with property-based testing for universal correctness properties.

### Unit Testing Approach

Unit tests will focus on:

1. **Component Rendering**: Verify components render with correct variants, sizes, and props
2. **Accessibility Attributes**: Check that specific components have required ARIA attributes
3. **Responsive Behavior**: Test that components apply correct classes at different breakpoints
4. **Dark Mode**: Verify dark mode classes are applied when theme is dark
5. **User Interactions**: Test click handlers, form submissions, and state changes
6. **Edge Cases**: Empty states, loading states, error states
7. **Form Preservation**: Verify all existing form functionality remains intact

**Example Unit Tests**:
```javascript
describe('Button Component', () => {
  it('renders primary variant with correct classes', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.firstChild).toHaveClass('bg-primary-600');
  });
  
  it('displays loading state correctly', () => {
    const { getByRole } = render(<Button loading>Submit</Button>);
    expect(getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
  
  it('is keyboard accessible', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click</Button>);
    const button = getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Property-Based Testing Approach

Property-based tests will verify universal properties across many generated inputs. Each test should run a minimum of 100 iterations.

**Property Testing Library**: Use `fast-check` for JavaScript/TypeScript property-based testing.

**Test Configuration**:
```javascript
import fc from 'fast-check';

// Configure for minimum 100 runs
const config = { numRuns: 100 };
```

**Example Property Tests**:

```javascript
describe('Property Tests: Color Contrast', () => {
  it('Property 1: All text/background combinations meet WCAG contrast ratios', () => {
    // Feature: public-pages-redesign, Property 1: Color Contrast Compliance
    fc.assert(
      fc.property(
        fc.record({
          textColor: fc.constantFrom(...colorPalette.text),
          bgColor: fc.constantFrom(...colorPalette.backgrounds),
          fontSize: fc.integer({ min: 12, max: 48 }),
          fontWeight: fc.constantFrom(400, 500, 700),
          darkMode: fc.boolean()
        }),
        ({ textColor, bgColor, fontSize, fontWeight, darkMode }) => {
          const contrastRatio = calculateContrastRatio(textColor, bgColor);
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
          const minRatio = isLargeText ? 3 : 4.5;
          
          return contrastRatio >= minRatio;
        }
      ),
      config
    );
  });
});

describe('Property Tests: Touch Targets', () => {
  it('Property 2: All interactive elements meet minimum touch target size on mobile', () => {
    // Feature: public-pages-redesign, Property 2: Touch Target Minimum Size
    fc.assert(
      fc.property(
        fc.record({
          component: fc.constantFrom('Button', 'Link', 'Input', 'Checkbox'),
          size: fc.constantFrom('sm', 'md', 'lg'),
          viewport: fc.constant({ width: 375, height: 667 }) // Mobile
        }),
        ({ component, size, viewport }) => {
          const element = renderComponentAtViewport(component, size, viewport);
          const { width, height } = element.getBoundingClientRect();
          
          return width >= 44 && height >= 44;
        }
      ),
      config
    );
  });
});

describe('Property Tests: Accessibility', () => {
  it('Property 5: All interactive elements have appropriate accessibility attributes', () => {
    // Feature: public-pages-redesign, Property 5: Accessibility Attributes Completeness
    fc.assert(
      fc.property(
        fc.record({
          elementType: fc.constantFrom('button', 'a', 'input', 'select', 'textarea'),
          hasLabel: fc.boolean(),
          hasAriaLabel: fc.boolean(),
          isDisabled: fc.boolean()
        }),
        ({ elementType, hasLabel, hasAriaLabel, isDisabled }) => {
          const element = createInteractiveElement(elementType, { hasLabel, hasAriaLabel, isDisabled });
          
          // Must have either label, aria-label, or aria-labelledby
          const hasAccessibleName = 
            element.labels?.length > 0 ||
            element.hasAttribute('aria-label') ||
            element.hasAttribute('aria-labelledby');
          
          // Disabled state must be communicated
          const disabledAccessible = !isDisabled || 
            element.hasAttribute('disabled') ||
            element.getAttribute('aria-disabled') === 'true';
          
          return hasAccessibleName && disabledAccessible;
        }
      ),
      config
    );
  });
  
  it('Property 6: All focusable elements have visible focus indicators', () => {
    // Feature: public-pages-redesign, Property 6: Focus Indicator Visibility
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a', 'input', 'select', 'textarea'),
        (elementType) => {
          const element = createFocusableElement(elementType);
          element.focus();
          
          const styles = window.getComputedStyle(element);
          const outlineWidth = parseFloat(styles.outlineWidth);
          const ringWidth = parseFloat(styles.getPropertyValue('--tw-ring-width') || '0');
          
          return outlineWidth >= 2 || ringWidth >= 2;
        }
      ),
      config
    );
  });
});

describe('Property Tests: Responsive Images', () => {
  it('Property 7: Below-fold images have lazy loading', () => {
    // Feature: public-pages-redesign, Property 7: Image Lazy Loading
    fc.assert(
      fc.property(
        fc.record({
          imagePosition: fc.integer({ min: 800, max: 5000 }), // Y position
          viewportHeight: fc.constant(667)
        }),
        ({ imagePosition, viewportHeight }) => {
          const isBelowFold = imagePosition > viewportHeight;
          const img = createImageElement({ top: imagePosition });
          
          if (isBelowFold) {
            return img.getAttribute('loading') === 'lazy';
          }
          return true; // Above fold images don't require lazy loading
        }
      ),
      config
    );
  });
  
  it('Property 8: All images implement responsive image techniques', () => {
    // Feature: public-pages-redesign, Property 8: Responsive Image Implementation
    fc.assert(
      fc.property(
        fc.constantFrom('product', 'hero', 'thumbnail', 'gallery'),
        (imageType) => {
          const img = createImageElement({ type: imageType });
          
          return img.hasAttribute('srcset') || img.parentElement?.tagName === 'PICTURE';
        }
      ),
      config
    );
  });
});

describe('Property Tests: Animations', () => {
  it('Property 9: Animations respect prefers-reduced-motion', () => {
    // Feature: public-pages-redesign, Property 9: Reduced Motion Respect
    fc.assert(
      fc.property(
        fc.record({
          component: fc.constantFrom('Button', 'Card', 'Modal', 'Dropdown'),
          prefersReducedMotion: fc.boolean()
        }),
        ({ component, prefersReducedMotion }) => {
          setMediaQuery('prefers-reduced-motion', prefersReducedMotion ? 'reduce' : 'no-preference');
          const element = renderComponent(component);
          
          if (prefersReducedMotion) {
            const styles = window.getComputedStyle(element);
            const transitionDuration = parseFloat(styles.transitionDuration);
            const animationDuration = parseFloat(styles.animationDuration);
            
            // Should have no or minimal transitions/animations
            return transitionDuration <= 0.01 && animationDuration <= 0.01;
          }
          return true;
        }
      ),
      config
    );
  });
});

describe('Property Tests: Interactive States', () => {
  it('Property 10: All interactive elements have hover states', () => {
    // Feature: public-pages-redesign, Property 10: Interactive Element Hover States
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a', 'card'),
        (elementType) => {
          const element = createInteractiveElement(elementType);
          const defaultStyles = window.getComputedStyle(element);
          
          // Simulate hover
          element.dispatchEvent(new MouseEvent('mouseenter'));
          const hoverStyles = window.getComputedStyle(element);
          
          // Check cursor changes to pointer
          const hasPointerCursor = hoverStyles.cursor === 'pointer';
          
          // Check for visual feedback (color, transform, shadow, or opacity change)
          const hasVisualFeedback = 
            defaultStyles.backgroundColor !== hoverStyles.backgroundColor ||
            defaultStyles.transform !== hoverStyles.transform ||
            defaultStyles.boxShadow !== hoverStyles.boxShadow ||
            defaultStyles.opacity !== hoverStyles.opacity;
          
          return hasPointerCursor && hasVisualFeedback;
        }
      ),
      config
    );
  });
});

describe('Property Tests: Glassmorphism', () => {
  it('Property 11: Text on glass surfaces maintains sufficient contrast', () => {
    // Feature: public-pages-redesign, Property 11: Glass Surface Text Contrast
    fc.assert(
      fc.property(
        fc.record({
          glassOpacity: fc.float({ min: 0.7, max: 0.9 }),
          textColor: fc.constantFrom(...colorPalette.text),
          darkMode: fc.boolean()
        }),
        ({ glassOpacity, textColor, darkMode }) => {
          const glassCard = createGlassCard({ opacity: glassOpacity, darkMode });
          const textElement = createTextOnGlass(glassCard, textColor);
          
          const effectiveContrast = calculateEffectiveContrast(textElement);
          
          return effectiveContrast >= 4.5;
        }
      ),
      config
    );
  });
});
```

### Integration Testing

Integration tests will verify:

1. **Page-level rendering**: Full pages render correctly with all components
2. **Navigation flows**: Users can navigate between public pages
3. **Form submissions**: Forms submit correctly and handle responses
4. **Theme switching**: Dark mode toggle works across all pages
5. **Responsive behavior**: Pages adapt correctly at all breakpoints
6. **Accessibility**: Full keyboard navigation and screen reader compatibility

### Visual Regression Testing

Consider using tools like:
- **Chromatic**: For component-level visual regression
- **Percy**: For full-page visual regression
- **Playwright**: For automated visual comparisons

This helps catch unintended visual changes and ensures consistency across updates.

### Testing Checklist

Before considering the redesign complete:

- [ ] All unit tests pass
- [ ] All property-based tests pass (100+ iterations each)
- [ ] Manual accessibility audit with screen reader
- [ ] Manual keyboard navigation testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS and Android)
- [ ] Dark mode testing in all scenarios
- [ ] Performance testing (Lighthouse scores)
- [ ] Visual regression tests pass
- [ ] All existing form functionality verified intact

### Performance Benchmarks

Target metrics:
- **Lighthouse Performance Score**: ≥ 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

These should be measured and maintained throughout the redesign process.
