export interface Product {
  id: string;
  name: string;
  description: string;
  variants: string[];
  price: number;
  rating: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  selectedVariant: string;
  quantity: number;
}
