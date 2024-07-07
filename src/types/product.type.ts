export type Product = {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  image: string;
  stock: [
    {
      size: string;
      qty: number;
    }
  ];
  created_at: Date;
  updated_at: Date;
};
