import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../component/AuthImagePattern';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const VerifyResetCode = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { state } = useLocation(); // Receives email from ForgotPassword
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {verifyToken}=useAuthStore()
  const handleVerify = async () => {
    try {
      setIsSubmitting(true);
      const { token } = await form.validateFields();
      
    
      const res = await verifyToken(token)
      
      if(res?.data?.success){
        navigate('/reset-password');
      }
      
    } catch (error) {
      message.error(error.response?.data?.message || 'Invalid code. Please try again.');
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
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Verify Your Email</h1>
            <p className='text-gray-600 mt-2'>
              We sent a 6-digit code to <span className="font-medium">{state?.email || 'your email'}</span>
            </p>
          </div>

          <motion.div initial="hidden" animate="visible" variants={formVariants}>
            <Form form={form} layout="vertical" className='space-y-4'>
              <Form.Item
                name="token"
                label="Verification Code"
                rules={[
                  { required: true, message: 'Please enter the verification code' },
                  { len: 6, message: 'Code must be 6 characters' }
                ]}
              >
                <Input 
                  placeholder="123456" 
                  size="large"
                  maxLength={6}
                  className='text-center tracking-widest font-mono'
                />
              </Form.Item>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleVerify}
                className='h-12 bg-blue-600 hover:bg-blue-700 text-white'
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Loader2 className="animate-spin" /> Verifying...
                  </span>
                ) : 'Verify Code'}
              </Button>
            </Form>

            <div className='text-center mt-6'>
              <p className='text-gray-600'>
                Didn't receive code?{' '}
                <button 
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => message.info('Resend functionality would go here')}
                >
                  Resend code
                </button>
              </p>
              <div className='mt-2'>
                <button 
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Change email address
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AuthImagePattern
        title="Secure Verification"
        subtitle="Enter the code sent to your email to continue resetting your password"
      />
    </div>
  );
};

export default VerifyResetCode;