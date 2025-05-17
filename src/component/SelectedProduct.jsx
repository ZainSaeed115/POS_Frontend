import React from 'react';

const SelectedProduct = ({ product, onRemove }) => {
  console.log("Selected Product:",product);
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="w-2/5">
        <p className="font-medium truncate">{product.name}</p>
      </div>
      
      <div className="w-1/5 text-center">
        <p>{product.quantity}</p>
      </div>
      
      <div className="w-1/5 text-right">
        <p>${(product.salesPrice* product.quantity).toFixed(2)}</p>
      </div>
      
      <button
        onClick={() => onRemove(product._id)}
        className="text-red-500 hover:text-red-700 font-bold text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default SelectedProduct;