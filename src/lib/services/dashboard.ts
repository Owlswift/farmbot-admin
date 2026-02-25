// lib/services/dashboard.ts
import { apiClient } from "../api-client";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  salesData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },

  getSalesChartData: async (
    period: "day" | "week" | "month" | "year" = "month"
  ) => {
    const response = await apiClient.get(`/dashboard/sales?period=${period}`);
    return response.data;
  },
};
