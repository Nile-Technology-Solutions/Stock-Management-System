# Icon System - Developer Guide

## 🎯 Overview

This directory contains the centralized icon system for the Stock Management System (SMS). All icons use **Lucide React** and follow Neo-Enterprise design principles.

## 🚫 STRICT RULES

- **NO EMOJIS** in UI components
- **NO INLINE SVGs** - use Lucide icons only
- **NO CUSTOM ICON LIBRARIES** - Lucide React only
- **SEMANTIC MEANING** - icons must match their purpose

## 📦 Usage

### Import Icons
```jsx
import { Package, CheckCircle, Search, Plus } from '../../components/icons';
```

### Basic Usage
```jsx
// Standard icon with text
<div className="flex items-center">
  <Package className="w-5 h-5 mr-2 text-slate-600" />
  <span>Products</span>
</div>

// Button with icon
<button className="flex items-center">
  <Plus className="w-4 h-4 mr-2" />
  Add Item
</button>

// Status indicator
<div className="flex items-center">
  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
  <span>Completed</span>
</div>
```

## 📏 Sizing Standards

| Size | Class | Usage |
|------|-------|-------|
| 16px | `w-4 h-4` | Inline text, small buttons |
| 20px | `w-5 h-5` | Standard UI elements |
| 24px | `w-6 h-6` | Dashboard cards, features |
| 32px | `w-8 h-8` | Hero sections, empty states |

## 🎨 Color Guidelines

### Default (Inherit)
```jsx
<Search className="w-5 h-5" /> // Inherits text color
```

### Status Colors
```jsx
<CheckCircle className="w-5 h-5 text-green-600" />   // Success
<AlertTriangle className="w-5 h-5 text-yellow-600" /> // Warning
<XCircle className="w-5 h-5 text-red-600" />         // Error
<Info className="w-5 h-5 text-cyan-600" />           // Info
```

## 📚 Available Icon Categories

### Product & Inventory
`Package`, `Package2`, `Boxes`, `Archive`, `Warehouse`

### Commerce & Shopping
`ShoppingCart`, `ShoppingBag`, `CreditCard`, `DollarSign`, `Receipt`, `Truck`

### User & Account
`User`, `Users`, `UserCheck`, `UserPlus`, `Shield`, `Lock`

### Status & Feedback
`CheckCircle`, `XCircle`, `AlertCircle`, `Info`, `Clock`, `Loader`, `AlertTriangle`

### Navigation & Actions
`Home`, `Search`, `Filter`, `Plus`, `Minus`, `Edit`, `Trash2`, `Eye`, `ArrowRight`, `ChevronDown`, `X`, `Menu`

### Communication
`Phone`, `Mail`, `MessageSquare`, `Bell`, `Send`

### File & Document
`FileText`, `Download`, `Upload`, `Image`, `File`, `Folder`

### Settings & Configuration
`Settings`, `Cog`, `Sliders`, `ToggleLeft`, `ToggleRight`

### Furniture Categories
`Bed`, `Sofa`, `Lamp`, `DoorOpen`, `Monitor`, `Laptop`

### Quality & Features
`Award`, `Star`, `Zap`, `Headphones`, `Shield`, `Truck`

### Time & Calendar
`Calendar`, `CalendarDays`, `Clock`, `Timer`

### Charts & Analytics
`BarChart3`, `TrendingUp`, `TrendingDown`, `PieChart`, `Activity`

### Location & Delivery
`MapPin`, `Navigation`, `Truck`, `Home`

## ✅ Best Practices

### DO
- Use semantic icons that match content meaning
- Follow established sizing patterns
- Import from centralized index file
- Use consistent spacing (mr-2, mb-4, etc.)
- Apply appropriate colors for status

### DON'T
- Use emojis in UI components
- Create custom SVG icons
- Use icon-only buttons without labels
- Use decorative icons without purpose
- Mix multiple icon libraries

## 🔧 Adding New Icons

1. **Check Lucide Library**: Verify icon exists at [lucide.dev](https://lucide.dev)
2. **Add to Index**: Include in appropriate category in `index.js`
3. **Use Semantic Names**: Choose names that reflect purpose
4. **Update Documentation**: Add to this README

### Example Addition
```jsx
// In src/components/icons/index.js
export { 
  NewIcon,
  AnotherIcon
} from 'lucide-react';
```

## 🎯 Common Patterns

### Button with Icon
```jsx
<Button className="flex items-center">
  <Plus className="w-4 h-4 mr-2" />
  Add Product
</Button>
```

### Status Badge
```jsx
<span className="inline-flex items-center px-2 py-1 text-sm bg-green-100 text-green-700 rounded-md">
  <CheckCircle className="w-4 h-4 mr-1" />
  Active
</span>
```

### Navigation Item
```jsx
<Link className="flex items-center p-2 hover:bg-slate-100 rounded-lg">
  <Home className="w-5 h-5 mr-3 text-slate-600" />
  <span>Dashboard</span>
</Link>
```

### Feature Card
```jsx
<div className="text-center p-6">
  <div className="mx-auto w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
    <Package className="w-6 h-6 text-cyan-600" />
  </div>
  <h3>Quality Products</h3>
</div>
```

## 🚨 Accessibility

### Icon-Only Buttons
```jsx
<button aria-label="Close dialog">
  <X className="w-5 h-5" />
</button>
```

### Decorative Icons
```jsx
<CheckCircle className="w-5 h-5" aria-hidden="true" />
```

## 📱 Responsive Considerations

- Use appropriate sizes for touch targets (minimum 44px)
- Consider icon visibility on small screens
- Maintain consistent spacing across breakpoints
- Test icon clarity at different sizes

This icon system ensures consistent, professional, and maintainable icon usage across the entire SMS application while following Neo-Enterprise design principles.