import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-toastify"


export const useOrderStore=create((set)=>({
   items:[],
   sales:[],
   monthlyData: null,
   month:null,
   isLoadingSales:false,
   isPlacingOrder:false,
   isFetchingOrderDeatils:false,
   orderDetails:[],

   addToOrder: (product) =>
    set((state) => {
     
      const existingProduct = state.items.find((item) => item._id === product._id);
      
      if (existingProduct) {
        
        return {
          items: state.items.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          ),
        };
      } else {
       
        return {
          items: [...state.items, { ...product, quantity: 1 }],
        };
      }
    }),
   removeFromOrder: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item._id !== productId),
    })),
   GoBack:(navigate,path='/')=>{
     navigate(path)
   },
    createOrder: async (data,sum,navigate) => {
      set({ isPlacingOrder: true });
      try {
        console.log("product:",data._id,"quantity:",data.quantity)
        const orderData={
          items:data.map((item)=>({
            product:item._id,
            quantity:item.quantity,
            paymentMethod:"cash"
          })),
          totalAmount:sum
        }
        const res = await axiosInstance.post(`/order/create`, orderData);
        
       if(res?.data?.success){
        const orderId=res?.data?.order?._id;
        console.log(`Order placed successfully: ${JSON.stringify(res?.data?.order)}`);
        toast.success('Order placed successfully')
        set({ items: [] }); 
        set({ isPlacingOrder: false });
        navigate(`/order/${orderId}`);
       }
      } catch (error) {
        console.log(`Error in creating order: ${error}`);
        toast.error(error?.response?.data?.message || "An Error occurred while order placing");
        set({ isPlacingOrder: false });
      
      }
    },
    getWeeklySales: async (week) => {
      set({ isLoadingSales: true }); 
      try {
        const res = await axiosInstance.get(`/order/weekly-sales?week=${week}`);
        if (res?.data?.success) {
          set({ sales: res?.data?.days,month:res?.data?.month, isLoadingSales: false }); 
        }
      } catch (error) {
        console.log(`Error in getting Weekly Sales: ${error}`);
        toast.error(error?.response?.data?.message || "An Error occurred while getting weekly sales");
        set({ isLoadingSales: false }); // End loading
      }
    },

    // In your store
getAllWeeksSales: async () => {
  set({ isLoadingSales: true });
  try {
    const res = await axiosInstance.get(`/order/allweeks-sales`);
    console.log("All Week sales:", res?.data);
    if (res?.data?.success) {
      // Transform the API response to match the expected format
      const transformedData = res.data.weeks.map(week => ({
        week: week.week,
        sales: week.sales, // This is already an array of daily sales
        totalSales: week.totalSales,
        totalTransactions: week.totalTransactions
      }));
      set({ monthlyData: transformedData, isLoadingSales: false });
    }
  } catch (error) {
    console.error(error);
    set({ isLoadingSales: false });
  }
},
  
    
    
   getOrderById:async (_id)=>{
    try {
       set({isFetchingOrderDeatils:true});

      const res= await axiosInstance.get(`/order/${_id}`);
      console.log(`Order Deatils fetched successfully:${JSON.stringify(res?.data?.data)}`);
      toast.success('Order details fetched successfully')
      set({ orderDetails: res?.data?.data });
    } catch (error) {
      console.log(`Error in getting Order details:${error}`);
      toast.error(error?.response?.data?.message || "An Error occurred while fetching order details");
    }
   }
}))