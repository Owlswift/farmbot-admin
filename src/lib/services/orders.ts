// lib/services/orders.ts
import { apiClient } from "../api-client";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | "pending_payment"
  | "awaiting_verification"
  | "payment_received"
  | "processing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customerPhone?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  paymentReceiptUrl?: string;
  paymentVerifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: Order["status"];
  notes?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const orderService = {
  // Get all orders
  getOrders: async (filters: OrderFilters = {}): Promise<OrdersResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/orders?${params.toString()}`);
    return response.data;
  },

  // Get single order
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusDto
  ): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${id}/status`, data);
    return response.data;
  },

  // Verify payment receipt
  verifyPayment: async (id: string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${id}/verify-payment`);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  },

  // Get order statistics
  getOrderStats: async (): Promise<{
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> => {
    const response = await apiClient.get("/orders/stats");
    return response.data;
  },

  // Send WhatsApp notification
  sendWhatsAppNotification: async (
    orderId: string,
    message: string
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/orders/${orderId}/whatsapp`, {
      message,
    });
    return response.data;
  },

  // Send payment reminder
  sendPaymentReminder: async (
    orderId: string
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post(
      `/orders/whatsapp/send-payment-reminder`,
      {
        orderId,
      }
    );
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (orderId: string): Promise<Order> => {
    const response = await apiClient.put(`/orders/${orderId}/confirm-payment`);
    return response.data;
  },

  // Process order
  processOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.put(`/orders/${orderId}/process-order`);
    return response.data;
  },

  // Mark as out for delivery
  markAsOutForDelivery: async (orderId: string): Promise<Order> => {
    const response = await apiClient.put(`/orders/${orderId}/out-for-delivery`);
    return response.data;
  },

  // Mark as delivered
  markAsDelivered: async (orderId: string): Promise<Order> => {
    const response = await apiClient.put(`/orders/${orderId}/deliver`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  },
};
