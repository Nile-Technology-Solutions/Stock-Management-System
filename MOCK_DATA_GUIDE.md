# Mock Data Configuration

## Overview
The Stock Management System frontend is configured to use **mock data** by default. This allows you to develop and test the frontend without needing the backend API running.

## How It Works

### Current Setup
- **Mock Data**: Located in `src/services/mockData.js`
- **Configuration**: Controlled by `useMock` flag in `src/config/env.js`
- **Default**: Mock data is **ENABLED** (useMock = true)

### Mock Data Includes
- 3 sample stock materials with:
  - Product images (from Unsplash)
  - Prices, ratings, descriptions
  - Categories, specifications
  - All fields needed for UI display

### Demo Login Credentials
You can log in with these credentials:

| Role | Username | Password |
|------|----------|----------|
| Customer | `customer` | `customer123` |
| Admin | `admin` | `admin123` |
| Super Admin | `superadmin` | `super123` |

**Quick Login**: Click any demo account card on the login page to auto-fill credentials!

## Switching Between Mock and Real API

### Method 1: Environment Variable (Recommended)
Create a `.env` file in the project root:

```env
# Use mock data (default)
VITE_USE_MOCK=true

# Use real backend API
VITE_USE_MOCK=false

# Backend URL (when using real API)
VITE_API_BASE_URL=http://localhost:5000
```

### Method 2: Direct Configuration
Edit `src/config/env.js`:

```javascript
export const apiConfig = {
  // ... other config
  
  // Change this to false to use real API
  useMock: false  // Set to true for mock data, false for real API
};
```

## When Backend is Ready

**To switch to the real backend:**

1. **Option A**: Create `.env` file with:
   ```env
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:5000
   ```

2. **Option B**: Edit `src/config/env.js`:
   ```javascript
   useMock: false
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

## API Service Structure

### stockApi.js
All API methods check the `USE_MOCK` flag:

```javascript
async getProducts(params = {}) {
  if (USE_MOCK) {
    // Return mock data with simulated delay
    return mockStock;
  }
  
  // Make real API call
  const response = await fetch(`${API_BASE_URL}/api/stock`);
  return response.json();
}
```

### Benefits
- ✅ **Single source of truth**: All API calls go through `stockApi.js`
- ✅ **Easy switching**: Change one flag to toggle mock/real data
- ✅ **No code changes**: Frontend components don't need modification
- ✅ **Realistic testing**: Mock data includes all UI-required fields

## Adding More Mock Data

Edit `src/services/mockData.js`:

```javascript
export const mockStock = [
  {
    id: 4,
    name: "Your New Product",
    quantity: 100,
    color: "Color",
    size: "Size",
    thickness: "Thickness",
    category: "Category",
    price: "Price ETB",
    image: "https://images.unsplash.com/...",
    rating: 4.5,
    description: "Description here",
    // ... other fields
  },
  // ... existing products
];
```

## Backend API Endpoints

When `useMock = false`, the app will call:

- `GET /api/stock` - Get all stock materials
- `GET /api/stock/:id` - Get stock by ID
- `POST /api/stock` - Create stock
- `PUT /api/stock/:id` - Update stock
- `DELETE /api/stock/:id` - Delete stock

See `data/api_spec.yaml` for complete API documentation.

## Troubleshooting

### Mock data not showing?
1. Check `src/config/env.js` - ensure `useMock: true`
2. Check browser console for errors
3. Verify `src/services/mockData.js` exists

### Want to test real API?
1. Ensure backend is running on `http://localhost:5000`
2. Set `useMock: false` in config
3. Restart dev server
4. Check network tab in browser DevTools

## Summary

**Current State**: ✅ Using mock data  
**To use real API**: Set `useMock: false` in `src/config/env.js`  
**No other changes needed**: All components will automatically use the real API
