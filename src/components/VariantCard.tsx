import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { ISelectedProduct, IVariant } from "../types";

interface DragItem {
  id: number;
  variantIndex: number;
}

export interface VariantCardProps {
  variantIndex: number;
  variant: IVariant;
  toggleShowVariantDiscount: (productId: number, variantId: number) => void;
  handleVariantDiscountChange: (
    productId: number,
    variantId: number,
    value: string
  ) => void;
  handleVariantDiscountTypeChange: (
    productId: number,
    variantId: number,
    value: "% Off" | "Flat Off"
  ) => void;
  handleRemoveVariant: (productId: number, variantId: number) => void;
  moveVariant: (
    dragIndex: number,
    hoverIndex: number,
    product: ISelectedProduct,
    productId: number
  ) => void;
  product: ISelectedProduct;
  productId: number;
}

export const VariantCard = ({
  variantIndex,
  variant,
  toggleShowVariantDiscount,
  handleVariantDiscountChange,
  handleVariantDiscountTypeChange,
  handleRemoveVariant,
  moveVariant,
  product,
  productId,
}: VariantCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragItem>({
    accept: "VARIANT",
    hover(item) {
      if (item.variantIndex !== variantIndex) {
        moveVariant(item.variantIndex, variantIndex, product, productId);
        item.variantIndex = variantIndex;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "VARIANT",
    item: { id: variant.id, variantIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      key={variantIndex}
      className="flex w-full gap-4 h-[40px] items-center"
      ref={ref}
    >
      <div className="flex items-center w-[75%]">
        <img
          src="drag-drop-icon.svg"
          alt="product"
          className="w-[20px] h-[16px] mr-[12px] cursor-grab "
        />
        <div className="bg-white shadow-sm rounded-[20px] p-[4px_10px]  flex w-full">
          <input
            className="w-full outline-none"
            value={variant.title}
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center w-[25%]">
        {/* Add Discount Button - Only show if discount isn't visible */}
        {!variant.showDiscount && (
          <button
            className="bg-[#008060] text-white px-5 py-0.5 rounded-md ml-2 w-full cursor-pointer"
            onClick={() => toggleShowVariantDiscount(product.id, variant.id)}
          >
            Add Discount
          </button>
        )}

        {/* Discount inputs - Only show when showDiscount is true */}
        {variant.showDiscount && (
          <div className="flex items-center justify-between gap-4 relative w-full">
            <input
              className="outline-transparent bg-white py-1 px-[10px] w-[50%]  shadow-sm rounded-[20px] p-[4px_10px] placeholder-gray-400"
              placeholder="20"
              type="number"
              min={0}
              value={variant.discountValue}
              onChange={(e) =>
                handleVariantDiscountChange(
                  product.id,
                  variant.id,
                  e.target.value
                )
              }
            />
            <select
              className="bg-white py-1 px-[10px] w-[50%] shadow-sm rounded-[20px] p-[4px_10px]"
              value={variant.discountType}
              onChange={(e) =>
                handleVariantDiscountTypeChange(
                  product.id,
                  variant.id,
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
        onClick={() => handleRemoveVariant(product.id, variant.id)}
      >
        <img src="cancel-gray-icon.svg" className="cursor-pointer" />
      </button>
    </div>
  );
};
