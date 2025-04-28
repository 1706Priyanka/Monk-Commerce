import { useProductContext } from "../context/ProductContext";
import { IProduct, ISelectedProduct, IVariant } from "../types";
import { ProductCard } from "./ProductCard";
import { VariantCard } from "./VariantCard";

interface AddProductCardProps {
  showListProductModal: () => void;
  moveProduct: (fromIndex: number, toIndex: number) => void;
  moveVariant: (
    fromIndex: number,
    toIndex: number,
    product: IProduct,
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
  const { selectedProduct, setSelectedProduct }  = useProductContext();



  function addProduct() {
    setSelectedProduct((prev) => [
      ...prev,
      {
        id: null,
        title: "",
        variants: [],
        showVariants: false,
        showDiscount: false, // Add this new property
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
    setSelectedProduct((prevProducts) =>
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
    setSelectedProduct((prevProducts) =>
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
      <h2 className="add-product-title">Add Products</h2>
      <div className="selected-products">
        {selectedProduct.map((product:ISelectedProduct, productIndex:number) => (
          <div key={productIndex} className="border-b pb-2 mb-2">
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
              <div
                className="text-blue-500 cursor-pointer ml-6 mt-1 text-sm"
                onClick={() => toggleShowVariants(product.id)}
              >
                {product.showVariants ? "Hide variants ▲" : "View variants ▼"}
              </div>
            )}

            {/* Child Variant Rows */}
            {product.showVariants && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                {product.variants.map((variant:IVariant, variantIndex:number) => {
                  return (
                    <VariantCard
                      variantIndex={variantIndex}
                      variant={variant}
                      toggleShowVariantDiscount={toggleShowVariantDiscount}
                      handleVariantDiscountChange={handleVariantDiscountChange}
                      handleVariantDiscountTypeChange={
                        handleVariantDiscountTypeChange
                      }
                      handleRemoveVariant={handleRemoveVariant}
                      moveVariant={moveVariant}
                      product={product}
                      productId={product.id}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <button
          className="add-product-btn"
          onClick={() => {
            setEditingProductIndex(null);
            setTempSelectedProduct([]); 
            addProduct();
          }}
        >
          Add Product
        </button>
      </div>
    </>
  );
};
