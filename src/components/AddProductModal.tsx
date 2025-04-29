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
  tempSelectedProduct,
  handleAddProducts,
}: AddProductModalProps) => {
  const hasNegativeInventoryVariant = (product: IProduct) => {
    return product.variants?.some(variant => variant.inventory_quantity < 0);
  };
  return (
    <>
      {showModal && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex justify-center items-center z-[999]">
          <div className="w-[612px] h-[663px] bg-white z-[1000] rounded-[4px]">
            <div className="flex justify-between pt-3.5 pr-3.5 pb-1.5 pl-3.5">
              <div>Select Products </div>
              <div onClick={closeProductModal}>
                <img src="cancel-icon.svg" className="cursor-pointer" />
              </div>
            </div>
            <div className="border-t border-b border-black/10">
              <div className="border border-black/10 w-full md:w-[92%] mx-2 md:mx-5 my-1 md:my-2.5 p-0.5 md:p-1 flex">
                <img src="search-icon.svg" className="mx-[14px]" />
                <input
                  className="w-full outline-none placeholder-gray-400"
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
              className="overflow-auto my-2 md:h-[492px]"
              id="scrollableDiv"
            >
              <InfiniteScroll
                dataLength={productData?.length}
                next={fetchMoreData}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
                loader={
                  <div className="flex w-full h-full justify-center items-center py-3">
                    Loading Products...
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
                      <div className="border-b border-black/10 pb-3 pl-6 pr-3 pt-3 flex">
                      <input
                        checked={isProductSelected(item?.id)}
                        onChange={() => {
                          if (!hasNegativeInventoryVariant(item)) {
                            handleOnSelection(item.id, null);
                          }
                        }}
                        className={`h-5 w-5 mr-3.5 [accent-color:#008060] ${
                          hasNegativeInventoryVariant(item) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        type="checkbox"
                        disabled={hasNegativeInventoryVariant(item)}
                      />

                      {item?.image?.src && (
                        <img
                          className="h-[26px] w-[28px] rounded mr-3.5"
                          src={item.image.src}
                          alt={item.title}
                        />
                      )}
                         <span className={hasNegativeInventoryVariant(item) ? "text-gray-400" : ""}>
                          {item?.title}
                        </span>
                      </div>

                      {item?.variants?.map(
                        (variant: IVariant, index: number) => (
                          <div
                            className="border-b border-black/10 pt-3 pr-3 pb-3 pl-[62px] flex justify-between w-full"
                            key={index}
                          >
                            <div className="flex items-center w-[55%]">
                              <input
                                checked={isVariantSelected(item.id, variant.id)}
                                onChange={() => {
                                  handleOnSelection(item.id, variant.id);
                                }}
                                className="h-5 w-5 mr-3.5 [accent-color:#008060]"
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
                )  : null}
              </InfiniteScroll>
            </div>

            <div className="flex justify-between m-5">
              <div>{tempSelectedProduct.length} Product selected</div>
              <div className="flex justify-evenly w-full sm:w-1/2 md:w-[32%]">
                <button className="
                w-1/2 border border-gray-400 text-gray-500 rounded-md mr-2 cursor-pointer" onClick={closeProductModal}>Cancel</button>
                <button className="bg-[#008060] text-white w-1/2 rounded-md cursor-pointer "  onClick={handleAddProducts}>
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
