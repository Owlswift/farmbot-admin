// lib/services/products.ts
import { apiClient } from "../api-client";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  images: string[];
  status: "in_stock" | "low_stock" | "out_of_stock";
  sales: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  images: string[];
  isActive: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const productService = {
  // Get all products with filters
  getProducts: async (
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data.data;
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  createProduct: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post("/products", data);
    return response.data;
  },

  // Update product
  updateProduct: async (
    id: string,
    data: Partial<CreateProductDto>
  ): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // Upload product image
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post("/products/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get product statistics
  getProductStats: async (): Promise<{
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    totalSales: number;
  }> => {
    const response = await apiClient.get("/products/stats");
    return response.data;
  },
};
