import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, message, Row, Col, Card } from "antd";
import { useProductStore } from "../store/useProductStore";
import { useSupplierStore } from "../store/useSupplier";

const { TextArea } = Input;
const { Option } = Select;

const UpdateProductModal = ({ isOpen, setIsOpen, productId }) => {
  const [form] = Form.useForm();
  const {
    category,
    fetchProductCategories,
    specificProduct,
    isUpdatingProduct,
    updateProduct,
    fetchProduct,
  } = useProductStore();
   const {
     suppliers,
     fetchSuppliers,
     isLoadingSuppliers
   } = useSupplierStore();
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
        barcode: specificProduct.barcode,
        stockQuantity: specificProduct.stockQuantity,
      });
    }
  }, [isOpen, specificProduct, form]);

  const handlePriceChange = () => {
    const costPrice = form.getFieldValue("costPrice");
    const salesPrice = form.getFieldValue("salesPrice");
    if (costPrice && salesPrice) {
      const calculatedProfit = salesPrice - costPrice;
      setProfit(calculatedProfit);
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateProduct(productId, values);
      message.success("Product updated successfully!");
      setIsOpen(false);
    } catch (error) {
      message.error("Failed to update product");
      console.error("Error updating product:", error);
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
      style={{ maxWidth: "800px" }}
      className="max-h-[90vh] overflow-y-auto"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        className="p-2 sm:p-4"
      >
        <Card>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: "Enter product name" }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Cost Price"
                name="costPrice"
                rules={[{ required: true, message: "Enter cost price" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter cost price"
                  onChange={handlePriceChange}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Sales Price"
                name="salesPrice"
                rules={[{ required: true, message: "Enter sales price" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter sales price"
                  onChange={handlePriceChange}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Profit">
                <Input value={profit.toFixed(2)} disabled />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Stock Quantity"
                name="stockQuantity"
                rules={[{ required: true, message: "Enter stock quantity" }]}
              >
                <Input type="number" placeholder="Enter stock quantity" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Select category" }]}
              >
                <Select placeholder="Select category">
                  {category.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

               <Col xs={24} md={12}>
              <Form.Item
                label="Supplier"
                name="supplier"
                // rules={[{ required: true, message: "Select category" }]}
              >
                <Select placeholder="Select supplier">
                  {suppliers.map((sup) => (
                    <Option key={sup._id} value={sup._id}>
                      {sup.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Barcode" name="barcode">
                <Input placeholder="Enter barcode (optional)" />
              </Form.Item>
            </Col>

         
          </Row>
        </Card>

        <Form.Item className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isUpdatingProduct}>
            {isUpdatingProduct ? "Updating..." : "Update Product"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProductModal;
