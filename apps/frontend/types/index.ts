export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  item: MenuItem;
  qty: number;
}

export interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
}