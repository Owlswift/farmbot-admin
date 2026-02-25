// lib/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  orderService,
  OrderFilters,
  UpdateOrderStatusDto,
} from "../services/orders";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: () => [...orderKeys.all, "stats"] as const,
};

export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderService.getOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) =>
      orderService.updateOrderStatus(id, data),
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables.id), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: () => {
      // Error handling will be done in the component
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.verifyPayment(id),
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => orderService.getOrderStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSendPaymentReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.sendPaymentReminder(orderId),
    onSuccess: () => {
      // Invalidate orders list to refresh data
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.confirmPayment(orderId),
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useProcessOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.processOrder(orderId),
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useMarkAsOutForDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.markAsOutForDelivery(orderId),
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useMarkAsDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.markAsDelivered(orderId),
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};
