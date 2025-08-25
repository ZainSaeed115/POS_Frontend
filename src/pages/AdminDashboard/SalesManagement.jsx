// import { Loader, ChevronDown, ChevronUp, BarChart2, CreditCard, Package, Grid } from 'lucide-react';
// import { useOrderStore } from '../../store/useOrderStore';
// import { useState, useEffect, useMemo } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
// } from 'recharts';
// import AllWeeksView from './AllWeeksView';

// const weeks = [1, 2, 3, 4];
// const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const SalesManagement = () => {
//   const { sales, getWeeklySales, isLoadingSales, month, getAllWeeksSales, monthlyData } = useOrderStore();
//   const [selectedWeek, setSelectedWeek] = useState(1);
//   const [showProductBreakdown, setShowProductBreakdown] = useState(false);
//   const [activeMetric, setActiveMetric] = useState('sales');
//   const [expandedChart, setExpandedChart] = useState(true);
//   const [viewMode, setViewMode] = useState('week');
//   const [allWeeksData, setAllWeeksData] = useState([]);
//   const [isLoadingAllWeeks, setIsLoadingAllWeeks] = useState(false);

//   useEffect(() => {
//     if (viewMode === 'week') {
//       getWeeklySales(selectedWeek);
//     } else if (viewMode === 'all' && monthlyData?.length > 0) {
//       setAllWeeksData(monthlyData);
//     } else {
//       fetchAllWeeksData();
//     }
//   }, [selectedWeek, viewMode, monthlyData]);

//   const fetchAllWeeksData = async () => {
//     setIsLoadingAllWeeks(true);
//     try {
//       const data = await getAllWeeksSales();
//       setAllWeeksData(data);
//     } finally {
//       setIsLoadingAllWeeks(false);
//     }
//   };

//   const { topProducts, otherProducts, summaryStats } = useMemo(() => {
//     const productMap = {};
//     let totalSales = 0;
//     let totalTransactions = 0;

//     sales.forEach(day => {
//       totalSales += day.totalSales;
//       totalTransactions += day.totalOrders;

//       (day.ProductBreakdown || []).forEach(product => {
//         if (!productMap[product.name]) {
//           productMap[product.name] = { 
//             name: product.name, 
//             transactions: 0,
//             sales: 0
//           };
//         }
//         productMap[product.name].transactions += product.orders;
//         productMap[product.name].sales += product.revenue;
//       });
//     });

//     const productsArray = Object.values(productMap);
//     const sortedProducts = [...productsArray].sort((a, b) => b[activeMetric] - a[activeMetric]);

//     return {
//       topProducts: sortedProducts.slice(0, 5),
//       otherProducts: sortedProducts.length > 5 ? [{
//         name: 'Other',
//         transactions: sortedProducts.slice(5).reduce((sum, p) => sum + p.transactions, 0),
//         sales: sortedProducts.slice(5).reduce((sum, p) => sum + p.sales, 0)
//       }] : [],
//       summaryStats: {
//         totalSales,
//         totalTransactions,
//         avgSaleValue: totalTransactions > 0 ? totalSales / totalTransactions : 0
//       }
//     };
//   }, [sales, activeMetric]);

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-md text-sm">
//           <p className="font-bold">{data.name}</p>
//           <p className="text-emerald-500 flex items-center gap-1">
//             <CreditCard className="h-3 w-3" />
//             <span>Sales: Rs {data.sales.toLocaleString()}</span>
//           </p>
//           <p className="text-blue-500 flex items-center gap-1">
//             <Package className="h-3 w-3" />
//             <span>Transactions: {data.transactions}</span>
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

//   return (
//     <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-10">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Dashboard</h1>
//             <p className="text-sm sm:text-base text-gray-500">
//               {viewMode === 'week' ? `Week ${selectedWeek} • ${month}` : 'All Weeks'}
//             </p>
//           </div>

//           {/* View Mode Toggle */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-200">
//               <button
//                 className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all flex items-center gap-1 ${
//                   viewMode === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//                 onClick={() => setViewMode('all')}
//               >
//                 <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
//                 <span className="hidden xs:inline">All Weeks</span>
//               </button>
//               <button
//                 className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
//                   viewMode === 'week' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//                 onClick={() => setViewMode('week')}
//               >
//                 Weekly
//               </button>
//             </div>

//             {viewMode === 'week' && (
//               <div className="flex flex-wrap gap-2 bg-white p-1 rounded-full shadow-sm border border-gray-200">
//                 {weeks.map((week) => (
//                   <button
//                     key={week}
//                     className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
//                       selectedWeek === week ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
//                     }`}
//                     onClick={() => setSelectedWeek(week)}
//                   >
//                     W{week}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {viewMode === 'all' ? (
//           <AllWeeksView allWeeksData={monthlyData} isLoading={isLoadingAllWeeks} />
//         ) : (
//           <>
//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6">
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xs sm:text-sm text-gray-500 font-medium">Total Sales</h3>
//                   <div className="bg-blue-100 p-1 sm:p-2 rounded-lg">
//                     <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
//                   </div>
//                 </div>
//                 <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
//                   Rs {summaryStats.totalSales.toLocaleString()}
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xs sm:text-sm text-gray-500 font-medium">Transactions</h3>
//                   <div className="bg-green-100 p-1 sm:p-2 rounded-lg">
//                     <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//                   </div>
//                 </div>
//                 <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
//                   {summaryStats.totalTransactions}
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xs sm:text-sm text-gray-500 font-medium">Avg. Value</h3>
//                   <div className="bg-purple-100 p-1 sm:p-2 rounded-lg">
//                     <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
//                   </div>
//                 </div>
//                 <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
//                   Rs {summaryStats.avgSaleValue.toFixed(2)}
//                 </p>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//               {/* Chart Header */}
//               <div 
//                 className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 cursor-pointer"
//                 onClick={() => setExpandedChart(!expandedChart)}
//               >
//                 <h2 className="text-base sm:text-lg font-semibold text-gray-900">
//                   Product Performance
//                 </h2>
//                 <button className="text-gray-400 hover:text-gray-600">
//                   {expandedChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                 </button>
//               </div>

//               {/* Metric Toggle */}
//               <div className="px-3 sm:px-4 pt-2 pb-3 border-b border-gray-100">
//                 <div className="inline-flex rounded-md bg-gray-100 p-0.5">
//                   <button
//                     onClick={() => setActiveMetric('sales')}
//                     className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded transition-colors ${
//                       activeMetric === 'sales' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
//                     }`}
//                   >
//                     Sales
//                   </button>
//                   <button
//                     onClick={() => setActiveMetric('transactions')}
//                     className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded transition-colors ${
//                       activeMetric === 'transactions' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
//                     }`}
//                   >
//                     Transactions
//                   </button>
//                 </div>
//               </div>

