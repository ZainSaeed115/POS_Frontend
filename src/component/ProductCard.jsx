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



import React, { useState } from "react";
import { Tag, Tooltip, Progress } from "antd";
import { InfoCircleOutlined, DollarOutlined } from "@ant-design/icons";

const ProductCard = ({ product, onAdd, onMakeOffer }) => {
  const [quantity, setQuantity] = useState(1);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offer, setOffer] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerResult, setOfferResult] = useState(null);

  const inStock = (product?.stockQuantity ?? 0) > 0;
  const maxDiscount = product.salesPrice * 0.3; // Maximum 30% discount
  const minPrice = product.salesPrice - maxDiscount;
  
  // Fix for the array length error
  const stockQuantity = Math.max(0, product?.countInStock || 0);
  const quantityOptions = stockQuantity > 0 ? 
    [...Array(Math.min(10, stockQuantity)).keys()].map(x => x + 1) : [1];

  const calculateDiscountPercentage = (offerPrice) => {
    return Math.round(((product.salesPrice - offerPrice) / product.salesPrice) * 100);
  };

  const handleOfferSubmit = async () => {
    const num = Number(offer);

    if (!offer || Number.isNaN(num) || num <= 0) {
      setOfferResult({ status: "rejected", message: "Enter a valid positive offer." });
      return;
    }
    
    if (num >= product.salesPrice) {
      setOfferResult({
        status: "rejected",
        message: "Offer should be less than listed price.",
      });
      return;
    }
    
    if (num < minPrice) {
      setOfferResult({
        status: "rejected",
        message: `Offer is too low. Try Rs. ${minPrice.toFixed(2)} or higher.`,
      });
      return;
    }

    try {
      setOfferLoading(true);
      setOfferResult(null);

      const resp = await onMakeOffer?.(product._id, num);

      if (resp?.accepted) {
        const finalPrice = resp.finalPrice ?? num;
        const discountPercent = calculateDiscountPercentage(finalPrice);
        
        setOfferResult({
          status: "accepted",
          price: finalPrice,
          message: `Offer accepted! You saved ${discountPercent}%.`,
        });

        onAdd({ 
          ...product, 
          _id: product._id,
          salesPrice: finalPrice,
          originalPrice: product.salesPrice,
          isOffered: true
        }, quantity);
      } else {
        setOfferResult({
          status: "rejected",
          message: resp?.message || "Offer rejected. Try a slightly higher amount.",
        });
      }
    } catch (err) {
      console.error("Offer error:", err);
      setOfferResult({
        status: "rejected",
        message: "Something went wrong while sending your offer.",
      });
    } finally {
      setOfferLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
      {/* Product Info */}
      <div className="w-full sm:w-2/3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          {product.stockQuantity < 5 && inStock && (
            <Tag color="orange" className="text-xs">Low Stock</Tag>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-700">
            Price:{" "}
            {offerResult?.status === "accepted" ? (
              <>
                <span className="line-through text-gray-400 mr-1">Rs {product.salesPrice}</span>
                <span className="font-medium text-green-600">Rs {offerResult.price}</span>
              </>
            ) : (
              <span className="font-medium">Rs {product.salesPrice}</span>
            )}
          </p>
          
          <Tooltip title="You can bargain for up to 30% off">
            <InfoCircleOutlined className="text-blue-400 cursor-help" />
          </Tooltip>
        </div>

        {/* Discount Range Visualizer */}
        {!offerResult?.status === "accepted" && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Min: Rs {minPrice.toFixed(2)}</span>
              <span>Max: Rs {product.salesPrice}</span>
            </div>
            <Progress 
              percent={offer ? Math.min(100, ((product.salesPrice - Number(offer)) / maxDiscount) * 100) : 0} 
              showInfo={false}
              strokeColor="#52c41a"
              size="small"
            />
          </div>
        )}

        {inStock ? (
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <label className="text-sm text-gray-600">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            >
              {quantityOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => onAdd(product, quantity)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm font-medium text-red-600">Out of stock</p>
        )}

        {/* Bargain Section */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOfferOpen((s) => !s)}
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            <DollarOutlined />
            {offerOpen ? "Hide offer" : "Make an offer"}
          </button>

          {offerOpen && (
            <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="number"
                  min={minPrice}
                  max={product.salesPrice - 0.01}
                  step="1"
                  placeholder={`Enter offer (Rs ${minPrice.toFixed(2)} - ${product.salesPrice})`}
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={handleOfferSubmit}
                  disabled={offerLoading || !onMakeOffer}
                  className={`px-3 py-2 rounded-md text-white transition text-sm ${
                    offerLoading || !onMakeOffer
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600"
                  }`}
                >
                  {offerLoading ? "Sending..." : "Offer"}
                </button>
              </div>

              {offer && !offerLoading && (
                <p className="text-xs text-gray-500">
                  Your offer is {calculateDiscountPercentage(Number(offer))}% off
                </p>
              )}

              {offerResult && (
                <div className={`text-sm p-2 rounded-md ${
                  offerResult.status === "accepted" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-600"
                }`}>
                  {offerResult.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Image */}
      {product.image?.url && (
        <div className="w-full sm:w-1/4 flex justify-center">
          <img
            src={product.image.url}
            alt={product.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
