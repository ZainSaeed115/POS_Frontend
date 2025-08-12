import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../component/AuthImagePattern';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
 const {   forgotPassword,isForgetting } = useAuthStore();
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      // Here you would typically call your API to send the reset password email
      console.log('Submitted:', values);
      const res= await forgotPassword(values)
    
      message.success('Password reset link sent to your email!');
      setTimeout(() => navigate('/verify-code'), 2000);
    } catch (error) {
      console.log('Validation Failed:', error);
    } finally {
      setIsSubmitting(false);
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
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Forgot Password</h1>
            <p className='text-gray-600 mt-2'>Enter your email to reset your password</p>
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

              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmit}
                className='h-12 bg-blue-600 hover:bg-blue-700 text-white'
                
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Loader2 className="animate-spin" /> Sending...
                  </span>
                ) : 'Send '}
              </Button>
            </Form>

            <div className='text-center mt-6'>
              <p className='text-gray-600'>
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <AuthImagePattern
        title='Secure Your Account'
        subtitle='We will send you verification code to reset your password'
      />
    </div>
  );
};

export default ForgotPassword;