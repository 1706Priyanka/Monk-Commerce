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
  isEmptySearch: boolean;
  setIsEmptySearch: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProductList: (search?: string, isLoadMore?: boolean, page?: number) => void;
  selectedProduct: ISelectedProduct[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<ISelectedProduct[]>>;
}

interface ProductProviderProps {
  children: ReactNode;
}

// 1. Create Context with default value
const ProductContext = createContext<IProductContext>({
  productData: [],
  setProductData: () => {},
  pageNumber: 1,
  setPageNumber: () => {},
  hasMore: true,
  setHasMore: () => {},
  isEmptySearch: false,
  setIsEmptySearch: () => {},
  fetchProductList: () => {},
  selectedProduct: [],
  setSelectedProduct: () => {},
});

// 2. Create Provider
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [productData, setProductData] = useState<IProduct[]>([]);
  const [pageNumber, setPageNumber] = useState(1); 
  const [hasMore, setHasMore] = useState(true);
  const [isEmptySearch, setIsEmptySearch] = useState(false);
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
          headers: { "x-api-key": "72njgfa948d9aS7gs5" },
        }
      )
      .then((data) => {
        if (isLoadMore) {
          setProductData((prevData) => [...prevData, ...data.data]);
        } else {
          setProductData(data.data);
        }
        setHasMore(data.data.length === 10);
        setIsEmptySearch(data.data.length === 0 && search !== "");
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
      isEmptySearch,
      setIsEmptySearch, 
      fetchProductList,
      selectedProduct, 
      setSelectedProduct 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// 3. Custom Hook for easy usage
export const useProductContext = () => useContext(ProductContext);