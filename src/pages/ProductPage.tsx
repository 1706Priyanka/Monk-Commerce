import { useState } from "react";
import { AddProductCard } from "../components/AddProductCard";
import { useProductContext } from "../context/ProductContext";
import { AddProductModal } from "../components/AddProductModal";
import { IProduct, ISelectedProduct, IVariant } from "../types";

export const ProductPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedProduct, setTempSelectedProduct] = useState<IProduct[]>(
    []
  );
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(
    null
  );

  const {
    productData,
    setProductData,
    pageNumber,
    setPageNumber,
    hasMore,
    fetchProductList,
    selectedProduct,
    setSelectedProduct,
  } = useProductContext();


  function showListProductModal(productIndex: number) {
    setShowModal(true);
    setEditingProductIndex(productIndex); 
    fetchProductList();
    setTempSelectedProduct([]); 
  }


  function handleAddProducts() {
    if (tempSelectedProduct.length === 0) return;

    const uniqueNewProducts = tempSelectedProduct.filter(
      (newProduct) =>
        !selectedProduct.some(
          (existingProduct) => existingProduct.id === newProduct.id
        )
    );

    if (uniqueNewProducts.length === 0) {
      closeProductModal();
      return;
    }

    const updatedProducts = uniqueNewProducts.map((product) => ({
      ...product,
      showVariants: false,
      showDiscount: false,
      discountValue: "",
      discountType: "% Off",
    })) as ISelectedProduct[];

    if (editingProductIndex !== null) {
      setSelectedProduct((prev: ISelectedProduct[]) => [
        ...prev.slice(0, editingProductIndex),
        ...updatedProducts,
        ...prev.slice(editingProductIndex + 1),
      ]);
    } else {
      setSelectedProduct((prev) => [...prev, ...updatedProducts]);
    }

    closeProductModal();
  }

  function closeProductModal() {
    setShowModal(false);
    setSearchTerm("");
    setProductData([]);
    setPageNumber(1);
    setEditingProductIndex(null);
  }

  function handleOnSelection(productId: number, variantId: number | null) {
    const updatedSelection = structuredClone(tempSelectedProduct || []);
    const productIndex = updatedSelection.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      const productToAdd = productData.find((p) => p.id === productId);
      if (!productToAdd) return;

      if (variantId) {
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
      if (variantId === null) {
        updatedSelection.splice(productIndex, 1);
      } else {
        const variantIndex = updatedSelection[productIndex].variants.findIndex(
          (v) => v.id === variantId
        );

        if (variantIndex === -1) {
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
          updatedSelection[productIndex].variants.splice(variantIndex, 1);
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

  function getSearchProduct(searchText: string) {
    setTimeout(() => {
      if (searchText.trim() !== "") {
        fetchProductList(searchText);
      } else {
        fetchProductList();
      }
    }, 500);
  }

  const fetchMoreData = () => {
    if (!hasMore) return;

    const nextPage = pageNumber + 1;

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
        tempSelectedProduct={tempSelectedProduct}
        handleAddProducts={handleAddProducts}
        getSearchProduct={getSearchProduct}
      />
    </>
  );
};
