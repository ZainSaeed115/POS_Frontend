import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import {toast} from "react-toastify";

export const useProductStore = create((set) => ({
  products: [],
  specificProduct:[],
  scanedProductData:[],
  isScanning: false,
  isAddingNewProduct:false,
  isLoadingProducts: false,
  isLoadingProduct: false,
  isUpdatingProduct:false,
  isDeleteingProduct:false,


  iscreatingCategory:false,
  isUpdatingCategory:false,
  isDeletingCategory:false,
  categoryData:[],
  category:[],
  isLoadingCategories:false,
  totalPages:[],
  
 createNewProduct: async (productData) => {
  set({ isAddingNewProduct: true });
  try {
    const res = await axiosInstance.post('/product/create', productData, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (res?.data) {
      toast.success(`${res.data.message || "Products added successfully"}`);
    }

    await useProductStore.getState().fetchProducts();
    set({ isAddingNewProduct: false });
  } catch (error) {
    toast.error(error?.response?.data?.message || "Product Creation Failed");
    console.log(`Error in creating product: ${error}`);
    set({ isAddingNewProduct: false });
  }
},

  
  updateProduct: async (productId, data) => {
    set({ isUpdatingProduct: true });
    try {
        const res = await axiosInstance.put(`/product/update/${productId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res?.data?.success) {
            toast.success("Product details updated successfully");
            await useProductStore.getState().fetchProducts();
        }
        set({ isUpdatingProduct: false });
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Product update failed");
        console.log(`Error in updating product: ${error}`);
        set({ isUpdatingProduct: false });
        throw error;
    }
  },

  
  deleteProduct:async (productId)=>{
    set({isDeleteingProduct:true})
    try {
      const res= await axiosInstance.delete(`/product/delete/${productId}`);
      if(res?.data?.success){
        toast.success("Product Deleted Successfully");
        set({isDeleteingProduct:false})
        await useProductStore.getState().fetchProducts();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ||"Failed to delete product")
      console.log(`Error in deleting productt:${error}`);
    }
  },
  
  // fetching all products
  // fetchProducts: async (page=1) => {
  //   set({ isLoadingProducts: true });
  //   try {
  //     const res = await axiosInstance.get(`/product/get?page=${page}`);
  //     set({ products: res.data, isLoadingProducts: false });
  //   } catch (error) {
  //     console.log(`Error in fetching products: ${error}`);
  //     set({ isLoadingProducts: false }); 
  //   }
  // },

fetchProducts: async (page = 1, limit = 6, category = "", search = "") => {
  set({ isLoadingProducts: true });
  try {
    let url = `/product/get?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    
    const res = await axiosInstance.get(url);
    
    
    set({
      productsResponse: res.data, 
      products: res.data.products, 
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
      totalProducts: res.data.totalProducts,
      isLoadingProducts: false
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    set({ 
      productsResponse: null,
      products: [],
      isLoadingProducts: false 
    });
  }
},
  // fetching single product
  fetchProduct:async(productId)=>{
    set({isLoadingProduct:true});
    try {
      const res = await axiosInstance(`/product/${productId}`)
      if(res?.data?.success){
        set({specificProduct:res?.data?.product,isLoadingProduct:false});
        console.log("productsss",res)
      }
    } catch (error) {
      console.log(`Error in fetching product: ${error}`);
      set({ isLoadingProducts: false }); 
    }
  },
  
  
  fetchProductCategories:async ()=>{
    set({isLoadingCategories:true})
    try {
      const res= await axiosInstance.get('/category/get');
      set({category:res?.data?.data,isLoadingCategories:false});
    } catch (error) {
      console.log(`Error in Fetching categories details:${error}`);
      
      set({isLoadingCategories:false})
    }
  },
  
  searchProducts: async (name) => {
    set({ isLoadingProducts: true });
    try {
      const res = await axiosInstance.get(`/product/get?search=${name}`);
      set({ products: res.data, isLoadingProducts: false });
    } catch (error) {
      console.log(`Error in fetching products: ${error}`);
      set({ isLoadingProducts: false }); 
    }
  },
  
  // Barcode scanning functions
  setScanning: (isScanning) => set({ isScanning }),
  
  fetchProductsByBarCode: async (barcode) => {
    try {
      // Clean the barcode
      barcode = barcode.trim().replace(/[\n\r]+/g, "");
      
      const res = await axiosInstance.get(`/product/barcode/${barcode}`);
      if (res?.data?.success) {
        return res.data.product;
      }
      throw new Error(res?.data?.message || "Product not found");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to scan barcode");
      console.error('Error fetching product by barcode:', error);
      throw error;
    }
  },


 createProductCategory: async (categoryName) => {
    set({ iscreatingCategory: true });
    try {
        const res = await axiosInstance.post(`/category/create`, categoryName);
        if (res?.data?.success) {
            set((state) => ({
                iscreatingCategory: false,
                category: [...state.category,res.data.data], 
                categoryData: res.data
            }));
            toast.success(`${res.data.message || "New category created successfully"}`);
        }
    } catch (error) {
        set({ iscreatingCategory: false });
        console.error(`Error in creating product category:`, error);
        toast.error(`${error.response?.data?.message || error.message || "Failed to create category"}`);
    }
},
  deleteProductCategory:async (id)=>{
    set({isDeletingCategory:true})
   try {
    const res= await axiosInstance.delete(`/category/delete-category/${id}`);
    if(res?.data?.success){
       set((state)=>({
        isDeletingCategory: false,
        category:state.category.filter(item=>item._id!==id),
        categoryData: res?.data
       }))
      toast.success(`${res?.data?.message||"Category deleted successfully"}`)
    }
   } catch (error) {
    console.log(`Error in deleting category`);
     toast.error(`${error.response?.data?.message || error.message || "Failed to  delete product Category"} `)
   }
  },
 updateProductCategory: async (id, data) => {
    set({ isUpdatingCategory: true });
    try {
        const res = await axiosInstance.put(`/category/update-category/${id}`, data);
        if(res?.data?.success) {
            set((state) => ({
                isUpdatingCategory: false,
                category: state.category.map(item => 
                    item._id === id ? { ...item, ...res.data.category } : item
                ),
                categoryData: res?.data
            }));
            toast.success(`${res?.data?.message || "Category updated successfully"}`);
        }
        return res.data;
    } catch (error) {
        set({ isUpdatingCategory: false });
        toast.error(`${error.response?.data?.message || error.message || "Failed to update category"}`);
        throw error;
    }
},

makeOffer:async (productId,offerPrice)=>{
 try {
    const res = await axiosInstance.post(`/product/make-offer/${productId}`,{offerPrice:offerPrice});
    console.log("OFFER1:",res)
    if(res?.data?.success){
      toast.success("Offered price successfully");

     
    }
     return res;
 } catch (error) {
    toast.error(`${error.response?.data?.message || error.message || "Failed to set offered price"}`);
    throw error;
 }
}
}));