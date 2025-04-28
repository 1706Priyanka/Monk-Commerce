export interface IProduct {
    id: number;
    title: string;
    image: Record<string, string>;
    variants: IVariant[];
  }
  
  export interface IVariant {
    id: number;
    product_id: number;
    title: string;
    price: string;
    inventory_quantity: number;
  }

  export interface ISelectedProduct{
    id: number;
    title: string;
    variants: IVariant[]; 
    showVariants: boolean;
    showDiscount: boolean;
    discountValue: string;
    discountType: string;
  }