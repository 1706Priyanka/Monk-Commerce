import { useEffect, useState } from "react";
import { AddProductCard } from "../components/AddProductCard";
import { useProductContext } from "../context/ProductContext";
import { AddProductModal } from "../components/AddProductModal";
import { IProduct, ISelectedProduct, IVariant } from "../types";

export const ProductPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedProduct, setTempSelectedProduct] = useState<IProduct[]>([]);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);

  const {
    productData,
    setProductData,
    pageNumber,
    setPageNumber,
    hasMore,
    isEmptySearch,
    fetchProductList,
    selectedProduct,
    setSelectedProduct,
  } = useProductContext();

  // 1. Update showListProductModal to always start fresh
  function showListProductModal(productIndex: number) {
    setShowModal(true);
    setEditingProductIndex(productIndex); // Track which product we're replacing
    fetchProductList();
    setTempSelectedProduct([]); // Always start with empty selection
  }

  // 2. Update handleAddProducts to replace at the index
  function handleAddProducts() {
    if (tempSelectedProduct.length === 0) return;

    // Filter out products that are already in selectedProduct
    const uniqueNewProducts = tempSelectedProduct.filter(
      (newProduct) =>
        !selectedProduct.some(
          (existingProduct) => existingProduct.id === newProduct.id
        )
    );

    if (uniqueNewProducts.length === 0) {
      // All selected products are already in the list
      closeProductModal();
      return;
    }

    const updatedProducts = uniqueNewProducts.map((product) => ({
      ...product,
      showVariants: true,
      showDiscount: false,
      discountValue: "",
      discountType: "% Off"
    })) as ISelectedProduct[];

    if (editingProductIndex !== null) {
      // Editing existing product (could be empty or existing)
      setSelectedProduct((prev: ISelectedProduct[]) => [
        ...prev.slice(0, editingProductIndex),
        ...updatedProducts,
        ...prev.slice(editingProductIndex + 1),
      ]);
    } else {
      // Adding new product
      setSelectedProduct((prev) => [...prev, ...updatedProducts]);
    }

    closeProductModal();
  }

  function closeProductModal() {
    setShowModal(false);
    setSearchTerm("");
    setProductData([]);
    setPageNumber(1);
    setEditingProductIndex(null); // Reset editing index
  }

  function handleOnSelection(productId: number, variantId: number | null) {
    const updatedSelection = structuredClone(tempSelectedProduct || []);
    const productIndex = updatedSelection.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      // Product not in selection, add it with the selected variant
      const productToAdd = productData.find((p) => p.id === productId);
      if (!productToAdd) return;

      if (variantId) {
        // Only add the selected variant
        const variantToAdd = productToAdd.variants.find(
          (v) => v.id === variantId
        );
        if (!variantToAdd) return;
        updatedSelection.push({
          ...productToAdd,
          variants: [
            {
              ...variantToAdd,
              showDiscount: false,
              discountValue: "",
              discountType: "% Off",
            } as IVariant,
          ],
        });
      } else {
        // Add entire product with all variants
        updatedSelection.push({
          ...productToAdd,
          variants: productToAdd.variants.map((v) => ({
            ...v,
            showDiscount: false,
            discountValue: "",
            discountType: "% Off",
          })),
        });
      }
    } else {
      // Product already in selection
      if (variantId === null) {
        // Toggle entire product
        updatedSelection.splice(productIndex, 1);
      } else {
        // Toggle specific variant
        const variantIndex = updatedSelection[productIndex].variants.findIndex(
          (v) => v.id === variantId
        );

        if (variantIndex === -1) {
          // Add variant if not already selected
          const variantToAdd = productData
            .find((p) => p.id === productId)
            ?.variants.find((v) => v.id === variantId);
          updatedSelection[productIndex].variants.push({
            ...variantToAdd,
            showDiscount: false,
            discountValue: "",
            discountType: "% Off",
          } as IVariant);
        } else {
          // Remove variant if already selected
          updatedSelection[productIndex].variants.splice(variantIndex, 1);
          // Remove product if no variants left
          if (updatedSelection[productIndex].variants.length === 0) {
            updatedSelection.splice(productIndex, 1);
          }
        }
      }
    }

    setTempSelectedProduct(updatedSelection);
  }

  const isProductSelected = (productId: number) => {
    return tempSelectedProduct?.some((p) => p.id === productId) ?? false;
  };

  const isVariantSelected = (productId: number, variantId: number) => {
    const product = tempSelectedProduct?.find((p) => p.id === productId);
    return product?.variants?.some((v) => v.id === variantId) ?? false;
  };

  useEffect(() => {
  }, [selectedProduct]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchProductList(searchTerm);
      } else {
        // fetchProductList()
      }
    }, 500);

    return () => clearTimeout(debounceTimer); // clear debounce on typing
  }, [searchTerm]);

  const fetchMoreData = () => {
    if (!hasMore) return;

    // Calculate next page first
    const nextPage = pageNumber + 1;

    // Update state and fetch in the correct order
    setPageNumber(nextPage);
    fetchProductList("", true, nextPage);
  };

  const moveProduct = (fromIndex: number, toIndex: number) => {
    const updatedProducts = [...selectedProduct];
    const [movedItem] = updatedProducts.splice(fromIndex, 1);
    updatedProducts.splice(toIndex, 0, movedItem);
    setSelectedProduct(updatedProducts);
  };

  const moveVariant = (
    fromIndex: number,
    toIndex: number,
    product: IProduct,
    productId: number
  ) => {
    const updatedProducts = [...product.variants];
    const [movedItem] = updatedProducts.splice(fromIndex, 1);
    updatedProducts.splice(toIndex, 0, movedItem);
    setSelectedProduct((previousItems) =>
      previousItems.map((product) =>
        product.id === productId
          ? { ...product, variants: updatedProducts }
          : product
      )
    );
  };

  return (
    <>
      <AddProductCard
        showListProductModal={showListProductModal}
        moveProduct={moveProduct}
        moveVariant={moveVariant}
        setEditingProductIndex={setEditingProductIndex}
        setTempSelectedProduct={setTempSelectedProduct}
      />
      <AddProductModal
        showModal={showModal}
        closeProductModal={closeProductModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        productData={productData}
        fetchMoreData={fetchMoreData}
        hasMore={hasMore}
        isProductSelected={isProductSelected}
        handleOnSelection={handleOnSelection}
        isVariantSelected={isVariantSelected}
        isEmptySearch={isEmptySearch}
        tempSelectedProduct={tempSelectedProduct}
        handleAddProducts={handleAddProducts}
      />
    </>
  );
};

