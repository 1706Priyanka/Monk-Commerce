// ProductContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { productapi } from '../constants';
import axios from 'axios';
import { IProduct, ISelectedProduct } from '../types';

interface IProductContext {
  productData: IProduct[];
  setProductData: React.Dispatch<React.SetStateAction<IProduct[]>>;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProductList: (search?: string, isLoadMore?: boolean, page?: number) => void;
  selectedProduct: ISelectedProduct[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<ISelectedProduct[]>>;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductContext = createContext<IProductContext>({
  productData: [],
  setProductData: () => {},
  pageNumber: 1,
  setPageNumber: () => {},
  hasMore: true,
  setHasMore: () => {},
  fetchProductList: () => {},
  selectedProduct: [],
  setSelectedProduct: () => {},
});

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const apiKey = import.meta.env.VITE_API_KEY
  const [productData, setProductData] = useState<IProduct[]>([]);
  const [pageNumber, setPageNumber] = useState(1); 
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ISelectedProduct[]>([]);

  const fetchProductList = (
    search = "",
    isLoadMore = false,
    page = pageNumber
  ) => {
    axios
      .get(
        search
          ? `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=10`
          : `${productapi}?page=${page}&limit=10`,
        {
          headers: { "x-api-key": apiKey },
        }
      )
      .then((data) => {
        if (isLoadMore) {
          setProductData((prevData) => [...prevData, ...data.data]);
        } else {
          setProductData(data.data);
        }
        setHasMore(data?.data?.length === 10);
      })
      .catch(console.error);
  };

  return (
    <ProductContext.Provider value={{ 
      productData, 
      setProductData, 
      pageNumber,
      setPageNumber,
      hasMore,
      setHasMore,
      fetchProductList,
      selectedProduct, 
      setSelectedProduct 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);