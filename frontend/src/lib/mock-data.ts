export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  featured?: boolean
  sizes?: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
}

export const categories: Category[] = [
  { id: "1", name: "Corrida", slug: "running" },
  { id: "2", name: "Treino", slug: "training" },
  { id: "3", name: "Basquete", slug: "basketball" },
  { id: "4", name: "Futebol", slug: "soccer" },
  { id: "5", name: "Acessórios", slug: "accessories" },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Tênis Pro Runner X1",
    description: "Tênis de corrida de alta performance com tecnologia avançada de amortecimento",
    price: 189.99,
    category: "corrida",
    image: "/professional-running-shoes-black-and-white-athleti.jpg",
    stock: 45,
    featured: true,
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
  },
  {
    id: "2",
    name: "Shorts de Treino Elite",
    description: "Shorts respiráveis para treino com tecido que absorve umidade",
    price: 49.99,
    category: "treino",
    image: "/black-athletic-training-shorts-sportswear.jpg",
    stock: 120,
    featured: true,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "3",
    name: "Bola de Basquete Court Master",
    description: "Bola de basquete profissional com aderência superior",
    price: 79.99,
    category: "basquete",
    image: "/orange-basketball-professional-sports-ball.jpg",
    stock: 67,
    featured: true,
  },
  {
    id: "4",
    name: "Chuteira Speed Strike",
    description: "Chuteira de futebol leve para máxima agilidade",
    price: 159.99,
    category: "futebol",
    image: "/black-soccer-cleats-football-boots-athletic.jpg",
    stock: 34,
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
  },
  {
    id: "5",
    name: "Bolsa de Academia Performance",
    description: "Bolsa espaçosa para academia com múltiplos compartimentos",
    price: 69.99,
    category: "acessórios",
    image: "/black-sports-gym-bag-athletic-duffel.jpg",
    stock: 89,
  },
  {
    id: "6",
    name: "Camisa de Compressão",
    description: "Ajuste de compressão para melhor desempenho",
    price: 59.99,
    category: "treino",
    image: "/black-compression-shirt-athletic-wear.jpg",
    stock: 156,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "7",
    name: "Tênis Trail Runner Pro",
    description: "Tênis de corrida para todos os terrenos e aventuras ao ar livre",
    price: 199.99,
    category: "corrida",
    image: "/trail-running-shoes-outdoor-athletic-footwear.jpg",
    stock: 28,
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
  },
  {
    id: "8",
    name: "Camisa de Basquete Elite",
    description: "Camisa de basquete premium com malha respirável",
    price: 89.99,
    category: "basquete",
    image: "/black-basketball-jersey-athletic-sportswear.jpg",
    stock: 73,
    sizes: ["P", "M", "G", "GG"],
  },
]

export interface Order {
  id: string
  customerName: string
  products: { productId: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
}

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "João Silva",
    products: [
      { productId: "1", quantity: 1, price: 189.99 },
      { productId: "2", quantity: 2, price: 49.99 },
    ],
    total: 289.97,
    status: "delivered",
    date: "2025-01-05",
  },
  {
    id: "ORD-002",
    customerName: "Maria Santos",
    products: [{ productId: "3", quantity: 1, price: 79.99 }],
    total: 79.99,
    status: "shipped",
    date: "2025-01-06",
  },
  {
    id: "ORD-003",
    customerName: "Pedro Costa",
    products: [
      { productId: "4", quantity: 1, price: 159.99 },
      { productId: "5", quantity: 1, price: 69.99 },
    ],
    total: 229.98,
    status: "processing",
    date: "2025-01-06",
  },
  {
    id: "ORD-004",
    customerName: "Ana Oliveira",
    products: [{ productId: "6", quantity: 3, price: 59.99 }],
    total: 179.97,
    status: "pending",
    date: "2025-01-06",
  },
]

export interface SalesData {
  month: string
  revenue: number
  orders: number
}

export const salesData: SalesData[] = [
  { month: "Jul", revenue: 12500, orders: 45 },
  { month: "Ago", revenue: 15800, orders: 58 },
  { month: "Set", revenue: 18200, orders: 67 },
  { month: "Out", revenue: 21500, orders: 78 },
  { month: "Nov", revenue: 25300, orders: 92 },
  { month: "Dez", revenue: 32100, orders: 115 },
  { month: "Jan", revenue: 28900, orders: 98 },
]
