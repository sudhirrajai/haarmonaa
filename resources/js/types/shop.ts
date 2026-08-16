export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id?: number;
  name?: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
  image?: string;
  attributes?: { [key: string]: string };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  isNew?: boolean;
  isHot?: boolean;
  discountPercent?: number;
  colors?: ProductColor[];
  sizes?: string[];
  category: string;
  categories?: string[];
  description: string;
  inStock: boolean;
  stockQuantity?: number;
  onSale?: boolean;
  images?: string[];
  features?: string[];
  variants?: ProductVariant[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  itemCount: number;
  subcategories?: { name: string; slug: string; count: number }[];
}

export interface CartItem {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
  link: string;
  buttonText: string;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  onSaleOnly: boolean;
  inStockOnly: boolean;
  sortBy: string;

}
