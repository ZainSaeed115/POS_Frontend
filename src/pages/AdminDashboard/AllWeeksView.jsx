import { Loader, BarChart2, CreditCard, Package } from 'lucide-react';
import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const AllWeeksView = ({ allWeeksData, isLoading }) => {
  // Process data for all weeks
  const { weeklySummaries, topProducts, bestWeek, groupedDailySales } = useMemo(() => {
    if (!allWeeksData || allWeeksData.length === 0) {
      return { 
        weeklySummaries: [], 
        topProducts: [], 
        bestWeek: null,
        groupedDailySales: [] 
      };
    }

    // Group daily sales by week
    const groupedDailySales = allWeeksData.map(weekData => ({
      week: weekData.week,
      days: weekData.sales.map(day => ({
        ...day,
        date: new Date(day.date),
        weekday: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
      })).sort((a, b) => a.date - b.date)
    }));

    // Process weekly summaries
    const summaries = allWeeksData.map(weekData => ({
      week: weekData.week,
      sales: weekData.totalSales,
      transactions: weekData.totalTransactions,
      avgSale: weekData.totalTransactions > 0 
        ? weekData.totalSales / weekData.totalTransactions 
        : 0
    }));

    // Find best week
    const bestWeek = [...summaries].sort((a, b) => b.sales - a.sales)[0];

    // Process top products across all weeks
    const productMap = {};
    allWeeksData.forEach(weekData => {
      weekData.sales.forEach(day => {
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
    });

    const productsArray = Object.values(productMap);
    const sortedProducts = [...productsArray].sort((a, b) => b.sales - a.sales);
    const topProducts = sortedProducts.slice(0, 5);

    return { 
      weeklySummaries: summaries, 
      topProducts, 
      bestWeek,
      groupedDailySales 
    };
  }, [allWeeksData]);

  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Best Week Highlight */}
      {bestWeek && bestWeek.sales > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">Top Performing Week</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500">Week</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">Week {bestWeek.week}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500">Total Sales</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">Rs {bestWeek.sales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500">Transactions</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{bestWeek.transactions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Performance Comparison */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Weekly Performance</h3>
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklySummaries.filter(week => week.sales > 0)}
              margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="week" 
                label={{ value: 'Week', position: 'bottom', offset: 10 }} 
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="sales" 
                name="Sales (Rs)" 
                fill="#4CAF50" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="transactions" 
                name="Transactions" 
                fill="#2196F3" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Across All Weeks */}
      {topProducts.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Top Products</h3>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Sales (Rs)"
                  radius={[0, 4, 4, 0]}
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Daily Sales Across All Weeks */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Daily Sales</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-500">Week</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-500">Day</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-500">Transactions</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-500">Sales</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedDailySales.length > 0 ? (
                groupedDailySales.flatMap((weekData, weekIndex) => [
                  ...weekData.days.map((day, dayIndex) => (
                    <tr key={`${weekData.week}-${day._id}`} className="hover:bg-gray-50">
                      {dayIndex === 0 && (
                        <td 
                          className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-gray-900" 
                          rowSpan={weekData.days.length}
                        >
                          Week {weekData.week}
                        </td>
                      )}
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-500">
                        {day.date.toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-500">
                        {day.weekday}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-500">
                        {day.totalOrders}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-semibold text-green-600">
                        Rs {day.totalSales.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ])
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllWeeksView;