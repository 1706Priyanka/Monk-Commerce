export interface IProduct {
    id: number;
    title: string;
    image: Record<string, string>;
    variants: IVariant[];
    discountValue?:number;
    discountType?:string;
    showDiscount?:string
  }
  
  export interface IVariant {
    id: number;
    product_id: number;
    title: string;
    price: string;
    inventory_quantity: number;
    discountValue?:number;
    discountType?:string;
    showDiscount?:string
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