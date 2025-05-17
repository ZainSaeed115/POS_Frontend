import { Button, Card, Empty, Pagination, Statistic, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AddProductModal from '../../modals/AddProductModal';
import { useProductStore } from '../../store/useProductStore';
import { Loader } from 'lucide-react';
import AdminProductCard from '../../component/dashboard/AdminProductCard';
import DeleteProduct from '../../modals/DeleteProduct';
import UpdateProductModal from '../../modals/UpdateProductModal';

const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState();
  const { products, isLoadingProducts, fetchProducts } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (products) {
      setCurrentPage(products.currentPage || 1);
      setTotalPages(products.totalPages || 1);
    }
  }, [products]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateClick = (productId) => {
    setSelectedProductId(productId);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen mt-8 sm:mt-10">
      <div className="max-w-8xl mx-auto px-1 sm:px-2 lg:px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your product inventory</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleOpenModal}
            size="large"
            className="shadow-md w-full sm:w-auto text-sm sm:text-base h-10 sm:h-12"
          >
            Add New Product
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
            <Statistic 
              title={<span className="text-sm sm:text-base">Total Products</span>} 
              value={products?.totalProducts || 0} 
              valueStyle={{ color: '#3f8600', fontSize: '16px sm:18px' }}
              prefix={<Tag color="green" className="text-xs sm:text-sm">All</Tag>}
            />
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
            <Statistic 
              title={<span className="text-sm sm:text-base">Current Page</span>} 
              value={`${currentPage} of ${totalPages}`}
              valueStyle={{ fontSize: '16px sm:18px' }}
              prefix={<Tag color="blue" className="text-xs sm:text-sm">Page</Tag>}
            />
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
            <Statistic 
              title={<span className="text-sm sm:text-base">Products Per Page</span>} 
              value={pageSize}
              valueStyle={{ fontSize: '16px sm:18px' }}
              prefix={<Tag color="orange" className="text-xs sm:text-sm">Showing</Tag>}
            />
          </Card>
        </div>

        {/* Product List */}
        <Card 
          title={<span className="text-base sm:text-lg font-semibold">Product Inventory</span>}
          className="shadow-sm mb-4 sm:mb-6"
          extra={
            <span className="text-xs sm:text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          }
        >
          {isLoadingProducts ? (
            <div className="h-48 sm:h-64 flex flex-col items-center justify-center">
              <Loader className="animate-spin text-blue-600" size={40} />
              <p className="mt-3 text-sm sm:text-base text-gray-500">Loading products...</p>
            </div>
          ) : Array.isArray(products?.products) && products.products.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {products.products.map((item) => (
                <div key={item._id} className="p-1 sm:p-2">
                  <AdminProductCard 
                    product={item} 
                    onDelete={handleDeleteClick} 
                    onUpdate={handleUpdateClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-sm sm:text-base text-gray-500">
                  No products found. Add your first product!
                </span>
              }
            >
              <Button 
                type="primary" 
                onClick={handleOpenModal}
                size="large"
                className="text-sm sm:text-base h-10 sm:h-12"
              >
                Add Product
              </Button>
            </Empty>
          )}
        </Card>

        {/* Pagination */}
        <div className="flex justify-center pb-2 sm:pb-4">
          <Pagination
            current={currentPage}
            total={products?.totalProducts || 0}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="text-xs sm:text-sm"
            showQuickJumper
            disabled={isLoadingProducts}
            responsive={true}
            size="small"
          />
        </div>

        {/* Modals */}
        <AddProductModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        <UpdateProductModal 
          isOpen={isUpdateModalOpen} 
          setIsOpen={setIsUpdateModalOpen} 
          productId={selectedProductId}
        />
        <DeleteProduct 
          isOpen={isDeleteModalOpen} 
          setIsOpen={setIsDeleteModalOpen} 
          productId={selectedProductId}
        />
      </div>
    </div>
  );
};

export default ProductManagement;