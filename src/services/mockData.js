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

export const mockUsers = [
  { id: 101, fullName: "Abebe Kebede", username: "abebe_admin", role: "Admin" },
  { id: 102, fullName: "Sara Hailu", username: "sara_customer", role: "Customer" }
];

export const mockNews = [
  {
    id: 1,
    title: "New Arrival: Italian Leather Sofas",
    content: "We have just received a premium shipment of luxury sofas available in 5 colors...",
    status: "Published",
    publishDate: "2023-10-25T08:30:00Z"
  }
];
