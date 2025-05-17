import React, { useState } from 'react';

const BargainModal = ({ 
  product, 
  onConfirm, 
  onClose,
  initialPrice 
}) => {
  const [price, setPrice] = useState(initialPrice);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Negotiate Price</h3>
        <p className="mb-2">Product: {product.name}</p>
        <p className="mb-4">Original Price: ${product.salesPrice}</p>
        
        <div className="mb-4">
          <label className="block mb-2">Your Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            min={0}
            step={0.01}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(price)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BargainModal;