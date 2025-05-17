import { Modal, Button, Result, message } from 'antd';
import React from 'react';
import { useProductStore } from '../store/useProductStore';

const DeleteProduct = ({ isOpen, setIsOpen, productId }) => {
  const { isDeleteingProduct, deleteProduct } = useProductStore();

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(productId);
      setIsOpen(false);
      message.success('Product deleted successfully!');
    } catch (error) {
      message.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: '500px' }}
    >
      <Result
        status="warning"
        title={<span className="text-lg sm:text-xl">Are you sure you want to delete this product?</span>}
        subTitle={<span className="text-sm sm:text-base">This action cannot be undone. All data associated with this product will be permanently removed.</span>}
        extra={[
          <Button 
            key="cancel" 
            onClick={() => setIsOpen(false)}
            size="large"
            className="text-sm sm:text-base h-10 sm:h-12"
          >
            Cancel
          </Button>,
          <Button 
            key="delete" 
            danger 
            onClick={handleConfirmDelete} 
            loading={isDeleteingProduct}
            size="large"
            className="text-sm sm:text-base h-10 sm:h-12"
          >
            {isDeleteingProduct ? 'Deleting...' : 'Delete Permanently'}
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default DeleteProduct;