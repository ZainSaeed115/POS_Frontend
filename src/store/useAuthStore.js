import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

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

      // Register business owner
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

      // Verify email with token
      // In your useAuthStore
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

      // Register business
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

      // Login user
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

      // Check authentication status
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

      // Logout user
      logoutUser: async () => {
        try {
          await axiosInstance.post('/business/logout');
          set({
            authUser: null,
            businessInformation: [],
            registrationInProgress: false,
            registrationStep: 0
          });
          toast.success("Logged out successfully");
          return true;
        } catch (error) {
          console.error(`Error logging out: ${error}`);
          toast.error("Logout failed. Please try again");
          return false;
        }
      },

      // Validate registration progress
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