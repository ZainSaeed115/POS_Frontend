import React, { useEffect, useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { Form, Input, Modal, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const UpdateProductModal = ({ isOpen, setIsOpen, productId }) => {
  const [form] = Form.useForm();
  const {
    category,
    isLoadingCategories,
    fetchProductCategories,
    specificProduct,
    isUpdatingProduct,
    updateProduct,
    fetchProduct,
  } = useProductStore();
  const [imagePreview, setImagePreview] = useState(null);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      fetchProductCategories();
    }
  }, [productId, isOpen]);

  useEffect(() => {
    if (isOpen && specificProduct) {
      const calculatedProfit = specificProduct.salesPrice - specificProduct.costPrice;
      setProfit(calculatedProfit);
      
      form.setFieldsValue({
        name: specificProduct.name,
        costPrice: specificProduct.costPrice,
        salesPrice: specificProduct.salesPrice,
        description: specificProduct.description,
        category: specificProduct.category?._id,
        barcode:specificProduct.barcode
      });
      setImagePreview(specificProduct.image?.url || null);
    }
  }, [isOpen, specificProduct, form]);

  const handlePriceChange = () => {
    const costPrice = form.getFieldValue('costPrice');
    const salesPrice = form.getFieldValue('salesPrice');
    
    if (costPrice && salesPrice) {
      const calculatedProfit = salesPrice - costPrice;
      setProfit(calculatedProfit);
    }
  };

  const handleImageChange = ({ fileList }) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(fileList[0].originFileObj);
    } else {
      setImagePreview(specificProduct.image?.url || null);
      form.setFieldsValue({ image: [] });
    }
  };

  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, value);
        }
      });

      if (values.image && values.image[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      await updateProduct(productId, formData);
      message.success('Product updated successfully!');
      setIsOpen(false);
    } catch (error) {
      message.error('Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  return (
    <Modal
      title={<span className="text-xl sm:text-2xl font-bold">Update Product</span>}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: '700px' }}
      className="max-h-[90vh] overflow-y-auto"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        className="p-2 sm:p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Form.Item
            label={<span className="text-base sm:text-lg font-medium">Product Image</span>}
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleImageChange}
              accept="image/*"
              showUploadList={false}
              className="w-full"
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-28 sm:max-h-32 rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <UploadOutlined style={{ fontSize: '20px sm:24px', color: 'white' }} />
                    <span className="text-white ml-1 sm:ml-2 text-xs sm:text-sm">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center p-2">
                  <UploadOutlined style={{ fontSize: '20px sm:24px' }} />
                  <div className="mt-1 sm:mt-2 text-sm sm:text-base">Click to upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div>
            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Product Name</span>}
              name="name"
              rules={[{ required: true, message: 'Please enter product name' }]}
            >
              <Input
                placeholder="Enter product name"
                size="large"
                className="text-base sm:text-lg h-10 sm:h-12"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Cost Price</span>}
              name="costPrice"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <Input
                type="number"
                placeholder="Enter price"
                size="large"
                prefix="$"
                min={0}
                step={0.01}
                className="text-base sm:text-lg h-10 sm:h-12"
                onChange={handlePriceChange}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Selling Price</span>}
              name="salesPrice"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <Input
                type="number"
                placeholder="Enter price"
                size="large"
                prefix="$"
                min={0}
                step={0.01}
                className="text-base sm:text-lg h-10 sm:h-12"
                onChange={handlePriceChange}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Profit</span>}
            >
              <Input
                value={profit.toFixed(2)}
                size="large"
                prefix="$"
                className="text-base sm:text-lg h-10 sm:h-12"
                disabled
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Category</span>}
              name="category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select
                placeholder={
                  specificProduct?.category?.name
                    ? `Current: ${specificProduct.category.name}`
                    : "Select category"
                }
                size="large"
                className="text-base sm:text-lg h-10 sm:h-12"
              >
                {category.map((cat) => (
                  <Option key={cat._id} value={cat._id} className="text-base sm:text-lg">
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
                <Form.Item
                          label="Barcode"
                          name="barcode"
                          rules={[{ required: false, message: 'Please enter a barcode' }]}
                        >
                          <Input 
                            placeholder="Enter product barcode " 
                            size="large"
                            className="text-base sm:text-lg h-10 sm:h-12"
                          />
                        </Form.Item>
          </div>
        </div>

        <Form.Item
          label={<span className="text-base sm:text-lg font-medium">Description</span>}
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea
            rows={3}
            placeholder="Enter product description"
            showCount
            maxLength={500}
            className="text-base sm:text-lg"
          />
        </Form.Item>

        <Form.Item className="flex justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button
            onClick={() => setIsOpen(false)}
            size="large"
            className="text-base sm:text-lg h-10 sm:h-12"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdatingProduct}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg h-10 sm:h-12"
          >
            {isUpdatingProduct ? 'Updating...' : 'Update Product'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProductModal;