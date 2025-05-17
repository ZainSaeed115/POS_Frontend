import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import Webcam from 'react-webcam';
import { useProductStore } from '../store/useProductStore';
import { useOrderStore } from '../store/useOrderStore';
import { toast } from 'react-toastify';
import { X, Loader, Check } from 'lucide-react';

const BarCodeScanner = ({ onClose }) => {  // Removed onProductScanned prop
  const webcamRef = useRef(null);
  const { fetchProductsByBarCode, isScanning, setScanning } = useProductStore();
  const { addToOrder } = useOrderStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [lastScannedProduct, setLastScannedProduct] = useState(null);
  const MAX_SCAN_ATTEMPTS = 5;
  const codeReader = useRef(new BrowserMultiFormatReader());

  const scanBarcode = async () => {
    if (!webcamRef.current || !isScanning) return;

    try {
      const video = webcamRef.current.video;
      const result = await codeReader.current.decodeFromVideoElement(video);
      
      if (result) {
        console.log("Barcode detected:", result.text);
        setScanResult(result.text);
        setScanAttempts(0);
        await fetchProduct(result.text);
      } else if (scanAttempts < MAX_SCAN_ATTEMPTS) {
        setScanAttempts(prev => prev + 1);
        requestAnimationFrame(scanBarcode);
      } else {
        stopScanning();
        setError('Could not detect barcode. Please try again.');
      }
    } catch (err) {
      console.error("Scanning error:", err);
      setError(err.message);
      stopScanning();
    }
  };

  const fetchProduct = async (barcode) => {
    setIsLoading(true);
    try {
      const product = await fetchProductsByBarCode(barcode);
      if (product) {
        addToOrder(product);
        setLastScannedProduct(product);
        toast.success(
          <div className="flex items-center gap-2">
            <Check className="text-green-500" />
            {product.name} added to order
          </div>,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          }
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      toast.error(err.message || 'Product not found', {
        position: "top-center"
      });
    } finally {
      setIsLoading(false);
      // Restart scanning after a short delay
      setTimeout(() => {
        startScanning();
      }, 1000);
    }
  };

  const startScanning = () => {
    setError('');
    setScanAttempts(0);
    setScanning(true);
  };

  const stopScanning = () => {
    codeReader.current.reset();
    setScanning(false);
  };

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      scanBarcode();
    }
  }, [isScanning, scanAttempts]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Barcode Scanner</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close scanner"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
            {isScanning ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ 
                  facingMode: 'environment',
                  focusMode: 'continuous'
                }}
                audio={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l2-2m0 0l7-7 7 7M5 21v-7a2 2 0 012-2h10a2 2 0 012 2v7" />
                  </svg>
                  <p>Camera is off</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center space-y-4 mb-4">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                Start Scanning
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                Stop Scanning
              </button>
            )}
            
            {isScanning && (
              <div className="text-sm text-blue-600">
                Scanning... {scanAttempts > 0 && `(Attempt ${scanAttempts}/${MAX_SCAN_ATTEMPTS})`}
              </div>
            )}
          </div>
          
          {isLoading && (
            <div className="flex justify-center mb-4">
              <Loader size={32} className="animate-spin text-blue-500" />
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}
          
          {scanResult && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md flex justify-between items-center">
              <span>Scanned: {scanResult}</span>
              {lastScannedProduct && (
                <span className="text-green-600 font-medium">
                  ✓ {lastScannedProduct.name} added
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarCodeScanner;