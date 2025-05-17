import React, { useEffect, useRef } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, ArrowLeft, Printer, Share2, Download } from "lucide-react";
import { useBusinessStore } from '../store/useBusinessStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OrderDetails = () => {
  const { orderDetails, getOrderById, GoBack } = useOrderStore();
  const { getBusinessInformation, isBusinessDataLoading, businessData } = useBusinessStore();
  const { orderId } = useParams();
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
    }
    getBusinessInformation();
  }, [orderId, getOrderById]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const input = printRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a5');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt_${orderDetails.orderNumber}.pdf`);
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Receipt #${orderDetails.orderNumber}`,
          text: `Order receipt from ${businessData?.businessName}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (!orderDetails || !orderDetails.items || isBusinessDataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  // Calculate tax if applicable (assuming 10% tax rate for example)
  const taxRate = 0.10;
  const taxAmount = orderDetails.totalAmount * taxRate;
  const subtotal = orderDetails.totalAmount - taxAmount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and business info */}
        <div className="flex justify-between items-start mb-6">
          <button 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => GoBack(navigate)}
          >
            <ArrowLeft size={20} />
            <span>Back </span>
          </button>
          
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
            <p className="text-sm text-gray-500">#{orderDetails.orderNumber}</p>
          </div>
        </div>

        {/* Receipt Card */}
        <div 
          ref={printRef} 
          className="border border-gray-200 p-6 w-full mx-auto bg-white rounded-xl shadow-sm print:shadow-none"
        >
          {/* Business Header */}
          <div className="text-center mb-6 border-b pb-4">
            {businessData?.logo && (
              <img 
                src={businessData.logo} 
                alt="Business Logo" 
                className="h-16 mx-auto mb-3" 
              />
            )}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{businessData?.businessName}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {businessData?.location?.address}, {businessData?.location?.city}, {businessData?.location?.country}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Phone:</strong> {businessData?.businessContact}  
              {/* <strong> Email:</strong> {businessData?.businessEmail || 'N/A'} */}
            </p>
            {/* <p className="text-gray-600 text-sm">
              <strong>Tax ID:</strong> {businessData?.taxId || 'N/A'}
            </p> */}
          </div>

          {/* Order Meta */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p><strong>Order Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
              <p><strong>Order Time:</strong> {new Date(orderDetails.createdAt).toLocaleTimeString()}</p>
            </div>
            <div className="text-right">
              <p><strong>Receipt #:</strong> {orderDetails.orderNumber}</p>
              <p><strong>Customer:</strong> {orderDetails.customerName || 'Walk-in'}</p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Qty</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Item</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">Unit Price</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderDetails.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2 font-medium">
                      {item.product.name}
                      {item.note && <div className="text-xs text-gray-500 mt-1">Note: {item.note}</div>}
                    </td>
                    <td className="px-4 py-2 text-right">{item.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 max-w-xs ml-auto">
              <div className="text-right">Subtotal:</div>
              <div className="text-right font-medium">{subtotal.toFixed(2)}</div>
              
              {/* <div className="text-right">Tax ({taxRate * 100}%):</div>
              <div className="text-right font-medium">{taxAmount.toFixed(2)}</div> */}
              
              <div className="text-right text-lg font-bold">Total:</div>
              <div className="text-right text-lg font-bold">{orderDetails.totalAmount.toFixed(2)}</div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
                <p><strong>Payment Status:</strong> <span className="text-green-600 font-medium">PAID</span></p>
              </div>
              <div className="text-right">
                <p><strong>Amount Paid:</strong> {orderDetails.totalAmount.toFixed(2)}</p>
                <p><strong>Change Given:</strong> 0.00</p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">{businessData?.returnPolicy || 'Items can be returned within 7 days with receipt.'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4 print:hidden">
          <button 
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handlePrint}
          >
            <Printer size={18} />
            Print
          </button>
          <button 
            className="flex items-center gap-2 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={handleDownloadPDF}
          >
            <Download size={18} />
            Save as PDF
          </button>
          <button 
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleShare}
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;