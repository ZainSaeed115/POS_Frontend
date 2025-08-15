import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";


export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: false,
      isRegistering: false,
      isVerifying: false,
      isCreatingBusiness: false,
      registrationStep: 0,
      registrationInProgress: false,
      businessInformation: [],
      isLoadingOwnerDetails: false,
      isLoadingBusinessInformationDetails: false,
      isLogging: false,
      isForgetting:false,
      userId:false,

      
      registerBusinessOwner: async (data) => {
        set({ isRegistering: true });
        try {
          const res = await axiosInstance.post('/business/register_owner', data);
          if (res?.data?.success) {
            toast.success(res.data.message || 'Owner registered successfully');
            set({
              authUser: res.data.owner,
              registrationInProgress: true,
              registrationStep: 1, // Move to verification step
              isRegistering: false
            });
            return true;
          }
        } catch (error) {
          set({ isRegistering: false });
          toast.error(error?.response?.data?.error || "Registration failed");
          console.error(`Error in registering business owner: ${error}`);
          return false;
        }
      },

      
      verifyEmailWithVerificationToken: async (data) => {
        set({ isVerifying: true });
        try {
          const res = await axiosInstance.post("/business/verify_email", data, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (res?.data?.success) {
            toast.success(res.data.message || "Email verified successfully");
            set({
              registrationStep: 2,
              isVerifying: false,
              authUser: {
                ...get().authUser,
                isVerified: true,
                verificationToken: undefined
              }
            });
            return true;
          }
        } catch (error) {
          set({ isVerifying: false });
          console.error("Email verification error:", error.response?.data || error);

          const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            "Email verification failed";

          toast.error(errorMessage);
          return false;
        }
      },

     
      registerBusiness: async (data) => {
        set({ isCreatingBusiness: true });
        try {
          const res = await axiosInstance.post("/business/register_business", data);
          console.log("User Data")
          if (res?.data?.success) {
            toast.success(res.data.message || "Business registered successfully");
            set({

              businessInformation: res.data.business,
              registrationInProgress: false,
              registrationStep: 0,
              isCreatingBusiness: false
            });
            return true;
          }
        } catch (error) {
          set({ isCreatingBusiness: false });
          toast.error(error?.response?.data?.error || "Business registration failed");
          console.error(`Error in registering business: ${error}`);
          return false;
        }
      },

     
      loginUser: async (data) => {
        console.log("Login Credentials:", data)

        set({ isLogging: true });
        try {
          const res = await axiosInstance.post("/business/login", data);
          if (res?.data?.success) {
            toast.success("User logged in successfully");
            set({
              isLogging: false,
              authUser: res?.data?.owner,
              businessInformation: res?.data?.business || [],
              registrationInProgress: false,
              registrationStep: 0
            });
            return true;
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || "Login failed! Please try again");
          console.error(`Error in login: ${error}`);
          set({ isLogging: false });
          return false;
        }
      },

    
      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await axiosInstance.get('/business/check_auth');
          if (res?.data?.success) {
            set({
              authUser: res?.data?.user,
              businessInformation: res?.data?.business || [],
              isCheckingAuth: false
            });
            return true;
          } else {
            set({
              authUser: null,
              isCheckingAuth: false,
              businessInformation: []
            });
            return false;
          }
        } catch (error) {
          console.error(`Error checking auth: ${error}`);
          set({
            authUser: null,
            isCheckingAuth: false,
            businessInformation: []
          });
          return false;
        }
      },

   

      logoutUser: async () => {
        try {
          const res = await axiosInstance.post('/business/logout', {}, {
            withCredentials: true
          });

          if (res?.data?.success) {
            
            set({
              authUser: null,
              businessInformation: [],
              registrationInProgress: false,
              registrationStep: 0,
              isLogging: false
            });

          
            localStorage.removeItem('auth-storage');
            
            return {
              success: true,
              message: res.data.message || "Logged out successfully"
            };
          }
          return { success: false, message: "Logout failed" };
        } catch (error) {
          console.error('Logout error:', error.response?.data || error);
          return {
            success: false,
            message: error.response?.data?.message || "Logout failed. Please try again"
          };
        }
      },
    
      validateRegistrationProgress: () => {
        const { authUser, registrationStep } = get();

        if (!authUser) {
          set({ registrationStep: 0 });
          return;
        }

        if (authUser && !authUser.isVerified && registrationStep < 1) {
          set({ registrationStep: 1 }); // Move to verification if registered but not verified
        }
        else if (authUser?.isVerified && registrationStep < 2) {
          set({ registrationStep: 2 }); // Move to business info if verified
        }
      },

      forgotPassword:async(email)=>{
        set({isForgetting:true});
        try {
          const res= await axiosInstance.post('/business/forgot_password',email);
          if(res?.data?.success){
            toast.success(res?.data?.message);
             set({isForgetting:false});
          }
        } catch (error) {
           set({isForgetting:false});
           toast.error(error?.response?.data?.message);
           console.error(`Error in forgotPassword: ${error}`);

        }
      },
      verifyToken:async(code)=>{
        set({isVerifying:true});
          try {
            const res= await axiosInstance.post('/business/verify_token',{token:code});
            if(res?.data?.success){
               toast.success(res?.data?.message);
                set({isVerifying:false,userId:res?.data?.ownerId});
            }
            return res;
          } catch (error) {
             set({isVerifying:false});
            toast.error(error?.response?.data?.message);
           console.error(`Error in verifyToken: ${error}`);
          }
      },
      resetPassword:async(data)=>{
        try {
          const res= await axiosInstance.post('/business/reset_password',data);
          if(res?.data?.success){
            toast.success(res?.data?.message||"Password Reset Successfully");
          }
          return res;
        } catch (error) {
           toast.error(error?.response?.data?.message);
           console.error(`Error in verifyToken: ${error}`);
        }
      }

    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        authUser: state.authUser,
        registrationInProgress: state.registrationInProgress,
        registrationStep: state.registrationStep,
        businessInformation: state.businessInformation
      })
    }
  )
);