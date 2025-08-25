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

const ProductCard = ({ product, onAdd, onMakeOffer }) => {
  const [quantity, setQuantity] = useState(1);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offer, setOffer] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerResult, setOfferResult] = useState(null); // { status: 'accepted'|'rejected', price?: number, message: string }

  const inStock = (product?.stockQuantity ?? 0) > 0;
  console.log(product)

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

  try {
    setOfferLoading(true);
    setOfferResult(null);

    console.log("Making offer for product:", product._id, "Offer price:", num, "Original price:", product.salesPrice);

    // call backend via parent
    const resp = await onMakeOffer?.(product._id, num);

    console.log("Offer response:", resp);

    if (resp?.accepted) {
      const finalPrice = resp.finalPrice ?? num;
      
      setOfferResult({
        status: "accepted",
        price: finalPrice,
        message: resp?.message || "Offer accepted.",
      });

      console.log("Offer ACCEPTED - Final price:", finalPrice, "Original price:", product.salesPrice);
      
      // Update cart/order with the offered price - THIS IS CRITICAL
      onAdd({ 
        ...product, 
        _id: product._id, // Ensure product ID is included
        salesPrice: finalPrice, // This MUST be the offered price
        originalPrice: product.salesPrice, // Store original price for reference
        isOffered: true // Flag to identify offered items
      }, quantity);

      console.log("Product added to cart with offered price:", finalPrice);
      
    } else {
      setOfferResult({
        status: "rejected",
        message: resp?.message || "Offer rejected.",
      });
      console.log("Offer REJECTED:", resp?.message);
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 border border-gray-300 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all">
      {/* Info */}
      <div className="w-full sm:w-2/3">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-gray-700">
          Price:{" "}
          {offerResult?.status === "accepted" ? (
            <>
              <span className="line-through text-gray-400 mr-1">{product.salesPrice}</span>
              <span className="font-medium text-green-600">Rs {offerResult.price}</span>
            </>
          ) : (
            <span className="font-medium">Rs {product.salesPrice}</span>
          )}
        </p>

        {inStock ? (
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-gray-600">Quantity</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[...Array(product.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mt-3 text-sm font-medium text-red-600">Out of stock</p>
        )}

        {/* Bargain */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setOfferOpen((s) => !s)}
            className="text-sm underline underline-offset-4 text-gray-700 hover:text-gray-900"
          >
            {offerOpen ? "Hide offer" : "Make an offer"}
          </button>

          {offerOpen && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter your offer (Rs)"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleOfferSubmit}
                  disabled={offerLoading || !onMakeOffer}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    offerLoading || !onMakeOffer
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {offerLoading ? "Sending..." : "Send Offer"}
                </button>
              </div>

              {offerResult && (
                <div
                  className={`text-sm ${
                    offerResult.status === "accepted" ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {offerResult.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      <div className="w-full sm:w-1/3 flex justify-end gap-3">
        <button
          onClick={() => onAdd(product, quantity)}
          disabled={!inStock}
          className={`px-6 py-2 rounded-lg font-medium text-white transition ${
            inStock ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {inStock ? "Add to Cart" : "Out of stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;


