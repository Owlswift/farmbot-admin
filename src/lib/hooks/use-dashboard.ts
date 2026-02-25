// lib/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  sales: (period: string) => [...dashboardKeys.all, "sales", period] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSalesData = (
  period: "day" | "week" | "month" | "year" = "month"
) => {
  return useQuery({
    queryKey: dashboardKeys.sales(period),
    queryFn: () => dashboardService.getSalesChartData(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
