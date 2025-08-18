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
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const AdminProductCard = ({ product, onUpdate, onDelete }) => {
  const costPrice = product.costPrice || 0;
  const profit = (product.salesPrice - costPrice).toFixed(2);
  const profitPercentage =
    costPrice > 0 ? ((profit / costPrice) * 100).toFixed(1) : '0';

  return (
    <Card
      hoverable
      className="w-full rounded-lg shadow-sm hover:shadow-md transition duration-200"
      bodyStyle={{ padding: '12px' }}
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* Product Image */}
        <div className="w-full md:w-1/6">
          {product.image?.url ? (
            <div className="h-28 overflow-hidden flex items-center justify-center bg-gray-50 rounded-lg">
              <img
                alt={product.name}
                src={product.image.url}
                className="object-contain h-full w-full p-1"
              />
            </div>
          ) : (
            <div className="h-28 bg-gray-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-4/6 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base font-semibold line-clamp-1 text-gray-800">
                {product.name}
              </h3>
              <Tag color={product?.category?.color || 'gray'} className="mt-1 text-xs">
                {product?.category?.name || 'Uncategorized'}
              </Tag>
            </div>
            <Tag 
              color={product.stockQuantity > 0 ? 'green' : 'red'}
              className="text-xs font-medium"
            >
              {product.stockQuantity} in stock
            </Tag>
          </div>

          <div className="grid grid-cols-3 gap-1 mb-2">
            <Statistic
              title={<span className="text-xs">Cost</span>}
              value={costPrice.toFixed(2)}
              prefix="₹"
              valueStyle={{ fontSize: '14px' }}
              className="text-center"
            />
            <Statistic
              title={<span className="text-xs">Price</span>}
              value={product.salesPrice.toFixed(2)}
              prefix="₹"
              valueStyle={{ fontSize: '14px' }}
              className="text-center"
            />
            <Statistic
              title={<span className="text-xs">Profit</span>}
              value={profit}
              prefix="₹"
              valueStyle={{
                fontSize: '14px',
                color: profit > 0 ? '#389e0d' : '#cf1322'
              }}
              className="text-center"
            />
          </div>

          <div className="flex justify-between items-center mt-auto">
            <Tag color={profit > 0 ? 'green' : 'red'} className="text-xs">
              {profitPercentage}% Margin
            </Tag>
            <span className="text-xs text-gray-400">
              {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full md:w-1/6 flex flex-row md:flex-col justify-end gap-1">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onUpdate(product._id)}
            size="small"
            className="flex items-center justify-center text-xs"
          >
            <span className="hidden sm:inline">Update</span>
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="small"
            className="flex items-center justify-center text-xs"
          >
            <span className="hidden sm:inline">View</span>
          </Button>
          <Popconfirm
            title="Delete this product?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(product._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="flex items-center justify-center text-xs"
            >
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

export default AdminProductCard;