import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";


export const useBusinessStore=create(
    persist(
        (set,get)=>({
           businessData:[],
           isBusinessDataLoading:false,



           getBusinessInformation:async ()=>{
                set({isBusinessDataLoading:true})
            try {
                const res= await axiosInstance.get(`/business/business_information`);
                
                if(res?.data?.success){
                    console.log("Business Data:",res?.data?.business)
                  set({
                    businessData:res?.data?.business,
                    isBusinessDataLoading:false
                  })
                }
            } catch (error) {
                set({isBusinessDataLoading:false})
                console.log(`Error in getting business details:${error}`);
              
            }
           }
        })
    )
)