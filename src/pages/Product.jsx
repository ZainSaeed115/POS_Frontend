import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../component/ProductCard";
import { useOrderStore } from "../store/useOrderStore";
import SelectedProduct from "../component/SelectedProduct";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../modals/AddProductModal";
import { Loader, X, Barcode } from "lucide-react";
import BarCodeScanner from "../component/BarCodeScanner";
import { toast } from "react-toastify";

const Product = () => {
  const { 
    isLoadingProducts, 
    fetchProducts, 
    products, 
    currentPage: storeCurrentPage,
    totalPages: storeTotalPages,
    searchProducts 
  } = useProductStore();
  
  const { items, addToOrder, removeFromOrder, createOrder, isPlacingOrder } = useOrderStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    fetchProducts(currentPage, pageSize, selectedCategory, searchQuery);
  }, [currentPage, pageSize, selectedCategory, searchQuery, fetchProducts]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() === "") {
        fetchProducts(currentPage, pageSize, selectedCategory);
      } else {
        searchProducts(searchQuery);
      }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery, fetchProducts, searchProducts, currentPage, pageSize, selectedCategory]);

  useEffect(() => {
    if (storeCurrentPage && storeTotalPages) {
      setCurrentPage(storeCurrentPage);
      setTotalPages(storeTotalPages);
    }
  }, [storeCurrentPage, storeTotalPages]);

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchProducts(currentPage, pageSize, selectedCategory);
  };

  const totalSum = items.reduce((sum, product) => sum + product.salesPrice * product.quantity, 0);

  const handleOrderPlacement = async () => {
    await createOrder(items, totalSum, navigate);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 pt-16 sm:pt-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">POS System</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <Barcode size={16} className="sm:size-5" />
            <span className="hidden xs:inline">Scan</span>
          </button>
          <button 
            onClick={() => setIsOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow text-sm sm:text-base"
          >
            Add Product
          </button>
        </div>
      </div>

      {showScanner && (
        <BarCodeScanner 
          onClose={() => setShowScanner(false)} 
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Products Section */}
        <div className="lg:w-2/3">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h2>
              <div className="flex gap-2 w-full sm:w-1/2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-2 border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg w-full focus:outline-none focus:border-blue-500 pr-8 sm:pr-10 text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} className="sm:size-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-[300px] sm:h-[400px] md:h-[500px] overflow-y-auto pr-2">
              {isLoadingProducts ? (
                <div className="flex justify-center items-center h-full">
                  <Loader size={32} className="animate-spin text-blue-500" />
                </div>
              ) : Array.isArray(products) && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
                  {products.map((item) => (
                    <ProductCard 
                      key={item._id} 
                      product={item} 
                      onAdd={addToOrder} 
                      compact={window.innerWidth < 640}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">No products found</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 sm:mt-6">
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg disabled:opacity-50 text-sm sm:text-base"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm sm:text-base text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg disabled:opacity-50 text-sm sm:text-base"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Section */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Your Order</h2>
            <div className="h-[250px] sm:h-[350px] overflow-y-auto mb-3 sm:mb-4 pr-2">
              {items.length > 0 ? (
                items.map((product) => (
                  <SelectedProduct 
                    key={product._id} 
                    product={product} 
                    onRemove={removeFromOrder} 
                    compact={window.innerWidth < 640}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">Your cart is empty</p>
              )}
            </div>

            <div className="mt-3 sm:mt-4 border-t-2 pt-3 sm:pt-4">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-base sm:text-lg font-semibold">Total:</span>
                <span className="text-lg sm:text-xl font-bold">${totalSum.toFixed(2)}</span>
              </div>
              <button
                onClick={handleOrderPlacement}
                disabled={isPlacingOrder || items.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg shadow disabled:opacity-50 text-sm sm:text-base"
              >
                {isPlacingOrder ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddProductModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Product;