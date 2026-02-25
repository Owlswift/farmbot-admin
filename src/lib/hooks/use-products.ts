// lib/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productService,
  ProductFilters,
  CreateProductDto,
} from "../services/products";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stats: () => [...productKeys.all, "stats"] as const,
};

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.createProduct(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProductDto>;
    }) => productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(productKeys.detail(variables.id), data);
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (_, id) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useProductStats = () => {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => productService.getProductStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