//               {/* Chart Area */}
//               {expandedChart && (
//                 <div className="p-3 sm:p-4">
//                   {isLoadingSales ? (
//                     <div className="h-60 flex items-center justify-center">
//                       <Loader className="animate-spin text-blue-600" size={32} />
//                     </div>
//                   ) : (
//                     <div className="h-60 sm:h-80">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                           data={[...topProducts, ...otherProducts]}
//                           margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
//                           layout="vertical"
//                         >
//                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//                           <XAxis type="number" />
//                           <YAxis 
//                             dataKey="name" 
//                             type="category" 
//                             width={80}
//                             tick={{ fontSize: 12 }}
//                           />
//                           <Tooltip content={<CustomTooltip />} />
//                           <Bar
//                             dataKey={activeMetric}
//                             radius={[0, 4, 4, 0]}
//                           >
//                             {[...topProducts, ...otherProducts].map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Bar>
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Daily Performance */}
//               <div className="p-3 sm:p-4 border-t border-gray-100">
//                 <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Daily Performance</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-500">Day</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-500">Transactions</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-500">Sales</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {isLoadingSales ? (
//                         <tr>
//                           <td colSpan="4" className="px-3 py-8 text-center">
//                             <Loader className="animate-spin text-blue-600 mx-auto" size={24} />
//                           </td>
//                         </tr>
//                       ) : sales.length > 0 ? (
//                         sales.map((day) => (
//                           <tr key={day._id} className="hover:bg-gray-50">
//                             <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
//                               {new Date(day.date).toLocaleDateString()}
//                             </td>
//                             <td className="px-3 py-3 whitespace-nowrap text-gray-500">
//                               {weekdays[new Date(day.date).getDay()]}
//                             </td>
//                             <td className="px-3 py-3 whitespace-nowrap text-gray-500">
//                               {day.totalOrders}
//                             </td>
//                             <td className="px-3 py-3 whitespace-nowrap font-semibold text-emerald-600">
//                               Rs {day.totalSales.toLocaleString()}
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="4" className="px-3 py-8 text-center text-gray-500">
//                             No data available
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Product Breakdown Toggle */}
//               <div className="p-3 sm:p-4 border-t border-gray-100 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="toggle-breakdown"
//                     checked={showProductBreakdown}
//                     onChange={(e) => setShowProductBreakdown(e.target.checked)}
//                     className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="toggle-breakdown" className="text-xs sm:text-sm text-gray-700">
//                     Show product details
//                   </label>
//                 </div>
//               </div>

//               {/* Product Breakdown */}
//               {showProductBreakdown && (
//                 <div className="p-3 sm:p-4 border-t border-gray-100">
//                   <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Product Details</h3>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-500">Day</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-500">Product</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-500">Transactions</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-500">Sales</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {isLoadingSales ? (
//                           <tr>
//                             <td colSpan="5" className="px-3 py-8 text-center">
//                               <Loader className="animate-spin text-blue-600 mx-auto" size={24} />
//                             </td>
//                           </tr>
//                         ) : sales.length > 0 ? (
//                           sales.flatMap((day) => {
//                             const breakdown = day.ProductBreakdown || [];
//                             if (breakdown.length === 0) {
//                               return [
//                                 <tr key={day._id}>
//                                   <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
//                                     {new Date(day.date).toLocaleDateString()}
//                                   </td>
//                                   <td className="px-3 py-3 whitespace-nowrap text-gray-500">
//                                     {weekdays[new Date(day.date).getDay()]}
//                                   </td>
//                                   <td colSpan="3" className="px-3 py-3 text-gray-500 italic">
//                                     No product data
//                                   </td>
//                                 </tr>,
//                               ];
//                             }

//                             return breakdown.map((product, idx) => (
//                               <tr key={`${day._id}-${idx}`} className="hover:bg-gray-50">
//                                 {idx === 0 && (
//                                   <>
//                                     <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900" rowSpan={breakdown.length}>
//                                       {new Date(day.date).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-3 py-3 whitespace-nowrap text-gray-500" rowSpan={breakdown.length}>
//                                       {weekdays[new Date(day.date).getDay()]}
//                                     </td>
//                                   </>
//                                 )}
//                                 <td className="px-3 py-3 whitespace-nowrap text-gray-900">
//                                   {product.name}
//                                 </td>
//                                 <td className="px-3 py-3 whitespace-nowrap text-gray-500">
//                                   {product.orders}
//                                 </td>
//                                 <td className="px-3 py-3 whitespace-nowrap font-semibold text-emerald-600">
//                                   Rs {product.revenue.toLocaleString()}
//                                 </td>
//                               </tr>
//                             ));
//                           })
//                         ) : (
//                           <tr>
//                             <td colSpan="5" className="px-3 py-8 text-center text-gray-500">
//                               No product data
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalesManagement;
import { Loader, ChevronDown, ChevronUp, CreditCard, Package, Grid } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useState, useEffect, useMemo } from 'react';
import AllWeeksView from './AllWeeksView';

