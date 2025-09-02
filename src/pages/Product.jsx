import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../component/ProductCard";
import { useOrderStore } from "../store/useOrderStore";
import SelectedProduct from "../component/SelectedProduct";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../modals/AddProductModal";
import { Loader, X, Barcode, DollarSign } from "lucide-react";
import BarCodeScanner from "../component/BarCodeScanner";
import { toast } from "react-toastify";
import { Card, Col, Row, Input, Select, Button, Modal, Progress, Tag } from "antd";
import { ClearOutlined, FilterOutlined, SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useSupplierStore } from "../store/useSupplier";

const { Search } = Input;
const Product = () => {
  const { 
    isLoadingProducts, 
    fetchProducts, 
    products, 
    currentPage: storeCurrentPage,
    totalPages: storeTotalPages,
    searchProducts,
    category, 
    makeOffer
  } = useProductStore();
  
  const { items, addToOrder, removeFromOrder, createOrder, isPlacingOrder } = useOrderStore();
   const {
      suppliers,
      fetchSuppliers,
      isLoadingSuppliers
    } = useSupplierStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [bargainHelpVisible, setBargainHelpVisible] = useState(false);

  useEffect(() => {
    fetchProducts(currentPage, pageSize, selectedCategory, searchQuery,selectedSupplier);
  }, [currentPage, pageSize, selectedCategory, searchQuery, fetchProducts,selectedSupplier]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, pageSize, selectedCategory, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

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
    const orderItems = items.map(item => ({
      product: item._id,
      quantity: item.quantity,
      unitPrice: item.salesPrice,
      originalPrice: item.originalPrice || item.salesPrice,
      isOffered: item.isOffered || false
    }));
    
    await createOrder(orderItems, totalSum, navigate);
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

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(1);
    fetchProducts(1, pageSize);
  };

  const handleMakeOffer = async (product, offerPrice) => {
    try {
      const response = await makeOffer(product, offerPrice);
      return {
        accepted: response.data.accepted,
        finalPrice: response.data.finalPrice,
        message: response.data.message,
      };
    } catch (err) {
      console.error("Offer error:", err);
      return { accepted: false, message: "Failed to make offer" };
    }
  };

  const showBargainHelp = () => {
    setBargainHelpVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 pt-16 sm:pt-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">POS System</h1>
          <Button 
            type="text" 
            icon={<QuestionCircleOutlined />} 
            onClick={showBargainHelp}
            className="text-blue-400 hover:text-blue-600"
            title="How to bargain?"
          />
        </div>
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Products</h2>
            
            <Card className="mb-6 shadow-sm">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8}>
                  <Search
                    placeholder="Search by name or barcode"
                    prefix={<SearchOutlined/>}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                    enterButton
                  />
                </Col>
                
                <Col xs={24} sm={12} md={8}>
                  <Select
                    placeholder="Filter by category"
                    className="w-full"
                    value={selectedCategory || undefined}
                    onChange={(value) => setSelectedCategory(value)}
                    allowClear
                    suffixIcon={<FilterOutlined />}
                  >
                    {category?.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                
                   <Col xs={24} sm={12} md={8}>
                  <Select
                    placeholder="Filter by supplier"
                    className="w-full"
                    value={selectedCategory || undefined}
                    onChange={(value) => setSelectedSupplier(value)}
                    allowClear
                    suffixIcon={<FilterOutlined />}
                  >
                    {suppliers?.map((sup) => (
                      <Select.Option key={sup._id} value={sup._id}>
                        {sup.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <Button 
                    onClick={handleClearFilters}
                    icon={<ClearOutlined />}
                    disabled={!searchQuery && !selectedCategory}
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card>

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
                      onMakeOffer={handleMakeOffer} 
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Selected Products</h2>
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
                <span className="text-lg sm:text-xl font-bold">Rs {totalSum.toFixed(2)}</span>
              </div>
              
              {/* Savings indicator if any items have discounts */}
              {items.some(item => item.isOffered) && (
                <div className="mb-3 p-2 bg-green-50 rounded-md">
                  <div className="flex justify-between text-sm text-green-700">
                    <span>You saved:</span>
                    <span className="font-semibold">
                      Rs {items.reduce((sum, item) => {
                        if (item.isOffered && item.originalPrice) {
                          return sum + ((item.originalPrice - item.salesPrice) * item.quantity);
                        }
                        return sum;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
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
      
      {/* Bargain Help Modal */}
      <Modal
        title="How to Bargain?"
        open={bargainHelpVisible}
        onCancel={() => setBargainHelpVisible(false)}
        footer={[
          <Button key="close" onClick={() => setBargainHelpVisible(false)}>
            Got it!
          </Button>
        ]}
      >
        <div className="space-y-4 my-4">
          <div className="flex items-start gap-3">
            <DollarSign className="text-blue-500 mt-1" size={18} />
            <div>
              <h4 className="font-semibold">Make an Offer</h4>
              <p className="text-gray-600 text-sm">Click "Make an offer" on any product to suggest a lower price.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Tag color="green" className="mt-1">✓</Tag>
            <div>
              <h4 className="font-semibold">Reasonable Offers</h4>
              <p className="text-gray-600 text-sm">Offers are more likely to be accepted if they're reasonable (10-30% below retail price).</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Tag color="blue" className="mt-1">i</Tag>
            <div>
              <h4 className="font-semibold">Automatic Acceptance</h4>
              <p className="text-gray-600 text-sm">Some offers may be automatically accepted based on store policies.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Tag color="orange" className="mt-1">!</Tag>
            <div>
              <h4 className="font-semibold">Counter Offers</h4>
              <p className="text-gray-600 text-sm">If your offer is too low, the system might suggest a counter offer.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Product;