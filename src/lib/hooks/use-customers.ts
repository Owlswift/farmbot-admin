// lib/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService, CustomerFilters } from "../services/customers";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: CustomerFilters) =>
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, "stats"] as const,
};

export const useCustomers = (filters: CustomerFilters = {}) => {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customerService.getCustomers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => customerService.getCustomerStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
