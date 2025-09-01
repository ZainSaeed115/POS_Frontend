import { Button, Form, Input, Table, Space, Popconfirm, message, Modal, Spin, Alert, Card } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSupplierStore } from "../../store/useSupplier";

const SupplierManagement = () => {
  const {
    createSupplier,
    isCreatingSupplier,
    suppliers,
    deleteSupplier,
    updateSupplier,
    isUpdatingSupplier,
    fetchSuppliers,
    isLoadingSuppliers,
  } = useSupplierStore();

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleCreateSupplier = async (values) => {
    try {
      await createSupplier(values);
      form.resetFields();
      setIsModalOpen(false);
      message.success("Supplier created successfully");
    } catch (error) {
      console.error("Error creating supplier:", error);
      message.error(error.response?.data?.message || "Failed to create supplier");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      message.success("Supplier deleted successfully");
    } catch (error) {
      message.error("Failed to delete supplier");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    editForm.setFieldsValue({
      name: record.name,
      contactPerson: record.contactPerson,
      phone: record.phone,
      email: record.email,
      address: record.address,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const values = await editForm.validateFields();
      await updateSupplier(id, values);
      setEditingId(null);
      message.success("Supplier updated successfully");
    } catch (error) {
      console.error("Error updating supplier:", error);
      message.error(error.response?.data?.message || "Failed to update supplier");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => {
        if (editingId === record._id) {
          return (
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please enter supplier name" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        }
        return <span className="font-medium">{text}</span>;
      },
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (text, record) => {
        if (editingId === record._id) {
          return (
            <Form.Item name="contactPerson" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          );
        }
        return text || "-";
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text, record) => {
        if (editingId === record._id) {
          return (
            <Form.Item name="phone" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          );
        }
        return text || "-";
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => {
        if (editingId === record._id) {
          return (
            <Form.Item
              name="email"
              rules={[{ type: "email", message: "Please enter a valid email" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        }
        return text || "-";
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text, record) => {
        if (editingId === record._id) {
          return (
            <Form.Item name="address" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          );
        }
        return text || "-";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (editingId === record._id) {
          return (
            <Space size="middle">
              <Button
                type="primary"
                onClick={() => handleUpdate(record._id)}
                size="small"
                loading={isUpdatingSupplier}
              >
                Save
              </Button>
              <Button onClick={handleCancelEdit} size="small">
                Cancel
              </Button>
            </Space>
          );
        }
        return (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Are you sure to delete this supplier?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (supplier.phone?.includes(searchTerm) ?? false) ||
    (supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen mt-4 sm:mt-6 md:mt-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Supplier Management
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
              Manage your suppliers efficiently
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="mt-3 sm:mt-0 h-9 sm:h-10 md:h-12 px-4 sm:px-6 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors duration-300 w-full sm:w-auto"
          >
            Add Supplier
          </Button>
        </div>

        {isLoadingSuppliers ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : suppliers.length === 0 && !searchTerm ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-4">
              No suppliers found
            </p>
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              className="h-9 sm:h-10 md:h-12 px-4 sm:px-6 text-sm sm:text-base bg-blue-600 hover:bg-blue-700"
            >
              Add Your First Supplier
            </Button>
          </div>
        ) : (
          <>
            <Input
              placeholder="Search by name, contact, phone, or email"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="mb-4 sm:mb-6 w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
            {/* Mobile Card View */}
            <div className="block md:hidden">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <Card
                    key={supplier._id}
                    className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {editingId === supplier._id ? (
                      <Form form={editForm} layout="vertical">
                        <Form.Item
                          label="Supplier Name"
                          name="name"
                          rules={[{ required: true, message: "Please enter supplier name" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item label="Contact Person" name="contactPerson">
                          <Input />
                        </Form.Item>
                        <Form.Item label="Phone" name="phone">
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[{ type: "email", message: "Please enter a valid email" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item label="Address" name="address">
                          <Input />
                        </Form.Item>
                        <Space className="w-full flex justify-end">
                          <Button
                            type="primary"
                            onClick={() => handleUpdate(supplier._id)}
                            loading={isUpdatingSupplier}
                          >
                            Save
                          </Button>
                          <Button onClick={handleCancelEdit}>Cancel</Button>
                        </Space>
                      </Form>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-base mb-2">{supplier.name}</h3>
                        <p className="text-gray-600 text-sm">
                          <strong>Contact:</strong> {supplier.contactPerson || "-"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <strong>Phone:</strong> {supplier.phone || "-"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <strong>Email:</strong> {supplier.email || "-"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <strong>Address:</strong> {supplier.address || "-"}
                        </p>
                        <Space className="mt-3">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(supplier)}
                          />
                          <Popconfirm
                            title="Are you sure to delete this supplier?"
                            onConfirm={() => handleDelete(supplier._id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Space>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-center text-sm sm:text-base">
                  No suppliers match your search
                </p>
              )}
            </div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table
                columns={columns}
                dataSource={filteredSuppliers}
                rowKey="_id"
                pagination={{
                  pageSize: 10,
                  responsive: true,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                }}
                loading={isLoadingSuppliers}
                bordered
                scroll={{ x: "max-content" }}
                className="bg-white rounded-lg shadow-sm"
              />
            </div>
          </>
        )}

        <Modal
          title="Add New Supplier"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          className="w-full max-w-lg"
        >
          <Form form={form} onFinish={handleCreateSupplier} layout="vertical">
            <Form.Item
              label="Supplier Name"
              name="name"
              rules={[{ required: true, message: "Please enter supplier name" }]}
            >
              <Input placeholder="Enter supplier name" />
            </Form.Item>
            <Form.Item label="Contact Person" name="contactPerson">
              <Input placeholder="Enter contact person" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Please enter a valid email" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input placeholder="Enter address" />
            </Form.Item>
            <Form.Item>
              <Space className="w-full flex justify-end">
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isCreatingSupplier}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isCreatingSupplier ? "Creating..." : "Create"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default SupplierManagement;