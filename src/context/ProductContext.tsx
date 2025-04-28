// ProductContext.js
import React, { createContext, useContext, useState } from 'react';
import { productapi } from '../constants';
import axios from 'axios';
import { IProduct, ISelectedProduct } from '../types';

interface IProductContext {
  selectedProduct: ISelectedProduct,
  setSelectedProduct:(product: ISelectedProduct | null) => void;
}

// 1. Create Context
const ProductContext = createContext<IProductContext>();

// 2. Create Provider
export const ProductProvider = ({ children }) => {
    const [productData, setProductData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1); 
    const [hasMore, setHasMore] = useState(true);
    const [isEmptySearch, setIsEmptySearch] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ISelectedProduct[]>([])

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
            console.log(data);
            if (isLoadMore) {
              setProductData((prevData) => [...prevData, ...data.data]);
            } else {
              setProductData(data.data);
            }
            setHasMore(data.data.length === 10);
            setIsEmptySearch(data.data.length === 0 && search !== ""); // Set empty search state
          })
          .catch(console.error);
      };

  return (
    <ProductContext.Provider value={{ productData, setProductData, pageNumber,setPageNumber,hasMore,setHasMore,isEmptySearch,setIsEmptySearch, fetchProductList,selectedProduct, setSelectedProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// 3. Custom Hook for easy usage
export const useProductContext = () => useContext(ProductContext);
