import { Button, Form, Input, Table, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';

const CategoryManagement = () => {
    const {
        createProductCategory,
        iscreatingCategory,
        category,
        deleteProductCategory,
        updateProductCategory,
        isUpdatingCategory,
        fetchProductCategories,
        categoryData
    } = useProductStore();
    const [form] = Form.useForm();
    const [editingId, setEditingId] = React.useState(null);
    const [editForm] = Form.useForm();


    const handleCreateCategory = async (values) => {
        try {
            await createProductCategory({ name: values.name });
            form.resetFields();
            message.success('Category created successfully');
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProductCategory(id);
            message.success('Category deleted successfully');
        } catch (error) {
            message.error('Failed to delete category');
        }
    };

    const handleEdit = (record) => {
        setEditingId(record._id);
        editForm.setFieldsValue({ name: record.name });
    };

    const handleUpdate = async (id) => {
        try {
            const values = await editForm.validateFields();
            if (!values.name) {
                message.error('Category name is required');
                return;
            }
            await updateProductCategory(id, { name: values.name });
            setEditingId(null);
            message.success('Category updated successfully');
        } catch (error) {
            console.error('Error updating category:', error);
            message.error(error.response?.data?.message || 'Failed to update category');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (editingId === record._id) {
                    return (
                        <Form form={editForm}>
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Please enter category name' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    );
                }
                return <span className="font-medium">{text}</span>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                console.log("Hi:", record)
                if (editingId === record._id) {
                    return (
                        <Space size="middle">
                            <Button
                                type="primary"
                                onClick={() => handleUpdate(record._id)}
                                size="small"
                                loading={isUpdatingCategory}
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
                            title="Are you sure to delete this category?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    return (
        <div className='p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen mt-8 sm:mt-10'>
            <div className='max-w-8xl mx-auto px-1 sm:px-2 lg:px-4'>
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage your product categories</p>
                </div>

                <Form form={form} onFinish={handleCreateCategory} layout="inline">
                    <div className="flex flex-col w-full md:flex-row md:items-center gap-4">
                        <Form.Item
                            label={<span className="text-base sm:text-lg font-medium">Category Name</span>}
                            name="name"
                            rules={[{ required: true, message: 'Please enter category name' }]}
                            className="flex-grow mb-0"
                        >
                            <Input
                                placeholder="Enter category name"
                                size="large"
                                className="text-base sm:text-lg h-10 sm:h-12 w-full"
                            />
                        </Form.Item>
                        <Form.Item className="mb-0">
                            <Button
                                disabled={iscreatingCategory}
                                type="primary"
                                htmlType="submit"
                                className="h-10 sm:h-12 px-6 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-sm transition-colors duration-300"
                            >
                                {iscreatingCategory ? "Creating..." : "Create"}
                            </Button>
                        </Form.Item>
                    </div>
                </Form>

                {/* Category Listing */}
                <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
                    <Table
                        columns={columns}
                        dataSource={category}
                        rowKey="_id"
                        pagination={false}
                        bordered
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;