import { Button, Card, Empty, Pagination, Select, Statistic, Tag, Input, Space, Row, Col, Spin } from 'antd';
import { PlusOutlined, FilterOutlined, SearchOutlined, ClearOutlined, DollarOutlined, ShoppingOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AddProductModal from '../../modals/AddProductModal';
import { useProductStore } from '../../store/useProductStore';
import { Loader } from 'lucide-react';
import AdminProductCard from '../../component/dashboard/AdminProductCard';
import DeleteProduct from '../../modals/DeleteProduct';
import UpdateProductModal from '../../modals/UpdateProductModal';

const { Search } = Input;

const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { 
    products, 
    isLoadingProducts, 
    fetchProducts, 
    fetchProductCategories, 
    category,
    deleteProduct,
    totalProducts,
    fetchInventoryStats,
    inventoryStats,
    isLoadingStats
  } = useProductStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
 
  useEffect(() => {
    fetchProducts(currentPage, pageSize, selectedCategory, searchQuery);
    fetchProductCategories();
    fetchInventoryStats();
  }, [currentPage, pageSize, selectedCategory, searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, pageSize, selectedCategory, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchProducts(page, size, selectedCategory, searchQuery);
  };

  const handleDelete = async (productId) => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      fetchProducts(currentPage, pageSize, selectedCategory, searchQuery);
      fetchInventoryStats(); // Refresh stats after deletion
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(1);
    fetchProducts(1, pageSize);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'pkr',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
      <div className="max-w-8xl mx-auto mt-5">
        {/* Header Section */}
        <Row gutter={[16, 16]} justify="space-between" align="middle" className="mb-4 md:mb-6">
          <Col xs={24} sm={12}>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your product inventory</p>
          </Col>
          <Col xs={24} sm={12} className="text-right">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalOpen(true)}
              size="large"
              className="w-full sm:w-auto"
            >
              Add Product
            </Button>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row gutter={[16, 16]} className="mb-4 md:mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <Statistic 
                title="Total Products" 
                value={inventoryStats?.totalProducts || 0} 
                prefix={<AppstoreOutlined className="text-blue-500" />}
                valueStyle={{ color: '#3f51b5' }}
                loading={isLoadingStats}
                className="text-xs md:text-base"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <Statistic 
                title="Total Stock" 
                value={inventoryStats?.totalStock || 0}
                prefix={<ShoppingOutlined className="text-orange-500" />}
                valueStyle={{ color: '#ff9800' }}
                loading={isLoadingStats}
                className="text-xs md:text-base"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <Statistic 
                title="Inventory Value" 
                value={inventoryStats?.totalInventoryValue ? formatCurrency(inventoryStats.totalInventoryValue) : '₹0'}
               
                valueStyle={{ color: '#4caf50' }}
                loading={isLoadingStats}
                className="text-xs md:text-base"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <Statistic 
                title="Avg. Value per Product" 
                value={inventoryStats?.totalProducts > 0 ? 
                  formatCurrency(inventoryStats.totalValue / inventoryStats.totalProducts) : '₹0'}
                prefix={<Tag color="purple">Avg</Tag>}
                valueStyle={{ color: '#9c27b0' }}
                loading={isLoadingStats}
                className="text-xs md:text-base"
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card className="mb-4 md:mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search by name or barcode"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                enterButton
                className="w-full"
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
            
            <Col xs={24} md={8} className="text-center md:text-left">
              <Button 
                onClick={handleClearFilters}
                icon={<ClearOutlined />}
                disabled={!searchQuery && !selectedCategory}
                className="w-full md:w-auto"
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Products List */}
        <Card 
          title={
            <div className="flex flex-col md:flex-row md:items-center">
              <span>Product Inventory</span>
              {isLoadingProducts && (
                <Spin size="small" className="ml-2" />
              )}
            </div>
          }
          className="shadow-sm mb-4 md:mb-6"
          extra={
            <span className="text-gray-500 text-sm md:text-base">
              {new Date().toLocaleDateString()}
            </span>
          }
        >
          {isLoadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-blue-600" size={40} />
            </div>
          ) : products?.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <AdminProductCard 
                  key={product._id}
                  product={product}
                  onDelete={() => {
                    setSelectedProductId(product._id);
                    setIsDeleteModalOpen(true);
                  }}
                  onUpdate={() => {
                    setSelectedProductId(product._id);
                    setIsUpdateModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <Empty
              description={
                <span className="text-gray-500 text-sm md:text-base">
                  No products found. Add your first product!
                </span>
              }
            >
              <Button 
                type="primary" 
                onClick={() => setIsModalOpen(true)}
                className="mt-4"
              >
                Add Product
              </Button>
            </Empty>
          )}
        </Card>

        {/* Pagination */}
        <div className="flex justify-center pb-4 md:pb-0">
          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={[6, 12, 24, 48]}
            responsive
            size="small"
            className="text-xs md:text-base"
          />
        </div>

        {/* Modals */}
        <AddProductModal 
          isOpen={isModalOpen} 
          setIsOpen={setIsModalOpen}
          onSuccess={() => {
            fetchProducts(currentPage, pageSize);
            fetchInventoryStats(); // Refresh stats after adding product
          }}
        />
        
        <UpdateProductModal 
          isOpen={isUpdateModalOpen} 
          setIsOpen={setIsUpdateModalOpen}
          productId={selectedProductId}
          onSuccess={() => {
            fetchProducts(currentPage, pageSize);
            fetchInventoryStats(); // Refresh stats after updating product
          }}
        />
        
        <DeleteProduct 
          isOpen={isDeleteModalOpen} 
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={() => handleDelete(selectedProductId)}
          productId={selectedProductId}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default ProductManagement;