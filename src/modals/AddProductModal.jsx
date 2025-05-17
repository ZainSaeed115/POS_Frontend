import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Upload, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useProductStore } from '../store/useProductStore';

const { TextArea } = Input;
const { Option } = Select;

const AddProductModal = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { category, fetchProductCategories, createNewProduct, isAddingNewProduct } = useProductStore();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProductCategories();
  }, []);

  const handleImageChange = (info) => {
    if (info.file.status === 'removed') {
      setImagePreview(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(info.file.originFileObj);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, value);
        }
      });
      
      if (values.image && values.image[0]) {
        formData.append('image', values.image[0].originFileObj);
      }

      await createNewProduct(formData);
      message.success('Product created successfully!');
      form.resetFields();
      setImagePreview(null);
      setIsOpen(false);
    } catch (error) {
      message.error('Failed to create product');
      console.error('Error creating product:', error);
    }
  };

  return (
    <Modal
      title={<span className="text-xl sm:text-2xl font-bold">Add New Product</span>}
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        setImagePreview(null);
        setIsOpen(false);
      }}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: '700px' }}
      className="max-h-[90vh] overflow-y-auto"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="p-2 sm:p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Product Image</span>}
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              rules={[{ required: true, message: 'Please upload an image' }]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleImageChange}
                accept="image/*"
                className="w-full"
              >
                {imagePreview ? null : (
                  <div className="flex flex-col items-center p-2">
                    <UploadOutlined style={{ fontSize: '20px sm:24px' }} />
                    <div className="mt-1 sm:mt-2 text-sm sm:text-base">Click to upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            
            {imagePreview && (
              <div className="mt-1 sm:mt-2 flex justify-center">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-32 sm:max-h-40 rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

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
              rules={[{ required: true, message: 'Please enter cost price' }]}
            >
              <Input 
                type="number" 
                placeholder="Enter price" 
                size="large" 
                prefix="$" 
                min={0} 
                step={0.01}
                className="text-base sm:text-lg h-10 sm:h-12"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Selling Price</span>}
              name="salesPrice"
              rules={[{ required: true, message: 'Please enter sales price' }]}
            >
              <Input 
                type="number" 
                placeholder="Enter price" 
                size="large" 
                prefix="$" 
                min={0} 
                step={0.01}
                className="text-base sm:text-lg h-10 sm:h-12"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Stock Quantity</span>}
              name="stockQuantity"
              rules={[{ required: true, message: 'Please enter stock quantity' }]}
            >
              <Input 
                type="number" 
                placeholder="Enter Stock Quantity" 
                size="large" 
                min={0} 
                step={1}
                className="text-base sm:text-lg h-10 sm:h-12"
              />
            </Form.Item>
          
            <Form.Item
              label={<span className="text-base sm:text-lg font-medium">Category</span>}
              name="category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select 
                placeholder="Select category" 
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
                placeholder="Enter product barcode (optional)" 
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
            onClick={() => {
              form.resetFields();
              setImagePreview(null);
              setIsOpen(false);
            }}
            size="large"
            className="text-base sm:text-lg h-10 sm:h-12"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isAddingNewProduct}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg h-10 sm:h-12"
          >
            {isAddingNewProduct ? 'Creating...' : 'Create Product'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;