const weeks = [1, 2, 3, 4];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SalesManagement = () => {
  const { sales, getWeeklySales, isLoadingSales, month, getAllWeeksSales, monthlyData } = useOrderStore();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showProductBreakdown, setShowProductBreakdown] = useState(false);
  const [activeMetric, setActiveMetric] = useState('sales');
  const [expandedSection, setExpandedSection] = useState(true);
  const [viewMode, setViewMode] = useState('week');
  const [allWeeksData, setAllWeeksData] = useState([]);
  const [isLoadingAllWeeks, setIsLoadingAllWeeks] = useState(false);
  console.log("S:", sales)
  useEffect(() => {
    if (viewMode === 'week') {
      getWeeklySales(selectedWeek);
    } else if (viewMode === 'all' && monthlyData?.length > 0) {
      setAllWeeksData(monthlyData);
    } else {
      fetchAllWeeksData();
    }
  }, [selectedWeek, viewMode, monthlyData]);

  const fetchAllWeeksData = async () => {
    setIsLoadingAllWeeks(true);
    try {
      const data = await getAllWeeksSales();
      setAllWeeksData(data);
    } finally {
      setIsLoadingAllWeeks(false);
    }
  };

  const { topProducts, otherProducts, summaryStats } = useMemo(() => {
    const productMap = {};
    let totalSales = 0;
    let totalTransactions = 0;

    sales.forEach(day => {
      totalSales += day.totalSales;
      totalTransactions += day.totalOrders;

      (day.ProductBreakdown || []).forEach(product => {
        if (!productMap[product.name]) {
          productMap[product.name] = {
            name: product.name,
            transactions: 0,
            sales: 0
          };
        }
        productMap[product.name].transactions += product.orders;
        productMap[product.name].sales += product.revenue;
      });
    });

    const productsArray = Object.values(productMap);
    const sortedProducts = [...productsArray].sort((a, b) => b[activeMetric] - a[activeMetric]);

    return {
      topProducts: sortedProducts.slice(0, 5),
      otherProducts: sortedProducts.length > 5 ? [{
        name: 'Other',
        transactions: sortedProducts.slice(5).reduce((sum, p) => sum + p.transactions, 0),
        sales: sortedProducts.slice(5).reduce((sum, p) => sum + p.sales, 0)
      }] : [],
      summaryStats: {
        totalSales,
        totalTransactions,
        avgSaleValue: totalTransactions > 0 ? totalSales / totalTransactions : 0
      }
    };
  }, [sales, activeMetric]);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500">
              {viewMode === 'week' ? `Week ${selectedWeek} • ${month}` : 'All Weeks'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-200">
              <button
                className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all flex items-center gap-1 ${viewMode === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setViewMode('all')}
              >
                <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">All Weeks</span>
              </button>
              <button
                className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${viewMode === 'week' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setViewMode('week')}
              >
                Weekly
              </button>
            </div>

            {viewMode === 'week' && (
              <div className="flex flex-wrap gap-2 bg-white p-1 rounded-full shadow-sm border border-gray-200">
                {weeks.map((week) => (
                  <button
                    key={week}
                    className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${selectedWeek === week ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    onClick={() => setSelectedWeek(week)}
                  >
                    W{week}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {viewMode === 'all' ? (
          <AllWeeksView allWeeksData={monthlyData} isLoading={isLoadingAllWeeks} />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm text-gray-500 font-medium">Total Sales</h3>
                  <div className="bg-blue-100 p-1 sm:p-2 rounded-lg">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
                  Rs {summaryStats.totalSales.toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm text-gray-500 font-medium">Transactions</h3>
                  <div className="bg-green-100 p-1 sm:p-2 rounded-lg">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
                  {summaryStats.totalTransactions}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm text-gray-500 font-medium">Avg. Value</h3>
                  <div className="bg-purple-100 p-1 sm:p-2 rounded-lg">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
                  Rs {summaryStats.avgSaleValue.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {/* Product Performance Header */}
              <div
                className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 cursor-pointer"
                onClick={() => setExpandedSection(!expandedSection)}
              >
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Product Performance
                </h2>
                <button className="text-gray-400 hover:text-gray-600">
                  {expandedSection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Metric Toggle */}
              <div className="px-3 sm:px-4 pt-2 pb-3 border-b border-gray-100">
                <div className="inline-flex rounded-md bg-gray-100 p-0.5">
                  <button
                    onClick={() => setActiveMetric('sales')}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded transition-colors ${activeMetric === 'sales' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                      }`}
                  >
                    Sales
                  </button>
                  <button
                    onClick={() => setActiveMetric('transactions')}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded transition-colors ${activeMetric === 'transactions' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                      }`}
                  >
                    Transactions
                  </button>
                </div>
              </div>

              {/* Product Performance Data */}
              {expandedSection && (
                <div className="p-3 sm:p-4">
                  {isLoadingSales ? (
                    <div className="h-20 flex items-center justify-center">
                      <Loader className="animate-spin text-blue-600" size={32} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900">Top Products</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[...topProducts, ...otherProducts].map((product, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                <span>Sales: Rs {product.sales.toLocaleString()}</span>
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span>Transactions: {product.transactions}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Daily Performance */}
              <div className="p-3 sm:p-4 border-t border-gray-100">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Daily Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">Day</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">Transactions</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">Sales</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoadingSales ? (
                        <tr>
                          <td colSpan="4" className="px-3 py-8 text-center">
                            <Loader className="animate-spin text-blue-600 mx-auto" size={24} />
                          </td>
                        </tr>
                      ) : sales.length > 0 ? (
                        sales.map((day) => (
                          <tr key={day._id} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-500">
                              {weekdays[new Date(day.date).getDay()]}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-500">
                              {day.totalOrders}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap font-semibold text-emerald-600">
                              Rs {day.totalSales.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-3 py-8 text-center text-gray-500">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Breakdown Toggle */}
              <div className="p-3 sm:p-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="toggle-breakdown"
                    checked={showProductBreakdown}
                    onChange={(e) => setShowProductBreakdown(e.target.checked)}
                    className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="toggle-breakdown" className="text-xs sm:text-sm text-gray-700">
                    Show product details
                  </label>
                </div>
              </div>

              {/* Product Breakdown */}
              {showProductBreakdown && (
                <div className="p-3 sm:p-4 border-t border-gray-100">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Product Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Day</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Product</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Unit</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Sales</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoadingSales ? (
                          <tr>
                            <td colSpan="5" className="px-3 py-8 text-center">
                              <Loader className="animate-spin text-blue-600 mx-auto" size={24} />
                            </td>
                          </tr>
                        ) : sales.length > 0 ? (
                          sales.flatMap((day) => {
                            const breakdown = day.ProductBreakdown || [];
                            if (breakdown.length === 0) {
                              return [
                                <tr key={day._id}>
                                  <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                                    {new Date(day.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-gray-500">
                                    {weekdays[new Date(day.date).getDay()]}
                                  </td>
                                  <td colSpan="3" className="px-3 py-3 text-gray-500 italic">
                                    No product data
                                  </td>
                                </tr>,
                              ];
                            }

                            return breakdown.map((product, idx) => (
                              <tr key={`${day._id}-${idx}`} className="hover:bg-gray-50">
                                {idx === 0 && (
                                  <>
                                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900" rowSpan={breakdown.length}>
                                      {new Date(day.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-gray-500" rowSpan={breakdown.length}>
                                      {weekdays[new Date(day.date).getDay()]}
                                    </td>
                                  </>
                                )}
                                <td className="px-3 py-3 whitespace-nowrap text-gray-900">
                                  {product.name} {product.isOffered && '(Offered)'}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-gray-500">
                                  {product.orders}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap font-semibold text-emerald-600">
                                  Rs {product.revenue.toLocaleString()}
                                </td>
                           
                              </tr>
                            ));
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-3 py-8 text-center text-gray-500">
                              No product data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesManagement;