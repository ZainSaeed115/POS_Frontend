import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Steps } from "antd";
import { MailOutlined, UserOutlined, LockOutlined, PhoneOutlined, ShopOutlined, SafetyOutlined } from '@ant-design/icons';
import AuthImagePattern from '../component/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore.js';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {
    authUser,
    registerBusinessOwner,
    verifyEmailWithVerificationToken,
    registerBusiness,
    isRegistering,
    isVerifying,
    isCreatingBusiness,
    registrationStep,
    validateRegistrationProgress
  } = useAuthStore();

  // Initialize step based on registration progress from store
  const [step, setStep] = useState(registrationStep + 1);

  // Sync with registration progress on load and when authUser changes
  useEffect(() => {
    validateRegistrationProgress();
    setStep(registrationStep + 1); // Convert store step (0-based) to UI step (1-based)
  }, [authUser, registrationStep, validateRegistrationProgress]);
  console.log("UserAuth:",authUser)
  const cities = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Hyderabad'
  ];

  const businessTypes = [
    'Retail Shop', 'Restaurant', 'Medical Store', 'Electronics',
    'Clothing', 'Supermarket', 'Hardware', 'Jewelry', 'Other'
  ];

  const registerOwner = async () => {
    try {
      const values = await form.validateFields();
      await registerBusinessOwner(values);
    } catch (error) {
      toast.error("Please fill all required fields correctly");
    }
  };

  const verifyEmail = async () => {
    try {
      const values = await form.validateFields();
      await verifyEmailWithVerificationToken(values);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Invalid verification code. Please try again");
    }
  };

  const registerBusinessDetails = async () => {
    try {
      const values = await form.validateFields();
      const isRegistered = await registerBusiness(values);
      console.log("IsRegistered:",isRegistered)
      if (isRegistered) navigate('/');
    } catch (error) {
      toast.error("Registration failed. Please try again");
    }
  };

  return (
    <div className='grid lg:grid-cols-2 bg-gray-50 min-h-screen'>
      <div className='flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 bg-white'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
              {step === 1 ? 'Create Your Account' :
               step === 2 ? 'Verify Your Email' :
               'Complete Business Details'}
            </h1>
            <p className='text-gray-600 mt-2'>
              {step === 1 ? 'Start by creating your owner account' :
               step === 2 ? 'Enter the verification code sent to your email' :
               'Add your business information to get started'}
            </p>
          </div>

          <Steps current={step-1} className="mb-8">
            <Steps.Step title="Personal Info" />
            <Steps.Step title="Email Verify" />
            <Steps.Step title="Business Info" />
          </Steps>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Form form={form} layout="vertical">
              <Form.Item 
                name='name' 
                label="Full Name" 
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Your full name" size="large" />
              </Form.Item>
              
              <Form.Item 
                name='phone' 
                label="Phone Number" 
                rules={[
                  { required: true, message: "Phone number is required" },
                  { pattern: /^03[0-9]{9}$/, message: "Enter valid phone (03XXXXXXXXX)" }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="03XXXXXXXXX" size="large" />
              </Form.Item>

              <Form.Item 
                name='email' 
                label="Email" 
                rules={[
                  { required: true, message: "Email is required" },
                  { type: 'email', message: "Enter valid email" }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="your@email.com" size="large" />
              </Form.Item>
              
              <Form.Item 
                name='password' 
                label="Password" 
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Create strong password" size="large" />
              </Form.Item>

              <Button
                type="primary"
                size="large"
                block
                onClick={registerOwner}
                className='h-12 bg-blue-600 hover:bg-blue-700'
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Loader2 className="animate-spin" /> Processing...
                  </span>
                ) : 'Next Step'}
              </Button>
            </Form>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-4">
                  We sent a verification code to {authUser?.email || 'your email'}. Please enter it below.
                </p>
              </div>
              <Form form={form}>
                <Form.Item 
                  name='verificationToken' 
                  rules={[
                    { required: true, message: "Verification code is required" },
                    { pattern: /^[0-9]{6}$/, message: "Enter 6-digit code" }
                  ]}
                >
                  <Input prefix={<SafetyOutlined />} placeholder="6-digit code" size="large" />
                </Form.Item>
                <Button 
                  type="primary"
                  size="large"
                  block
                  onClick={verifyEmail}
                  className='h-12 bg-blue-600 hover:bg-blue-700'
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <span className='flex items-center justify-center gap-2'>
                      <Loader2 className="animate-spin" /> Verifying...
                    </span>
                  ) : 'Verify Email'}
                </Button>
              </Form>
              <div className="text-center mt-4">
                <button 
                  className="text-blue-600 hover:underline"
                  onClick={() => toast.info("We will send you a new code shortly")}
                >
                  Didn't receive code?
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Business Information */}
          {step === 3 && (
            <Form form={form} layout="vertical">
              <Form.Item 
                name='businessName' 
                label="Business Name" 
                rules={[{ required: true, message: "Business name is required" }]}
              >
                <Input prefix={<ShopOutlined />} placeholder="Your business name" size="large" />
              </Form.Item>
              
              <Form.Item 
                name='businessType' 
                label="Business Type" 
                rules={[{ required: true, message: "Please select business type" }]}
              >
                <Select placeholder="Select business type" size="large">
                  {businessTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item 
                name='businessContact' 
                label="Business Phone" 
                rules={[
                  { required: true, message: "Phone number is required" },
                  { pattern: /^03[0-9]{9}$/, message: "Enter valid phone (03XXXXXXXXX)" }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="03XXXXXXXXX" size="large" />
              </Form.Item>

              <Form.Item 
                name='city' 
                label="City" 
                rules={[{ required: true, message: "Please select your city" }]}
              >
                <Select placeholder="Select your city" size="large">
                  {cities.map(city => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                name='address' 
                label="Full Address"
                rules={[{ required: true, message: "Address is required" }]}
              >
                <Input.TextArea placeholder="Market/Area, Street number etc" size="large" rows={3} />
              </Form.Item>
              
              <Button 
                type="primary"
                size="large"
                block
                onClick={registerBusinessDetails}
                className='h-12 bg-blue-600 hover:bg-blue-700'
                disabled={isCreatingBusiness}
              >
                {isCreatingBusiness ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Loader2 className="animate-spin" /> Completing...
                  </span>
                ) : 'Complete Registration'}
              </Button>
            </Form>
          )}
        </div>
        <div className='text-center mt-6'>
          <p className='text-gray-600'>
            Already have an account? {' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <AuthImagePattern 
        title='Modernize Your Business' 
        subtitle='Easily manage sales, inventory and customer data with our POS system'
      />
    </div>
  );
};

export default Register;