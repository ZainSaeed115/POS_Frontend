import React from 'react';
import { Button, Form, Input } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../component/AuthImagePattern';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {  loginUser, isLogging } = useAuthStore();

  const handleLogin = async () => {
    alert("You are trying to login....")
    try {
      const values = await form.validateFields();
      await  loginUser(values);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className='grid lg:grid-cols-2 bg-blue-50 min-h-screen'>
      <div className='flex flex-col justify-center items-center p-8 sm:p-12 bg-white'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Welcome Back</h1>
            <p className='text-gray-600 mt-2'>Sign in to your POS account</p>
          </div>

          <motion.div initial="hidden" animate="visible" variants={formVariants}>
            <Form form={form} layout="vertical" className='space-y-4'>
              <Form.Item 
                name='email' 
                label='Email Address' 
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />} 
                  placeholder='your@email.com' 
                  size='large'
                />
              </Form.Item>

              <Form.Item 
                name='password' 
                label='Password' 
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-gray-400" />} 
                  placeholder='Enter your password' 
                  size='large'
                />
              </Form.Item>

              <div className='text-right'>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleLogin}
                className='h-12 bg-blue-600 hover:bg-blue-700 text-white'
              >
                {isLogging ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Loader2 className="animate-spin" /> Signing In...
                  </span>
                ) : 'Sign In'}
              </Button>
            </Form>

            <div className='text-center mt-6'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Create account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <AuthImagePattern
        title='Boost Your Business'
        subtitle='Manage your sales and inventory with our powerful POS system'
      />
    </div>
  );
};

export default Login;