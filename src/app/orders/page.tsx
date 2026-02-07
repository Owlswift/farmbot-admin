/* eslint-disable @typescript-eslint/no-explicit-any */
// app/orders/page.tsx
"use client";

import { useState } from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "+2348012345678",
    amount: "₦15,400",
    status: "delivered",
    items: 3,
    payment: "Paid",
    date: "2024-01-15 10:30",
    whatsappChat: true,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    phone: "+2348012345679",
    amount: "₦8,750",
    status: "processing",
    items: 2,
    payment: "Paid",
    date: "2024-01-15 11:45",
    whatsappChat: true,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    phone: "+2348012345680",
    amount: "₦22,100",
    status: "pending",
    items: 5,
    payment: "Pending",
    date: "2024-01-14 09:15",
    whatsappChat: false,
  },
  {
    id: "ORD-004",
    customer: "Sarah Williams",
    phone: "+2348012345681",
    amount: "₦12,500",
    status: "delivered",
    items: 4,
    payment: "Paid",
    date: "2024-01-14 14:20",
    whatsappChat: true,
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    phone: "+2348012345682",
    amount: "₦18,300",
    status: "cancelled",
    items: 3,
    payment: "Refunded",
    date: "2024-01-13 16:45",
    whatsappChat: true,
  },
];

const statuses = [
  { value: "all", label: "All Orders" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "processing":
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // API call to update order status
    console.log(`Update order ${orderId} to ${newStatus}`);
    // Refresh orders
  };

  const sendWhatsAppMessage = (phone: string) => {
    // Open WhatsApp with pre-filled message
    const message = `Hi! This is Onefarm Admin. Regarding your recent order...`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all WhatsApp orders from customers
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
            <ChatBubbleLeftRightIcon className="mr-2 h-4 w-4" />
            Bulk WhatsApp Update
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={`
              inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
              ${
                selectedStatus === status.value
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }
            `}
          >
            {status.value !== "all" && (
              <span
                className={`mr-1.5 h-2 w-2 rounded-full ${
                  status.color?.split(" ")[0]
                }`}
              />
            )}
            {status.label}
            {status.value !== "all" && (
              <span className="ml-1.5 rounded-full bg-white px-1.5 py-0.5 text-xs">
                {orders.filter((o) => o.status === status.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  WhatsApp
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3">
                    <div className="font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {order.items} items
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <div className="font-medium text-gray-900">
                      {order.customer}
                    </div>
                    <div className="text-sm text-gray-500">{order.phone}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <div className="font-semibold text-gray-900">
                      {order.amount}
                    </div>
                    <div
                      className={`text-xs ${
                        order.payment === "Paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.payment}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    {order.whatsappChat ? (
                      <span className="inline-flex items-center text-green-600">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                        Active Chat
                      </span>
                    ) : (
                      <span className="text-gray-400">No Chat</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(order.date), "MMM d, h:mm a")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => sendWhatsAppMessage(order.phone)}
                        className="text-green-600 hover:text-green-800"
                        title="Message on WhatsApp"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "processing")
                          }
                          className="text-blue-600 hover:text-blue-800"
                          title="Start Processing"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      )}
                      {order.status === "processing" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "delivered")
                          }
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Delivered"
                        >
                          <TruckIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setSelectedOrder(null)}
            />
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                Order Details - {selectedOrder.id}
              </h3>
              {/* Add detailed order view here */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-4 px-4 py-2 bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
