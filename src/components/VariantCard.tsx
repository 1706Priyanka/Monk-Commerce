import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';

export const VariantCard = ({variantIndex,variant,toggleShowVariantDiscount,handleVariantDiscountChange,handleVariantDiscountTypeChange,handleRemoveVariant,moveVariant, product,productId}) => {
    
    const ref = useRef(null);
    const [, drop] = useDrop({
      accept: 'VARIANT',
      hover(item) {
        if (item.index === variantIndex) return;
        moveVariant(item.index, variantIndex, product, productId);
        item.index = variantIndex;
      },
    });
  
    const [{ isDragging }, drag] = useDrag({
      type: 'VARIANT',
      item: { id: variant.id, variantIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    drag(drop(ref));
    
    return (
        <>
                          <div
                    key={variantIndex}
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
                    <input
                      className="search-input"
                      value={variant.title}
                      readOnly
                    />

                    <div className="flex items-center">
                      {/* Add Discount Button - Only show if discount isn't visible */}
                      {!variant.showDiscount && (
                        <button
                          className="add-discount-btn ml-2"
                          onClick={() =>
                            toggleShowVariantDiscount(product.id, variant.id)
                          }
                        >
                          Add Discount
                        </button>
                      )}

                      {/* Discount inputs - Only show when showDiscount is true */}
                      {variant.showDiscount && (
                        <div className="flex items-center">
                          <input
                            className="discount-input"
                            placeholder="20"
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
                            className="discount-type ml-2"
                            value={variant.discountType}
                            onChange={(e) =>
                              handleVariantDiscountTypeChange(
                                product.id,
                                variant.id,
                                e.target.value
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
                        onClick={() =>
                          handleRemoveVariant(product.id, variant.id)
                        }
                      >
                        X
                      </button>
                    </div>
                  </div>
        </>
     )
}