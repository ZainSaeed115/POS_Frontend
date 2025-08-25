// import React from 'react';
// import {
//   Badge,
//   Button,
//   Card,
//   Popconfirm,
//   Tag,
//   Tooltip,
//   Divider,
//   Statistic,
//   Row,
//   Col,
// } from 'antd';
// import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

// const AdminProductCard = ({ product, onUpdate, onDelete }) => {
//   const costPrice = product.costPrice || 0;
//   const profit = (product.salesPrice - costPrice).toFixed(2);
//   const profitPercentage =
//     costPrice > 0 ? ((profit / costPrice) * 100).toFixed(1) : '0';

//   return (
//     <Badge.Ribbon
//       text={product?.category?.name || 'Uncategorized'}
//       color={product?.category?.color || 'gray'}
//     >
//       <Card
//         hoverable
//         cover={
//           product.image?.url ? (
//             <div className="h-44 sm:h-52 md:h-60 overflow-hidden flex items-center justify-center bg-gray-50">
//               <img
//                 alt={product.name}
//                 src={product.image.url}
//                 className="object-contain h-full w-full p-3"
//               />
//             </div>
//           ) : null
//         }

//         actions={[
//           <Tooltip title="Update Product" key="update">
//             <Button
//               type="text"
//               icon={<EditOutlined className="text-lg" />}
//               onClick={() => onUpdate(product._id)}
//               className="text-blue-500 hover:text-blue-700"
//             />
//           </Tooltip>,
//           <Tooltip title="Preview Product" key="preview">
//             <Button
//               type="text"
//               icon={<EyeOutlined className="text-lg" />}
//               className="text-green-500 hover:text-green-700"
//             />
//           </Tooltip>,
//           <Popconfirm
//             title="Delete this product?"
//             description="This action cannot be undone."
//             onConfirm={() => onDelete(product._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Tooltip title="Delete Product" key="delete">
//               <Button
//                 type="text"
//                 danger
//                 icon={<DeleteOutlined className="text-lg" />}
//               />
//             </Tooltip>
//           </Popconfirm>,
//         ]}
//         bodyStyle={{ padding: '14px' }}
//         className="h-full"
//       >
//         <Card.Meta
//           title={
//             <div className="flex justify-between items-start gap-2">
//               <span className="text-lg font-semibold truncate max-w-[60%]">
//                 {product.name}
//               </span>
//               <Tag
//                 color={product.stockQuantity > 0 ? 'green' : 'red'}
//                 className="text-xs sm:text-sm"
//               >
//                 {product.stockQuantity} in stock
//               </Tag>
//             </div>
//           }
//           description={
//             <div>
//               {/* <p className="text-gray-600 text-sm line-clamp-2 mb-2">
//                 {product?.description || 'No description available'}
//               </p> */}

//               <Divider className="my-2" />

//               <Row gutter={[8, 8]} className="mb-3">
//                 <Col xs={24} sm={8}>
//                   <Statistic
//                     title="Cost Price"
//                     value={costPrice.toFixed(2)}
//                     prefix="₹"
//                     valueStyle={{
//                       fontSize: 14,
//                       color: '#3f8600',
//                       fontWeight: 500,
//                     }}
//                     className="text-center"
//                   />
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Statistic
//                     title="Selling Price"
//                     value={product.salesPrice.toFixed(2)}
//                     prefix="₹"
//                     valueStyle={{
//                       fontSize: 14,
//                       color: '#096dd9',
//                       fontWeight: 500,
//                     }}
//                     className="text-center"
//                   />
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Statistic
//                     title="Profit"
//                     value={profit}
//                     prefix="₹"
//                     valueStyle={{
//                       fontSize: 14,
//                       color: profit > 0 ? '#389e0d' : '#cf1322',
//                       fontWeight: 500,
//                     }}
//                     className="text-center"
//                   />
//                 </Col>
//               </Row>

//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                 <Tag
//                   color={profit > 0 ? 'green' : 'red'}
//                   className="text-xs sm:text-sm"
//                 >
//                   {profitPercentage}% Margin
//                 </Tag>
//                 <span className="text-xs text-gray-400">
//                   Updated: {new Date(product.updatedAt).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           }
//         />
//       </Card>
//     </Badge.Ribbon>
//   );
// };

// export default AdminProductCard;
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
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const AdminProductCard = ({ product, onUpdate, onDelete }) => {
  const costPrice = product.costPrice || 0;
  const profit = (product.salesPrice - costPrice).toFixed(2);
  const profitPercentage =
    costPrice > 0 ? ((profit / costPrice) * 100).toFixed(1) : '0';

  // Format currency for Pakistani users
  const formatCurrency = (amount) => {
    return `Rs ${parseFloat(amount).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card
      hoverable
      className="w-full rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-gray-200"
      bodyStyle={{ padding: '16px' }}
    >
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2" style={{ minHeight: 'auto' }}>
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <Tag color={product?.category?.color || 'gray'} className="text-xs font-medium">
                {product?.category?.name || 'Uncategorized'}
              </Tag>
              <Tag 
                color={product.stockQuantity > 0 ? 'green' : 'red'}
                className="text-xs font-medium"
              >
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </Tag>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-gray-500 block mb-1">
              Last updated
            </span>
            <span className="text-xs text-gray-600 font-medium">
              {new Date(product.updatedAt).toLocaleDateString('en-PK')}
            </span>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Pricing Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600 font-medium mb-1">Cost Price</div>
            <div className="text-base font-bold text-gray-800">
              {formatCurrency(costPrice)}
            </div>
          </div>
          
          <div className="text-center p-2 bg-blue-50 rounded-md">
            <div className="text-sm text-gray-600 font-medium mb-1">Selling Price</div>
            <div className="text-base font-bold text-blue-700">
              {formatCurrency(product.salesPrice)}
            </div>
          </div>
          
          <div className="text-center p-2 rounded-md" style={{ backgroundColor: profit >= 0 ? '#f6ffed' : '#fff2f0' }}>
            <div className="text-sm text-gray-600 font-medium mb-1">Profit</div>
            <div className={`text-base font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </div>
            <div className="text-xs mt-1" style={{ color: profit >= 0 ? '#389e0d' : '#cf1322' }}>
              {profitPercentage}% Margin
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            className="flex items-center justify-center text-xs bg-blue-600"
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => onUpdate(product._id)}
            size="small"
            className="flex items-center justify-center text-xs border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Update
          </Button>
          <Popconfirm
            title="Delete this product?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(product._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="flex items-center justify-center text-xs"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

export default AdminProductCard;