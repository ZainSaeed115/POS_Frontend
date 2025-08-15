import React from 'react';
import {
  Badge,
  Button,
  Card,
  Popconfirm,
  Tag,
  Tooltip,
  Divider,
  Statistic,
  Row,
  Col,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const AdminProductCard = ({ product, onUpdate, onDelete }) => {
  const costPrice = product.costPrice || 0;
  const profit = (product.salesPrice - costPrice).toFixed(2);
  const profitPercentage =
    costPrice > 0 ? ((profit / costPrice) * 100).toFixed(1) : '0';

  return (
    <Badge.Ribbon
      text={product?.category?.name || 'Uncategorized'}
      color={product?.category?.color || 'gray'}
    >
      <Card
        hoverable
        cover={
          product.image?.url ? (
            <div className="h-44 sm:h-52 md:h-60 overflow-hidden flex items-center justify-center bg-gray-50">
              <img
                alt={product.name}
                src={product.image.url}
                className="object-contain h-full w-full p-3"
              />
            </div>
          ) : null
        }

        actions={[
          <Tooltip title="Update Product" key="update">
            <Button
              type="text"
              icon={<EditOutlined className="text-lg" />}
              onClick={() => onUpdate(product._id)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>,
          <Tooltip title="Preview Product" key="preview">
            <Button
              type="text"
              icon={<EyeOutlined className="text-lg" />}
              className="text-green-500 hover:text-green-700"
            />
          </Tooltip>,
          <Popconfirm
            title="Delete this product?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(product._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Product" key="delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined className="text-lg" />}
              />
            </Tooltip>
          </Popconfirm>,
        ]}
        bodyStyle={{ padding: '14px' }}
        className="h-full"
      >
        <Card.Meta
          title={
            <div className="flex justify-between items-start gap-2">
              <span className="text-lg font-semibold truncate max-w-[60%]">
                {product.name}
              </span>
              <Tag
                color={product.stockQuantity > 0 ? 'green' : 'red'}
                className="text-xs sm:text-sm"
              >
                {product.stockQuantity} in stock
              </Tag>
            </div>
          }
          description={
            <div>
              {/* <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {product?.description || 'No description available'}
              </p> */}

              <Divider className="my-2" />

              <Row gutter={[8, 8]} className="mb-3">
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Cost Price"
                    value={costPrice.toFixed(2)}
                    prefix="₹"
                    valueStyle={{
                      fontSize: 14,
                      color: '#3f8600',
                      fontWeight: 500,
                    }}
                    className="text-center"
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Selling Price"
                    value={product.salesPrice.toFixed(2)}
                    prefix="₹"
                    valueStyle={{
                      fontSize: 14,
                      color: '#096dd9',
                      fontWeight: 500,
                    }}
                    className="text-center"
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Profit"
                    value={profit}
                    prefix="₹"
                    valueStyle={{
                      fontSize: 14,
                      color: profit > 0 ? '#389e0d' : '#cf1322',
                      fontWeight: 500,
                    }}
                    className="text-center"
                  />
                </Col>
              </Row>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <Tag
                  color={profit > 0 ? 'green' : 'red'}
                  className="text-xs sm:text-sm"
                >
                  {profitPercentage}% Margin
                </Tag>
                <span className="text-xs text-gray-400">
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
