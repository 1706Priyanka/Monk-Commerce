
import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';



export const ProductCard = ({productIndex, product,showListProductModal, toggleShowDiscount, handleDiscountChange, handleDiscountTypeChange, handleRemoveProduct,moveProduct }) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
      accept: 'PRODUCT',
      hover(item) {
        if (item.index === productIndex) return;
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
    return(
        <>
        <div className="flex items-center justify-between" ref={ref} 
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
                  src="src/assets/edit-icon.svg"
                  onClick={() => showListProductModal(productIndex)}
                />
              </div>

              {/* Discount inputs (optional) */}
              {/* Add Discount Button - Only show if discount isn't visible */}
              {!product.showDiscount && (
                <button
                  className="add-discount-btn ml-2"
                  onClick={() => toggleShowDiscount(product.id)}
                >
                  Add Discount
                </button>
              )}

              {/* Discount inputs - Only show when showDiscount is true */}
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
                      handleDiscountTypeChange(product.id, e.target.value)
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
    )
}