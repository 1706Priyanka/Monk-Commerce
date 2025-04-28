import InfiniteScroll from "react-infinite-scroll-component";
import { IProduct, IVariant } from "../types";



interface AddProductModalProps {
  showModal: boolean;
  closeProductModal: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  productData: IProduct[];
  fetchMoreData: () => void;
  hasMore: boolean;
  isProductSelected: (productId: number) => boolean;
  handleOnSelection: (productId: number, variantId: number | null) => void;
  isVariantSelected: (productId: number, variantId: number) => boolean;
  isEmptySearch: boolean;
  tempSelectedProduct: IProduct[];
  handleAddProducts: () => void;
}

export const AddProductModal = ({
  showModal,
  closeProductModal,
  searchTerm,
  setSearchTerm,
  productData,
  fetchMoreData,
  hasMore,
  isProductSelected,
  handleOnSelection,
  isVariantSelected,
  isEmptySearch,
  tempSelectedProduct,
  handleAddProducts,
}: AddProductModalProps) => {
  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="h-[663px] w-[612px] modal-container">
            <div className="modal-header">
              <div>Select Products </div>
              <div onClick={closeProductModal}>
                <img src="src/assets/cancel-icon.svg" />
              </div>
            </div>
            <div className="input-container">
              <div className="search flex">
                <img src="src/assets/search-icon.svg" className="mx-[14px]" />
                <input
                  className="search-input"
                  placeholder="Select Product"
                  value={searchTerm}
                  type="text"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
            </div>

            <div
              className="overflow-auto product-list-container"
              id="scrollableDiv"
            >
              <InfiniteScroll
                dataLength={productData?.length}
                next={fetchMoreData}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
                loader={
                  <div className="flex w-full h-full justify-center items-center py-3">
                    Loading...
                  </div>
                }
                endMessage={
                  <div className="flex justify-center items-center py-3">
                    No more products...
                  </div>
                }
              >
                {productData?.length > 0 ? (
                  productData?.map((item: IProduct, index: number) => (
                    <div key={index}>
                      <div className="parent-item flex">
                        <input
                          checked={isProductSelected(item?.id)}
                          onChange={() => {
                            handleOnSelection(item.id, null);
                          }}
                          className="checkbox"
                          type="checkbox"
                        />

                        {item?.image?.src && (
                          <img
                            className="image-size"
                            src={item.image.src}
                            alt={item.title}
                          />
                        )}
                        {item?.title}
                      </div>

                      {item?.variants?.map(
                        (variant: IVariant, index: number) => (
                          <div
                            className="child-items flex justify-between w-full"
                            key={index}
                          >
                            <div className="flex items-center w-[55%]">
                              <input
                                checked={isVariantSelected(item.id, variant.id)}
                                onChange={() => {
                                  handleOnSelection(item.id, variant.id);
                                }}
                                className="checkbox"
                                type="checkbox"
                                disabled={variant?.inventory_quantity <= 0}
                              />
                              <p
                                className={
                                  variant?.inventory_quantity <= 0
                                    ? "text-gray-400"
                                    : ""
                                }
                              >
                                {variant?.title}
                              </p>
                            </div>

                            <div className="flex justify-between gap-4 w-[45%]">
                              {typeof variant?.inventory_quantity ===
                                "number" && (
                                <p
                                  className={
                                    variant.inventory_quantity > 0
                                      ? ""
                                      : "text-white bg-[#EF4444] rounded px-2"
                                  }
                                >
                                  {variant.inventory_quantity > 0
                                    ? `${variant.inventory_quantity} available`
                                    : "Out of stock"}
                                </p>
                              )}

                              <p className="ml-auto text-right">
                                ${variant?.price}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ))
                ) : !isEmptySearch ? (
                  <div className="flex justify-center items-center py-3">
                    Loading products...
                  </div>
                ) : null}
              </InfiniteScroll>
            </div>

            <div className="footer">
              <div>{tempSelectedProduct.length} Product selected</div>
              <div className="btn-container">
                <button onClick={closeProductModal}>Cancel</button>
                <button className="add-btn" onClick={handleAddProducts}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
