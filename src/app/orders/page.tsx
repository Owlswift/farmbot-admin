/* eslint-disable @typescript-eslint/no-explicit-any */
// app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  DocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  useOrders,
  useUpdateOrderStatus,
  useVerifyPayment,
  useSendPaymentReminder,
  useConfirmPayment,
  useProcessOrder,
  useMarkAsOutForDelivery,
  useMarkAsDelivered,
  useCancelOrder,
} from "../../lib/hooks/use-orders";
import { OrderStatus } from "../../lib/services/orders";

const statuses = [
  { value: "all", label: "All Orders" },
  {
    value: "pending_payment",
    label: "Pending Payment",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "awaiting_verification",
    label: "Awaiting Verification",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "payment_received",
    label: "Payment Received",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "out_for_delivery",
    label: "Out for Delivery",
    color: "bg-purple-100 text-purple-800",
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

  const { data: ordersResponse, isLoading } = useOrders({
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });

  const updateStatusMutation = useUpdateOrderStatus();
  const verifyPaymentMutation = useVerifyPayment();
  const sendReminderMutation = useSendPaymentReminder();
  const confirmPaymentMutation = useConfirmPayment();
  const processOrderMutation = useProcessOrder();
  const markAsOutForDeliveryMutation = useMarkAsOutForDelivery();
  const markAsDeliveredMutation = useMarkAsDelivered();
  const cancelOrderMutation = useCancelOrder();

  // Toast notifications for all mutations
  useEffect(() => {
    if (updateStatusMutation.isSuccess) {
      toast.success("Order status updated successfully");
    }
    if (updateStatusMutation.isError) {
      toast.error("Failed to update order status");
    }
  }, [updateStatusMutation.isSuccess, updateStatusMutation.isError]);

  useEffect(() => {
    if (verifyPaymentMutation.isSuccess) {
      toast.success("Payment verified successfully");
    }
    if (verifyPaymentMutation.isError) {
      toast.error("Failed to verify payment");
    }
  }, [verifyPaymentMutation.isSuccess, verifyPaymentMutation.isError]);

  useEffect(() => {
    if (sendReminderMutation.isSuccess) {
      toast.success("Payment reminder sent successfully");
    }
    if (sendReminderMutation.isError) {
      toast.error("Failed to send payment reminder");
    }
  }, [sendReminderMutation.isSuccess, sendReminderMutation.isError]);

  useEffect(() => {
    if (confirmPaymentMutation.isSuccess) {
      toast.success("Payment confirmed successfully");
    }
    if (confirmPaymentMutation.isError) {
      toast.error("Failed to confirm payment");
    }
  }, [confirmPaymentMutation.isSuccess, confirmPaymentMutation.isError]);

  useEffect(() => {
    if (processOrderMutation.isSuccess) {
      toast.success("Order processing started successfully");
    }
    if (processOrderMutation.isError) {
      toast.error("Failed to start order processing");
    }
  }, [processOrderMutation.isSuccess, processOrderMutation.isError]);

  useEffect(() => {
    if (markAsOutForDeliveryMutation.isSuccess) {
      toast.success("Order marked as out for delivery");
    }
    if (markAsOutForDeliveryMutation.isError) {
      toast.error("Failed to mark order as out for delivery");
    }
  }, [
    markAsOutForDeliveryMutation.isSuccess,
    markAsOutForDeliveryMutation.isError,
  ]);

  useEffect(() => {
    if (markAsDeliveredMutation.isSuccess) {
      toast.success("Order marked as delivered");
    }
    if (markAsDeliveredMutation.isError) {
      toast.error("Failed to mark order as delivered");
    }
  }, [markAsDeliveredMutation.isSuccess, markAsDeliveredMutation.isError]);

  useEffect(() => {
    if (cancelOrderMutation.isSuccess) {
      toast.success("Order cancelled successfully");
    }
    if (cancelOrderMutation.isError) {
      toast.error("Failed to cancel order");
    }
  }, [cancelOrderMutation.isSuccess, cancelOrderMutation.isError]);

  const orders = ordersResponse?.orders || [];

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "payment_received":
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case "processing":
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case "out_for_delivery":
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case "pending_payment":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "awaiting_verification":
        return <DocumentIcon className="h-5 w-5 text-orange-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
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
              inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
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
          <table className="min-w-full divide-y divide-gray-300 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900"
                >
                  WhatsApp
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3">
                      <div className="font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""} • ₦
                        {order.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="font-medium text-gray-900">
                        {order.customerName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="font-semibold text-gray-900">
                        ₦{order.totalAmount.toLocaleString()}
                      </div>
                      <div
                        className={`text-xs ${
                          order.status === "payment_received" ||
                          order.paymentVerifiedAt
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.paymentVerifiedAt ? "Verified" : "Pending"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {order.customerPhone ? (
                        <span className="inline-flex items-center text-green-600">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                          Available
                        </span>
                      ) : (
                        <span className="text-gray-400">No Phone</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                      {format(new Date(order.createdAt), "MMM d, h:mm a")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {order.customerPhone && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sendWhatsAppMessage(order.customerPhone!);
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Message on WhatsApp"
                          >
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          </button>
                        )}
                        {order.paymentReceiptUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(order.paymentReceiptUrl, "_blank");
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Payment Receipt"
                          >
                            <DocumentIcon className="h-5 w-5" />
                          </button>
                        )}
                        {order.status === "awaiting_verification" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              verifyPaymentMutation.mutate(order._id);
                            }}
                            disabled={verifyPaymentMutation.isPending}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                            title="Confirm Payment"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        )}
                        {order.status === "payment_received" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatusMutation.mutate({
                                id: order._id,
                                data: { status: "processing" },
                              });
                            }}
                            disabled={updateStatusMutation.isPending}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            title="Start Processing"
                          >
                            <ArrowPathIcon className="h-5 w-5" />
                          </button>
                        )}
                        {order.status === "processing" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsOutForDeliveryMutation.mutate(order._id);
                            }}
                            disabled={markAsOutForDeliveryMutation.isPending}
                            className="text-purple-600 hover:text-purple-800 disabled:opacity-50"
                            title="Out for Delivery"
                          >
                            <TruckIcon className="h-5 w-5" />
                          </button>
                        )}
                        {order.status === "out_for_delivery" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsDeliveredMutation.mutate(order._id);
                            }}
                            disabled={markAsDeliveredMutation.isPending}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                            title="Mark as Delivered"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedOrder(null)}
            />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        Order Details - {selectedOrder.orderNumber}
                      </h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <span className="sr-only">Close panel</span>
                          <XCircleIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedOrder.customerName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {selectedOrder.customerPhone}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {getStatusIcon(selectedOrder.status)}
                            <span className="ml-1 text-xs text-gray-600 capitalize">
                              {selectedOrder.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(
                            new Date(selectedOrder.createdAt),
                            "MMM d, h:mm a"
                          )}
                        </p>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Order Items
                        </h3>
                        <div className="space-y-2">
                          {selectedOrder.items.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between items-center bg-white border border-gray-200 rounded-md p-3"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {item.quantity} × ₦
                                    {item.unitPrice.toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                  ₦{item.totalPrice.toLocaleString()}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            ₦{selectedOrder.subtotal.toLocaleString()}
                          </span>
                        </div>
                        {selectedOrder.deliveryFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-medium">
                              ₦{selectedOrder.deliveryFee.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-semibold border-t pt-2">
                          <span>Total</span>
                          <span>
                            ₦{selectedOrder.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      {selectedOrder.deliveryAddress && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            Delivery Address
                          </h3>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-2">
                            {selectedOrder.deliveryAddress}
                          </p>
                        </div>
                      )}

                      {/* Payment Receipt Image */}
                      {selectedOrder.paymentReceiptUrl &&
                        selectedOrder.status === "awaiting_verification" && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">
                              Payment Receipt
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <img
                                src={selectedOrder.paymentReceiptUrl}
                                alt="Payment Receipt"
                                className="w-full h-auto rounded-md border border-gray-200"
                              />
                            </div>
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="pt-3 border-t space-y-3">
                        {/* Confirm Payment Button */}
                        {selectedOrder.status === "awaiting_verification" &&
                          selectedOrder.paymentReceiptUrl && (
                            <button
                              onClick={() =>
                                confirmPaymentMutation.mutate(selectedOrder._id)
                              }
                              disabled={confirmPaymentMutation.isPending}
                              className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              {confirmPaymentMutation.isPending ? (
                                <>
                                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                  Confirming...
                                </>
                              ) : (
                                <>
                                  <CheckIcon className="mr-2 h-4 w-4" />
                                  Confirm Payment
                                </>
                              )}
                            </button>
                          )}

                        {/* Process Order Button */}
                        {selectedOrder.status === "payment_received" && (
                          <button
                            onClick={() =>
                              processOrderMutation.mutate(selectedOrder._id)
                            }
                            disabled={processOrderMutation.isPending}
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                          >
                            {processOrderMutation.isPending ? (
                              <>
                                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <ArrowPathIcon className="mr-2 h-4 w-4" />
                                Process Order
                              </>
                            )}
                          </button>
                        )}

                        {/* Out for Delivery Button */}
                        {selectedOrder.status === "processing" && (
                          <button
                            onClick={() =>
                              markAsOutForDeliveryMutation.mutate(
                                selectedOrder._id
                              )
                            }
                            disabled={markAsOutForDeliveryMutation.isPending}
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                          >
                            {markAsOutForDeliveryMutation.isPending ? (
                              <>
                                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <TruckIcon className="mr-2 h-4 w-4" />
                                Mark as Out for Delivery
                              </>
                            )}
                          </button>
                        )}

                        {/* Mark as Delivered Button */}
                        {selectedOrder.status === "out_for_delivery" && (
                          <button
                            onClick={() =>
                              markAsDeliveredMutation.mutate(selectedOrder._id)
                            }
                            disabled={markAsDeliveredMutation.isPending}
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            {markAsDeliveredMutation.isPending ? (
                              <>
                                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="mr-2 h-4 w-4" />
                                Mark as Delivered
                              </>
                            )}
                          </button>
                        )}

                        {/* Send Payment Reminder Button */}
                        {selectedOrder.status === "pending_payment" && (
                          <button
                            onClick={() =>
                              sendReminderMutation.mutate(selectedOrder._id)
                            }
                            disabled={sendReminderMutation.isPending}
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {sendReminderMutation.isPending ? (
                              <>
                                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <ChatBubbleLeftRightIcon className="mr-2 h-4 w-4" />
                                Send Payment Reminder
                              </>
                            )}
                          </button>
                        )}

                        {/* Cancel Order Button */}
                        {(selectedOrder.status === "pending_payment" ||
                          selectedOrder.status === "payment_received" ||
                          selectedOrder.status === "processing") && (
                          <button
                            onClick={() =>
                              cancelOrderMutation.mutate(selectedOrder._id)
                            }
                            disabled={cancelOrderMutation.isPending}
                            className="w-full inline-flex justify-center items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            {cancelOrderMutation.isPending ? (
                              <>
                                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="mr-2 h-4 w-4" />
                                Cancel Order
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
