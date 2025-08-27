import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, message, Row, Col, Card } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useProductStore } from "../store/useProductStore";

const { TextArea } = Input;
const { Option } = Select;

const AddProductModal = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { category, fetchProductCategories, createNewProduct, isAddingNewProduct } = useProductStore();
  const [productCount, setProductCount] = useState(1);

  useEffect(() => {
    fetchProductCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        limit: values.limit,
        products: values.products,
      };

      await createNewProduct(payload);
      message.success("Products created successfully!");
      form.resetFields();
      setProductCount(1);
      setIsOpen(false);
    } catch (error) {
      message.error(error.message || "Failed to create products");
    }
  };

  return (
    <Modal
      title={<span className="text-xl sm:text-2xl font-bold">Add Multiple Products</span>}
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        setProductCount(1);
        setIsOpen(false);
      }}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: "900px" }}
      className="max-h-[90vh] overflow-y-auto"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="p-2 sm:p-4"
        initialValues={{ limit: 5, products: [{}] }}
      >
        {/* Number of Products */}
        <Form.Item
          label="How many products you want to add?"
          name="limit"
          rules={[{ required: true, message: "Please enter number of products" }]}
        >
          <Input
            type="number"
            min={1}
            max={20}
            placeholder="Enter number of products"
            onChange={(e) => {
              const newLimit = parseInt(e.target.value || 1);
              if (newLimit < productCount) {
                message.warning(
                  `You already added ${productCount} products. Remove some first.`
                );
              }
            }}
          />
        </Form.Item>

        {/* Product Fields */}
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card
                  key={key}
                  title={`Product ${index + 1}`}
                  extra={
                    fields.length > 1 ? (
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                          setProductCount((prev) => prev - 1);
                        }}
                        style={{ color: "red" }}
                      />
                    ) : null
                  }
                  className="mb-4"
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        label="Product Name"
                        name={[name, "name"]}
                        rules={[{ required: true, message: "Enter product name" }]}
                      >
                        <Input placeholder="Enter product name" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        label="Cost Price"
                        name={[name, "costPrice"]}
                        rules={[{ required: true, message: "Enter cost price" }]}
                      >
                        <Input type="number" placeholder="Enter cost price" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        label="Sales Price"
                        name={[name, "salesPrice"]}
                        rules={[{ required: true, message: "Enter sales price" }]}
                      >
                        <Input type="number" placeholder="Enter sales price" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        label="Stock Quantity"
                        name={[name, "stockQuantity"]}
                        rules={[{ required: true, message: "Enter stock quantity" }]}
                      >
                        <Input type="number" placeholder="Enter stock quantity" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        label="Category"
                        name={[name, "category"]}
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
                        {...restField}
                        label="Barcode"
                        name={[name, "barcode"]}
                      >
                        <Input placeholder="Enter barcode (optional)" />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        {...restField}
                        label="Description"
                        name={[name, "description"]}
                      >
                        <TextArea rows={2} placeholder="Enter description (optional)" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() => {
                  const limit = form.getFieldValue("limit");
                  if (productCount < limit) {
                    add();
                    setProductCount((prev) => prev + 1);
                  } else {
                    message.warning(`You can only add up to ${limit} products`);
                  }
                }}
                icon={<PlusOutlined />}
              >
                Add Another Product
              </Button>
            </>
          )}
        </Form.List>

        {/* Submit / Cancel */}
        <Form.Item className="flex justify-end gap-3 mt-6">
          <Button
            onClick={() => {
              form.resetFields();
              setProductCount(1);
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isAddingNewProduct}>
            {isAddingNewProduct ? "Creating..." : "Create Products"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
