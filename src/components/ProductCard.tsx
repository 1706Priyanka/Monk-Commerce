import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { ISelectedProduct } from "../types";

interface ProductCardProps {
  productIndex: number;
  product: ISelectedProduct;
  showListProductModal: (index: number) => void;
  toggleShowDiscount: (id: number) => void;
  handleDiscountChange: (id: number, value: string) => void;
  handleDiscountTypeChange: (id: number, value: "% Off" | "Flat Off") => void;
  handleRemoveProduct: (id: number) => void;
  moveProduct: (fromIndex: number, toIndex: number) => void;
}

export const ProductCard = ({
  productIndex,
  product,
  showListProductModal,
  toggleShowDiscount,
  handleDiscountChange,
  handleDiscountTypeChange,
  handleRemoveProduct,
  moveProduct,
}: ProductCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "PRODUCT",
    hover(item: { index: number }) {
      moveProduct(item.index, productIndex);
      item.index = productIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "PRODUCT",
    item: { id: product.id, productIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <>
      <div className="flex w-full gap-4 h-[40px] items-center" ref={ref}>
        <div className="flex items-center w-[75%]">
          <img
            src="drag-drop-icon.svg"
            alt="product"
            className="w-[20px] h-[16px] mr-[12px] cursor-grab"
          />
          <span className="mr-2">{productIndex + 1}.</span>
          <div className="flex bg-white p-1 shadow-sm rounded-sm w-full">
            <input
              className="w-full outline-none placeholder-gray-400"
              value={product.title}
              placeholder="Select Product"
              readOnly
            />
            <img
              src="edit-icon.svg"
              onClick={() => showListProductModal(productIndex)}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="flex-2 w-[25%]">
          {!product.showDiscount && (
            <button
              className="bg-[#008060] text-white px-5 py-0.5 rounded-md ml-2 w-full cursor-pointer"
              onClick={() => toggleShowDiscount(product.id)}
            >
              Add Discount
            </button>
          )}

          {product.showDiscount && (
            <div className="flex items-center justify-between gap-4 relative">
              <input
                className="outline-transparent bg-white p-1 w-1/3  shadow-sm rounded-sm placeholder-gray-400"
                placeholder="20"
                type="number"
                min={0}
                value={product.discountValue}
                onChange={(e) =>
                  handleDiscountChange(product.id, e.target.value)
                }
              />
              <select
                className="bg-white p-1 w-2/3 shadow-sm rounded-sm"
                value={product.discountType}
                onChange={(e) =>
                  handleDiscountTypeChange(
                    product.id,
                    e.target.value as "% Off" | "Flat Off"
                  )
                }
              >
                <option>% Off</option>
                <option>Flat Off</option>
              </select>
            </div>
          )}
        </div>

        <button
          className="ml-2"
          onClick={() => handleRemoveProduct(product.id)}
        >
          <img src="cancel-gray-icon.svg"  className="cursor-pointer" />
        </button>
      </div>
    </>
  );
};
