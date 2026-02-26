/**
 * Mock Data for Stock Management System
 * Based on API Spec v1.4.0
 */

export const mockStock = [
  {
    id: 1,
    name: "Laminated MDF Board",
    quantity: 50,
    color: "Dark Oak",
    size: "1220mm x 2440mm",
    thickness: "18mm",
    laminated: true,
    origin: "Imported",
    category: "Boards",
    typeNote: "High-density water resistant",
    price: "4,500 ETB",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    lastUpdated: "2023-10-27T10:00:00Z",
    isPopular: true,
    isNew: false,
    rating: 4.8,
    description: "Premium quality laminated MDF board with a dark oak finish. Perfect for furniture manufacturing and interior design.",
    specifications: [
      { label: "Material", value: "MDF" },
      { label: "Finish", value: "Laminated" },
      { label: "Density", value: "750 kg/m3" }
    ]
  },
  {
    id: 2,
    name: "Mahogany Solid Wood",
    quantity: 12,
    color: "Natural Red",
    size: "200mm x 3000mm",
    thickness: "25mm",
    laminated: false,
    origin: "Local",
    category: "Lumber",
    typeNote: "Seasoned premium grade",
    price: "12,000 ETB",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800",
    lastUpdated: "2023-10-26T14:30:00Z",
    isPopular: false,
    isNew: true,
    rating: 4.9,
    description: "Authentic local mahogany wood, seasoned for maximum stability. Ideal for high-end cabinetry and furniture.",
    specifications: [
      { label: "Species", value: "Mahogany" },
      { label: "Moisture Content", value: "12%" },
      { label: "Grade", value: "A" }
    ]
  },
  {
    id: 3,
    name: "Particle Board - White",
    quantity: 120,
    color: "Pure White",
    size: "1220mm x 2440mm",
    thickness: "16mm",
    laminated: true,
    origin: "Imported",
    category: "Boards",
    typeNote: "Standard grade for shelving",
    price: "2,800 ETB",
    image: "https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?auto=format&fit=crop&q=80&w=800",
    lastUpdated: "2023-10-25T09:15:00Z",
    isPopular: true,
    isNew: false,
    rating: 4.2,
    description: "Versatile white particle board. Cost-effective solution for office furniture and cabinetry interiors.",
    specifications: [
      { label: "Material", value: "Particle" },
      { label: "Finish", value: "Melamine" },
      { label: "Core color", value: "Standard" }
    ]
  }
];

// Mock Users with Demo Credentials
export const mockUsers = [
  {
    id: 101,
    fullName: "Abebe Kebede",
    username: "admin",
    password: "admin123",
    role: "Admin",
    email: "admin@sms.com"
  },
  {
    id: 102,
    fullName: "Sara Hailu",
    username: "customer",
    password: "customer123",
    role: "Customer",
    email: "customer@sms.com"
  },
  {
    id: 103,
    fullName: "Super Admin",
    username: "superadmin",
    password: "super123",
    role: "SuperAdmin",
    email: "superadmin@sms.com"
  }
];

// Demo Credentials Info (for display on login page)
export const demoCredentials = {
  admin: {
    username: "admin",
    password: "admin123",
    role: "Admin"
  },
  customer: {
    username: "customer",
    password: "customer123",
    role: "Customer"
  },
  superadmin: {
    username: "superadmin",
    password: "super123",
    role: "SuperAdmin"
  }
};

export const mockNews = [
  {
    id: 1,
    title: "Eco-Friendly Wood Sourcing Initiative",
    category: "Sustainability",
    content: "Nile Technology is proud to announce our partnership with local forest reserves to ensure 100% sustainable wood sourcing. Our new initiative aims to plant ten trees for every mahogany board sold, ensuring a greener future for Ethiopia's furniture industry.",
    status: "Published",
    publishDate: "2026-02-15T10:00:00Z",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "New Smart Inventory Tracking Launched",
    category: "Technology",
    content: "We have successfully integrated RFID tracking for all incoming imported boards. This system reduces inventory errors by 40% and allows customers to track their orders in real-time through our new mobile app extension.",
    status: "Published",
    publishDate: "2026-02-10T14:30:00Z",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Spring Furniture Expo 2026",
    category: "Events",
    content: "Join us at the Addis Ababa Exhibition Center this April as we showcase our upcoming 'Minimalist Series'. The event will feature live demonstrations of our precision wood-cutting technology and networking sessions for interior designers.",
    status: "Draft",
    publishDate: "2026-02-18T09:00:00Z",
    image: "https://images.unsplash.com/photo-1531050171669-011999115de5?auto=format&fit=crop&q=80&w=800"
  }
];

export const mockProduction = [
  {
    id: "B-2023-001",
    product: "Luxury Leather Sofa",
    quantity: 5,
    status: "Completed",
    startDate: "2023-10-20",
    completionDate: "2023-10-25",
    photos: []
  },
  {
    id: "B-2023-002",
    product: "Oak Dining Table",
    quantity: 10,
    status: "UnderProcess",
    startDate: "2023-10-24",
    completionDate: "-",
    photos: []
  }
];

export const mockOrders = [
  {
    id: "ORD-7721",
    customer: "John Doe",
    items: "Laminated MDF (20), Hardware Kit (5)",
    total: "12,500 ETB",
    status: "Processing",
    date: "2023-10-26"
  },
  {
    id: "ORD-8812",
    customer: "Sara Hailu",
    items: "Mahogany Dining Set (1)",
    total: "45,000 ETB",
    status: "Delivered",
    date: "2023-10-25"
  },
  {
    id: "ORD-9910",
    customer: "Abebe Kebede",
    items: "Office Chair Series-X (4)",
    total: "18,000 ETB",
    status: "Canceled",
    date: "2023-10-24"
  }
];

export const mockTodos = [
  { id: 1, text: "Check morning stock arrival", completed: false, date: "2026-02-17" },
  { id: 2, text: "Review production batch B-002", completed: true, date: "2026-02-17" },
  { id: 3, text: "Approve pending orders", completed: false, date: "2026-02-17" },
  { id: 4, text: "Monthly inventory audit", completed: false, date: "2026-02-18" }
];
