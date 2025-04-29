import { useProductContext } from "../context/ProductContext";
import { IProduct, ISelectedProduct, IVariant } from "../types";
import { ProductCard } from "./ProductCard";
import { VariantCard } from "./VariantCard";

interface AddProductCardProps {
  showListProductModal: (index: number) => void;
  moveProduct: (fromIndex: number, toIndex: number) => void;
  moveVariant: (
    fromIndex: number,
    toIndex: number,
    product: ISelectedProduct,
    productId: number
  ) => void;
  setEditingProductIndex: (index: number | null) => void;
  setTempSelectedProduct: (products: IProduct[]) => void;
}

export const AddProductCard = ({
  showListProductModal,
  moveProduct,
  moveVariant,
  setEditingProductIndex,
  setTempSelectedProduct,
}: AddProductCardProps) => {
  const { selectedProduct, setSelectedProduct } = useProductContext();

  function addProduct() {
    const lastProduct = selectedProduct[selectedProduct.length - 1];
    if (lastProduct && !lastProduct.title && lastProduct.variants.length === 0) {
      return;
    }
    setSelectedProduct((prev) => [
      ...prev,
      {
        id: 0,
        title: "",
        variants: [],
        showVariants: false,
        showDiscount: false,
        discountValue: "",
        discountType: "% Off",
      },
    ]);
  }

  function toggleShowVariants(productId: number) {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, showVariants: !p.showVariants } : p
      )
    );
  }

  function toggleShowDiscount(productId: number) {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, showDiscount: !p.showDiscount } : p
      )
    );
  }

  function handleRemoveProduct(productId: number) {
    setSelectedProduct((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );
  }

  function handleRemoveVariant(productId: number, variantId: number) {
    setSelectedProduct(
      (prevProducts) =>
        prevProducts
          .map((p) => {
            if (p.id === productId) {
              const updatedVariants = p.variants.filter(
                (v) => v.id !== variantId
              );
              return { ...p, variants: updatedVariants };
            }
            return p;
          })
          .filter((p) => p.variants.length > 0 || p.id !== productId) // if no variants left, you can also remove product if you want
    );
  }

  function handleDiscountChange(productId: number, value: string) {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, discountValue: value } : p
      )
    );
  }

  function handleDiscountTypeChange(productId: number, type: string) {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, discountType: type } : p
      )
    );
  }

  function toggleShowVariantDiscount(productId: number, variantId: number) {
    setSelectedProduct((prevProducts: ISelectedProduct[]) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === variantId ? { ...v, showDiscount: !v.showDiscount } : v
            ),
          };
        }
        return p;
      })
    );
  }

  function handleVariantDiscountChange(
    productId: number,
    variantId: number,
    value: string
  ) {
    setSelectedProduct((prevProducts: ISelectedProduct[]) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === variantId ? { ...v, discountValue: value } : v
            ),
          };
        }
        return p;
      })
    );
  }

  function handleVariantDiscountTypeChange(
    productId: number,
    variantId: number,
    type: string
  ) {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === variantId ? { ...v, discountType: type } : v
            ),
          };
        }
        return p;
      })
    );
  }

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen p-4">
        <div className="flex flex-col items-start h-full w-[55%]">
          <h2 className="font-medium text-lg">Add Products</h2>
          <div className="flex justify-between w-full px-[56px] my-4">
            <p className="w-[82%] font-semibold">Product</p>
            <p className="w-[18%] font-semibold">Discount</p>
          </div>
          <div className="w-full">
            <div className="">
              {selectedProduct.map(
                (product: ISelectedProduct, productIndex: number) => (
                  <div key={productIndex} className="pb-2 mb-2">
                    {/* Parent Product Row */}
                    <ProductCard
                      productIndex={productIndex}
                      product={product}
                      showListProductModal={showListProductModal}
                      toggleShowDiscount={toggleShowDiscount}
                      handleDiscountChange={handleDiscountChange}
                      handleDiscountTypeChange={handleDiscountTypeChange}
                      handleRemoveProduct={handleRemoveProduct}
                      moveProduct={moveProduct}
                    />

                    {/* Toggle to show/hide variants */}
                    {/* Only show variant toggle if product has variants */}
                    {product?.variants?.length > 0 && (
                      <>
                        <div
                          className="text-blue-500 cursor-pointer ml-6 pt-[4px] text-sm flex justify-end"
                          onClick={() => toggleShowVariants(product.id)}
                        >
                          {product.showVariants
                            ? "Hide variants ▲"
                            : "View variants ▼"}
                        </div>
                        {product.showVariants && (
                          <div className="ml-8 mt-2 flex flex-col gap-2">
                            {product.variants.map(
                              (variant: IVariant, variantIndex: number) => (
                                <VariantCard
                                  key={variant.id} // Added key prop
                                  variantIndex={variantIndex}
                                  variant={variant}
                                  toggleShowVariantDiscount={
                                    toggleShowVariantDiscount
                                  }
                                  handleVariantDiscountChange={
                                    handleVariantDiscountChange
                                  }
                                  handleVariantDiscountTypeChange={
                                    handleVariantDiscountTypeChange
                                  }
                                  handleRemoveVariant={handleRemoveVariant}
                                  moveVariant={moveVariant}
                                  product={product}
                                  productId={product.id}
                                />
                              )
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              )}
            </div>

            <button
              className="text-[#008060] border-2 border-[#008060] rounded-sm bg-[#F6F6F8] float-right h-9 w-[200px] cursor-pointer self-end font-bold"
              onClick={() => {
                setEditingProductIndex(null);
                setTempSelectedProduct([]);
                addProduct();
              }}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
