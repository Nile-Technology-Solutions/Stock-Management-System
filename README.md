# Stock Management System

A comprehensive stock management system with public-facing product showcase, order placement, and tracking capabilities.

## 🚀 Quick Start

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

---

## 📁 Project Structure

```
Stock-Management-System/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/        # Common components (Button, Modal, etc.)
│   │   │   ├── public/        # Public-facing components
│   │   │   ├── layout/        # Layout components
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── public/        # Public pages (Home, Products, etc.)
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── admin/         # Admin pages
│   │   │   └── payment/       # Payment result pages
│   │   ├── services/          # API services
│   │   │   ├── api.js         # Base API configuration
│   │   │   ├── stockApi.js    # Public API endpoints
│   │   │   └── authApi.js     # Authentication API
│   │   ├── routes/            # Routing configuration
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── context/           # React context providers
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies
│   └── vite.config.js         # Vite configuration
└── README.md                  # This file
```

---

## ✨ Features

### Public Interface
- **Product Showcase**: Browse products with filtering and search
- **Product Details**: View detailed product information
- **Order Placement**: Complete order flow with payment integration
- **Order Tracking**: Real-time order status tracking
- **News**: Latest announcements and updates

### Technical Features
- **Mobile-First Design**: Responsive across all devices
- **Modern UI**: Clean, premium design with Tailwind CSS
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error states with retry options
- **Payment Integration**: Chapa and Telebirr support

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **ESLint** - Code linting

### Backend (To be implemented)
- API endpoints for products, orders, news
- Payment gateway integration
- Order management system

---

## 🎯 Available Routes

### Public Routes
- `/` - Home page
- `/products` - Product showcase
- `/products/:id` - Product details
- `/order/:productId` - Order placement
- `/order-tracking` - Track orders
- `/news` - Latest news

### Authentication
- `/login` - User login
- `/register` - User registration

### Payment
- `/payment/success` - Payment successful
- `/payment/failed` - Payment failed
- `/payment/pending` - Payment pending

### Admin (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/analytics` - Analytics
- `/admin/stock` - Stock management
- `/admin/production` - Production management
- `/admin/orders` - Order management
- `/admin/payments` - Payment management (Super Admin only)

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📦 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Categories
- `GET /api/categories` - Get all categories

### News
- `GET /api/news` - Get published news

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/track/:id` - Track order

---

## 🧪 Testing

### Manual Testing
```bash
npm run dev
```

Then test:
1. Product browsing and filtering
2. Order placement flow
3. Order tracking
4. Responsive design
5. Error states
6. Loading states

### Build Testing
```bash
npm run build
npm run preview
```

---

## 🚀 Deployment

### Build for Production
```bash
cd frontend
npm run build
```

The optimized build will be in `frontend/dist/`

### Deploy to Hosting
Upload the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

---

## 👥 Development Team Roles

### Public UI Developer (Current Implementation)
- ✅ Public product showcase
- ✅ Order placement flow
- ✅ Order tracking
- ✅ News display
- ✅ Reusable components

### Backend Developer (Pending)
- ⏳ API implementation
- ⏳ Payment gateway integration
- ⏳ Order management
- ⏳ Database setup

### Admin Developer
- ⏳ Admin dashboard
- ⏳ Stock management
- ⏳ Analytics
- ⏳ Production management

---

## 📝 Contributing

### Code Style
- Use ESLint for code quality
- Follow existing code patterns
- Write clear comments
- Use meaningful variable names

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Create pull request
6. Wait for review

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Dependencies not installing**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue: API calls failing**
- Check backend is running
- Verify `.env` configuration
- Check browser console for errors

**Issue: Styles not loading**
- Restart dev server
- Clear browser cache
- Check Tailwind configuration

---

## 📄 License

This project is proprietary and confidential.

---

## 📞 Support

For questions or issues:
1. Check documentation files
2. Review code comments
3. Contact development team

---

## 🎉 Status

✅ **Public UI**: Complete and ready for testing
⏳ **Backend API**: Pending implementation
⏳ **Admin Interface**: Pending implementation
⏳ **Payment Integration**: Pending implementation

---

**Last Updated**: February 14, 2026

**Version**: 1.0.0 (Public UI)