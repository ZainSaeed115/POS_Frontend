import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ComponentRoutes from './component/Routes/ComponentRoutes'
import {ToastContainer} from "react-toastify"
import AddProductModal from './modals/AddProductModal'
import { Outlet } from 'react-router-dom'
import NavBar from './component/dashboard/NavBar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <NavBar/>
    <AddProductModal/>
     <ComponentRoutes/>
     
     <ToastContainer position="top-right"/>
    </>
  )
}

export default App
