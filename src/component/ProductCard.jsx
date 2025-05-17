// import React from 'react'

// const ProductCard = ({product,onAdd}) => {
//   return (
//     <div className="flex items-center justify-between p-4 border rounded-lg shadow-md my-4">
//       {/* flex items-center justify-between p-4 border rounded-lg shadow-md my-4 */}
//     {/* Product Image */}
//     <div className="w-1/4">
//       <img
//         src={product.image.url}
//         alt={product.name}
//         className="object-cover w-full h-full rounded-md"
//       />
//     </div>

//     {/* Product Info */}
//     <div className="w-2/4 pl-4">
//       <h3 className="text-xl font-semibold">{product.name}</h3>
//       <p className="text-gray-500 text-md">Price: ${product.price}</p>
//       {/* <p className="text-gray-600">{product.description}</p> */}
//     </div>

//     {/* Add to Cart Button */}
//     <div className="w-1/4 flex justify-end">
//       <button 
//        onClick={()=>onAdd(product)}
//       className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-green-600">
//         +
//       </button>
//     </div>
//   </div>
//   )
// }

// export default ProductCard



import React, { useState } from 'react';

const ProductCard = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow transition-all">
      {/* Product Image */}
      <div className="w-full sm:w-1/4">
        <img
          src={product.image.url}
          alt={product.name}
          className="object-cover w-full h-32 rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="w-full sm:w-2/4">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="text-gray-600 mt-1">Price: Rs {product.salesPrice}</p>
        
        {product.countInStock > 0 && (
          <div className="mt-2">
            <label className="block text-sm text-gray-500 mb-1">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[...Array(product.countInStock).keys()].map(x => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="w-full sm:w-1/4 flex justify-end">
        <button
          onClick={() => onAdd(product, quantity)}
          disabled={product.stockQuantity === 0}
          className={`px-4 py-2 rounded-full text-white ${
            product.stockQuantity === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {product.stockQuantity === 0 ? 'Out of stock' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;