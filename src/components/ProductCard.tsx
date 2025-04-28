import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';
import { ISelectedProduct } from '../types';


interface ProductCardProps {
  productIndex: number;
  product: ISelectedProduct;
  showListProductModal: (index: number) => void;
  toggleShowDiscount: (id: number) => void;
  handleDiscountChange: (id: number, value: string) => void;
  handleDiscountTypeChange: (id: number, value: '% Off' | 'Amount Off') => void;
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
    accept: 'PRODUCT',
    hover(item: { index: number }) {
      moveProduct(item.index, productIndex);
      item.index = productIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'PRODUCT',
    item: { id: product.id, productIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  
  return (
    <>
      <div
        className="flex items-center justify-between"
        ref={ref}
        style={{
          opacity: isDragging ? 0.95 : 1,
          border: '1px solid #ccc',
          padding: '16px',
          marginBottom: '8px',
          backgroundColor: '#fff',
          cursor: 'move',
        }}
      >
        <div className="flex items-center">
          <span className="mr-2">{productIndex + 1}.</span>
          <input
            className="search-input"
            value={product.title}
            readOnly
          />
          <img
            src="edit-icon.svg"
            onClick={() => showListProductModal(productIndex)}
          />
        </div>

        {!product.showDiscount && (
          <button
            className="add-discount-btn ml-2"
            onClick={() => toggleShowDiscount(product.id)}
          >
            Add Discount
          </button>
        )}

        {product.showDiscount && (
          <div className="flex items-center">
            <input
              className="discount-input"
              placeholder="20"
              value={product.discountValue}
              onChange={(e) =>
                handleDiscountChange(product.id, e.target.value)
              }
            />
            <select
              className="discount-type ml-2"
              value={product.discountType}
              onChange={(e) =>
                handleDiscountTypeChange(
                  product.id,
                  e.target.value as '% Off' | 'Amount Off'
                )
              }
            >
              <option>% Off</option>
              <option>Amount Off</option>
            </select>
          </div>
        )}

        <button
          className="ml-2"
          onClick={() => handleRemoveProduct(product.id)}
        >
          X
        </button>
      </div>
    </>
  );
};