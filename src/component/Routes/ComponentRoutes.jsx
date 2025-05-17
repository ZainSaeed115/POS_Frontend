import React, { lazy, Suspense, useEffect } from 'react'
import {Navigate, Route,Routes,} from "react-router-dom"
import { useAuthStore } from '../../store/useAuthStore'
import { Loader } from 'lucide-react'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import RegistrationRoutes from './RegistrationRoutes '
import Dashboard from '../../pages/AdminDashboard/Dashboard'
import ProductManagement from '../../pages/AdminDashboard/ProductManagement'
import CategoryManagement from '../../pages/AdminDashboard/CategoryManagement'
const Home=lazy(()=>import('../../pages/Home'))
const OrderDeatails =lazy(()=>import('../../pages/OrderDeatails'))
const Register=lazy(()=>import('../../pages/Register'))
const Login=lazy(()=>import('../../pages/Login'))

// admin routes 
const OrderManagement=lazy(()=>import('../../pages/AdminDashboard/OrderManagement'));
const SalesManagement=lazy(()=>import('../../pages/AdminDashboard/SalesManagement'))
const ComponentRoutes = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  
  return (
   <Suspense  fallback={
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  }>
     <Routes>
        <Route  path="/" element={<PrivateRoutes><Home/></PrivateRoutes>}/>
        <Route path='/order/:orderId' element={<PrivateRoutes><OrderDeatails/></PrivateRoutes>}/>
        <Route path='/register' element={<RegistrationRoutes><Register/></RegistrationRoutes>}/>
        <Route path='/login' element={<PublicRoutes><Login/></PublicRoutes>}/>
        

            <Route path='/product' element={<PrivateRoutes><ProductManagement/></PrivateRoutes>}/>
           <Route path='/orders' element={<PrivateRoutes><OrderManagement/></PrivateRoutes>}/>
           <Route path='/sales' element={<PrivateRoutes><SalesManagement/></PrivateRoutes>}/>
           <Route path='/category' element={<PrivateRoutes><CategoryManagement/></PrivateRoutes>}/>
    </Routes>
   </Suspense>
  )
}

export default ComponentRoutes