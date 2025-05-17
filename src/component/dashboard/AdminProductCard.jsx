import React from 'react';
import { Badge, Button, Card, Popconfirm, Tag, Tooltip, Divider, Statistic, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const AdminProductCard = ({ product, onUpdate, onDelete }) => {
  const profit = (product.salesPrice - product.costPrice).toFixed(2);
  const profitPercentage = ((profit / product.costPrice) * 100).toFixed(1);

  return (
    <Badge.Ribbon 
      text={product?.category?.name || 'Uncategorized'} 
      color={product?.category?.color || 'gray'}
      className="text-xs sm:text-sm md:text-base"
    >
      <Card
        hoverable
        cover={
          <div className="h-40 sm:h-48 md:h-56 overflow-hidden flex items-center justify-center bg-gray-100">
            <img
              alt={product.name}
              src={product.image?.url || 'https://via.placeholder.com/300'}
              className="object-contain h-full w-full p-2 sm:p-3 md:p-4"
            />
          </div>
        }
        actions={[
          <Tooltip title="Update Product">
            <Button 
              type="text" 
              icon={<EditOutlined className="text-sm sm:text-base md:text-lg" />} 
              onClick={() => onUpdate(product._id)}
              className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm md:text-base"
            />
          </Tooltip>,
          <Tooltip title="Preview Product">
            <Button 
              type="text" 
              icon={<EyeOutlined className="text-sm sm:text-base md:text-lg" />}
              className="text-green-500 hover:text-green-700 text-xs sm:text-sm md:text-base"
            />
          </Tooltip>,
          <Popconfirm
            title={<span className="text-sm sm:text-base md:text-lg">Delete this product?</span>}
            description={<span className="text-xs sm:text-sm md:text-base">This action cannot be undone.</span>}
            onConfirm={() => onDelete(product._id)}
            okText={<span className="text-xs sm:text-sm md:text-base">Yes</span>}
            cancelText={<span className="text-xs sm:text-sm md:text-base">No</span>}
            overlayClassName="text-sm sm:text-base"
          >
            <Tooltip title="Delete Product">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined className="text-sm sm:text-base md:text-lg" />}
                className="text-xs sm:text-sm md:text-base"
              />
            </Tooltip>
          </Popconfirm>
        ]}
        className="h-full w-full"
        style={{ maxWidth: '100%' }}
        bodyStyle={{ padding: '12px' }}
      >
        <Card.Meta
          title={
            <div className="flex justify-between items-start gap-2">
              <span className="text-base sm:text-lg md:text-xl font-semibold truncate" style={{ maxWidth: '60%' }}>
                {product.name}
              </span>
              <Tag color={product.stockQuantity > 0 ? 'green' : 'red'} className="text-xs sm:text-sm md:text-base">
                {product.stockQuantity} in stock
              </Tag>
            </div>
          }
          description={
            <div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base line-clamp-2 mb-1 sm:mb-2">
                {product.description || 'No description available'}
              </p>
              
              <Divider className="my-1 sm:my-2 md:my-3" />
              
              <Row gutter={[8, 8]} className="mb-1 sm:mb-2 md:mb-3">
                <Col xs={24} sm={8} md={8}>
                  <Statistic 
                    title={<span className="text-xs sm:text-sm">Cost Price</span>} 
                    value={product.costPrice.toFixed(2)} 
                    prefix="₹" 
                    valueStyle={{ 
                      fontSize: '12px sm:14px md:16px', 
                      color: '#3f8600',
                      fontWeight: 500 
                    }}
                    className="text-center"
                  />
                </Col>
                <Col xs={24} sm={8} md={8}>
                  <Statistic 
                    title={<span className="text-xs sm:text-sm">Selling Price</span>} 
                    value={product.salesPrice.toFixed(2)} 
                    prefix="₹" 
                    valueStyle={{ 
                      fontSize: '12px sm:14px md:16px', 
                      color: '#096dd9',
                      fontWeight: 500 
                    }}
                    className="text-center"
                  />
                </Col>
                <Col xs={24} sm={8} md={8}>
                  <Statistic 
                    title={<span className="text-xs sm:text-sm">Profit</span>} 
                    value={profit} 
                    prefix="₹" 
                    valueStyle={{ 
                      fontSize: '12px sm:14px md:16px', 
                      color: profit > 0 ? '#389e0d' : '#cf1322',
                      fontWeight: 500 
                    }}
                    className="text-center"
                  />
                </Col>
              </Row>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                <Tag color={profit > 0 ? 'green' : 'red'} className="text-xs sm:text-sm md:text-base">
                  {profitPercentage}% Margin
                </Tag>
                <span className="text-xs sm:text-sm text-gray-400">
                  Updated: {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default AdminProductCard;