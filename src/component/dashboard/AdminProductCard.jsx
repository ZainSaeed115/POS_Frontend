import React from 'react';
import {
  Badge,
  Button,
  Card,
  Popconfirm,
  Tag,
  Tooltip,
  Statistic,
  Row,
  Col,
  Divider,
  Descriptions
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  ShoppingOutlined,
  BarcodeOutlined
} from '@ant-design/icons';

const AdminProductCard = ({ product, onUpdate, onDelete }) => {
  const costPrice = product.costPrice || 0;
  const profit = (product.salesPrice - costPrice).toFixed(2);
  const profitPercentage = costPrice > 0 ? ((profit / costPrice) * 100).toFixed(1) : '0';

  // Format currency for Pakistani users
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get stock status tag details
  const getStockStatus = () => {
    if (product.stockQuantity === 0) {
      return { color: 'red', text: 'Out of Stock', icon: '🔴' };
    } else if (product.stockQuantity <= 5) {
      return { color: 'orange', text: 'Low Stock', icon: '🟠' };
    } else {
      return { color: 'green', text: 'In Stock', icon: '🟢' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card
      hoverable
      className="w-full rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white overflow-hidden"
      bodyStyle={{ padding: '12px sm:p-4 md:p-5' }}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Tag 
                color={product?.category?.color || 'blue'} 
                className="text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full flex items-center"
              >
                <AppstoreOutlined className="mr-1 text-xs sm:text-sm" />
                {product?.category?.name || 'Uncategorized'}
              </Tag>
              <Tag 
                color={stockStatus.color}
                className="text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full flex items-center"
              >
                {stockStatus.icon} <span className="ml-1">{stockStatus.text} ({product.stockQuantity} units)</span>
              </Tag>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs sm:text-sm text-gray-500 block mb-1">Updated</span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              {new Date(product.updatedAt).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <Divider className="my-3 border-gray-200" />

        {/* Pricing Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Cost Price</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
              {formatCurrency(costPrice)}
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Selling Price</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-blue-700">
              {formatCurrency(product.salesPrice)}
            </div>
          </div>
          <div 
            className="text-center p-3 rounded-lg hover:bg-opacity-80 transition-colors" 
            style={{ backgroundColor: profit >= 0 ? '#f6ffed' : '#fff2f0' }}
          >
            <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Profit</div>
            <div className={`text-sm sm:text-base md:text-lg font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </div>
            <div className={`text-xs sm:text-sm mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitPercentage}% Margin
            </div>
          </div>
        </div>

        {/* Barcode */}
        {product.barcode && (
          <div className="mb-3 flex items-center text-xs sm:text-sm text-gray-500">
            <BarcodeOutlined className="mr-1" />
            <span className="truncate">Barcode: {product.barcode}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-2 pt-3 mt-auto border-t border-gray-100">
          <Tooltip title="Edit product">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => onUpdate(product._id)}
              size="small"
              className="flex items-center justify-center text-xs sm:text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200 rounded-md px-4 py-1.5 font-medium transition-all duration-200 hover:scale-105"
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete product">
            <Popconfirm
              title="Delete this product?"
              description="This action cannot be undone. Are you sure?"
              onConfirm={() => onDelete(product._id)}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="flex items-center justify-center text-xs sm:text-sm bg-red-50 text-red-600 hover:bg-red-100 border-red-200 rounded-md px-4 py-1.5 font-medium transition-all duration-200 hover:scale-105"
              >
                Delete
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

// Add the missing icon component
const AppstoreOutlined = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 sm:h-4 sm:w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

export default AdminProductCard;