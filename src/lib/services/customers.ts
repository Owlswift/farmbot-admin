// lib/services/customers.ts
import { apiClient } from "../api-client";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  whatsappId?: string;
  createdAt: string;
}

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const customerService = {
  // Get all customers
  getCustomers: async (
    filters: CustomerFilters = {}
  ): Promise<CustomersResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/customers?${params.toString()}`);
    return response.data;
  },

  // Get single customer
  getCustomer: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  // Get customer orders
  getCustomerOrders: async (customerId: string) => {
    const response = await apiClient.get(`/customers/${customerId}/orders`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (
    id: string,
    data: Partial<Customer>
  ): Promise<Customer> => {
    const response = await apiClient.patch(`/customers/${id}`, data);
    return response.data;
  },

  // Get customer statistics
  getCustomerStats: async (): Promise<{
    total: number;
    newThisMonth: number;
    activeCustomers: number;
    averageOrderValue: number;
  }> => {
    const response = await apiClient.get("/customers/stats");
    return response.data;
  },
};
