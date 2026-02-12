# Stock Management System (SMS) - Frontend

A modern, responsive web application for comprehensive stock management with role-based access control and Neo-Enterprise UI design.

## Overview

The Stock Management System frontend provides a secure, intuitive interface for managing inventory, orders, and user accounts across three distinct user roles: Super Admin, Admin, and Customer. Built with modern web technologies and featuring a sleek Neo-Enterprise design with subtle Glassmorphism elements.

## Key Features

### Role-Based Access Control (RBAC)
- **Super Admin**: Full system access, user management, system configuration
- **Admin**: Inventory management, order processing, reporting
- **Customer**: Product browsing, order placement, account management

### Core Functionality
- Real-time inventory tracking
- Order management and processing
- User authentication and authorization
- Responsive dashboard interfaces
- Advanced search and filtering
- Comprehensive reporting tools

### Design System
- Neo-Enterprise UI components
- Subtle Glassmorphism effects
- Fully responsive design
- Accessibility compliant (WCAG guidelines)
- Dark/light theme support

## Technology Stack

- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit / Zustand
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Custom component library
- **Authentication**: JWT-based with refresh tokens
- **API Integration**: Axios with interceptors
- **Routing**: React Router v6
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sms-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
