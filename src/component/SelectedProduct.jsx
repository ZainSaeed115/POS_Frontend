import React from 'react';
import { Tag } from 'antd';

const SelectedProduct = ({ product, onRemove }) => {
  const hasDiscount = product.isOffered && product.originalPrice > product.salesPrice;
  const discountAmount = hasDiscount ? (product.originalPrice - product.salesPrice) * product.quantity : 0;
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
      <div className="w-2/5 truncate">
        <p className="font-medium text-sm">{product.name}</p>
        {hasDiscount && (
          <Tag color="green" className="text-xs mt-1">Saved: Rs {discountAmount.toFixed(2)}</Tag>
        )}
      </div>
      
      <div className="w-1/5 text-center">
        <p className="text-sm">{product.quantity}</p>
      </div>
      
      <div className="w-1/5 text-right">
        <p className="text-sm font-semibold">Rs {(product.salesPrice * product.quantity).toFixed(2)}</p>
        {hasDiscount && (
          <p className="text-xs text-gray-500 line-through">Rs {(product.originalPrice * product.quantity).toFixed(2)}</p>
        )}
      </div>
      
      <button
        onClick={() => onRemove(product._id)}
        className="text-red-500 hover:text-red-700 font-bold text-lg"
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
};

export default SelectedProduct;