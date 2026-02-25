// app/dashboard/page.tsx
"use client";

import {
  ShoppingCartIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useDashboardStats, useSalesData } from "@/lib/hooks/use-dashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading } = useSalesData("month");

  const stats = dashboardStats
    ? [
        {
          name: "Total Revenue",
          value: `₦${dashboardStats.totalRevenue.toLocaleString()}`,
          change: `${dashboardStats.revenueGrowth > 0 ? "+" : ""}${
            dashboardStats.revenueGrowth
          }%`,
          changeType:
            dashboardStats.revenueGrowth > 0 ? "positive" : "negative",
          icon: CurrencyDollarIcon,
        },
        {
          name: "Total Orders",
          value: dashboardStats.totalOrders.toLocaleString(),
          change: `${dashboardStats.orderGrowth > 0 ? "+" : ""}${
            dashboardStats.orderGrowth
          }%`,
          changeType: dashboardStats.orderGrowth > 0 ? "positive" : "negative",
          icon: ShoppingCartIcon,
        },
        {
          name: "Total Customers",
          value: dashboardStats.totalCustomers.toLocaleString(),
          change: `${dashboardStats.customerGrowth > 0 ? "+" : ""}${
            dashboardStats.customerGrowth
          }%`,
          changeType:
            dashboardStats.customerGrowth > 0 ? "positive" : "negative",
          icon: UsersIcon,
        },
        {
          name: "Total Products",
          value: dashboardStats.totalProducts.toLocaleString(),
          change: "+12%",
          changeType: "positive",
          icon: CubeIcon,
        },
      ]
    : [];

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 shadow animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here&#39;s what&#39;s happening with your farm produce
          orders today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-green-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ArrowTrendingDownIcon
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                )}
                <span className="ml-1">{stat.change}</span>
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sales Overview
          </h3>
          <div className="h-80">
            {salesLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM d")}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) =>
                      format(new Date(date), "MMM d, yyyy")
                    }
                    formatter={(value) => [
                      `₦${value?.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Products
          </h3>
          <div className="space-y-4">
            {dashboardStats?.topProducts?.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ₦{product.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
