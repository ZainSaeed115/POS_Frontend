// Store: useSupplierStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";

export const useSupplierStore = create((set) => ({
  suppliers: [],
  isCreatingSupplier: false,
  isUpdatingSupplier: false,
  isDeletingSupplier: false,
  isLoadingSuppliers: false,

  // ✅ Create Supplier
  createSupplier: async (supplier) => {
    console.log(supplier)
    set({ isCreatingSupplier: true });
    try {
      const res = await axiosInstance.post(`/suppliers/create_supplier`, supplier);
      if (res?.data?.success) {
        set((state) => ({
          isCreatingSupplier: false,
          suppliers: [...state.suppliers, res.data.supplier],
        }));
        toast.success(res.data.message || "Supplier created successfully");
      }
    } catch (error) {
      set({ isCreatingSupplier: false });
      toast.error(error.response?.data?.message || "Failed to create supplier");
    }
  },

  fetchSuppliers: async () => {
    set({ isLoadingSuppliers: true });
    try {
      const res = await axiosInstance.get(`/suppliers/get_suppliers_details`);
      if (res?.data?.success) {
        set({ suppliers: res.data.suppliers, isLoadingSuppliers: false });
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      set({ isLoadingSuppliers: false });
      toast.error(error.response?.data?.message || "Failed to fetch suppliers");
    }
  },

  updateSupplier: async (id, data) => {
    set({ isUpdatingSupplier: true });
    try {
      const res = await axiosInstance.put(`/suppliers/update_supplier_detail/${id}`, data);
      if (res?.data?.success) {
        set((state) => ({
          isUpdatingSupplier: false,
          suppliers: state.suppliers.map((s) =>
            s._id === id ? { ...s, ...data } : s
          ),
        }));
        toast.success(res?.data?.message || "Supplier updated successfully");
      }
      return res.data;
    } catch (error) {
      set({ isUpdatingSupplier: false });
      toast.error(error.response?.data?.message || "Failed to update supplier");
      throw error;
    }
  },

  deleteSupplier: async (id) => {
    set({ isDeletingSupplier: true });
    try {
      const res = await axiosInstance.delete(`/suppliers/delete/${id}`);
      if (res?.data?.success) {
        set((state) => ({
          isDeletingSupplier: false,
          suppliers: state.suppliers.filter((s) => s._id !== id),
        }));
        toast.success(res?.data?.message || "Supplier deleted successfully");
      }
    } catch (error) {
      set({ isDeletingSupplier: false });
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    }
  },
}));