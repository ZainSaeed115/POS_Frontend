import React, { useEffect, useState } from 'react'
import { useOrderStore } from '../../store/useOrderStore'

const OrderManagement = () => {
  const week=[1,2,3,4]
  const {sales,getWeeklySales,isLoadingSales, month}=useOrderStore();
  const [selectedWeek,setSelectedWeek]=useState(1);

  useEffect(()=>{
    getWeeklySales(selectedWeek)
  },[selectedWeek]);
  return (
    <div className='p-4 sm:p-8 bg-gray-100 min-h-screen'>
      <div className='max-w-6xl mx-auto bg-white -6 sm:p-10 rounded-xl shadow-md'>
        <h1 className='text-3xl font-extrabold  mb-8 text-center text-blue-700'>
           Order Management
        </h1>


        {/* Week Selector */}

        <div className='flex flex-wrap justify-center gap-4 mb-8'>
          {
            week.map((week)=>(
              <button
                key={week}
                className={``}
              >
               {`Week${week}`}
              </button>
            ))          }
        </div>
      </div>
    </div>
  )
}

export default OrderManagement