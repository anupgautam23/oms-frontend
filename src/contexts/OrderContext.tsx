import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export enum OrderStatus {
  PENDING,
  CONFIRMED,
  PROCESSING,
  SHIPPED,
  DELIVERED,
  CANCELLED,
}
export interface Order {
  id: string;
  userId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  productName: string;
  quantity: number;
  price: number;
}

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  placeOrder: (orderData: CreateOrderRequest) => Promise<boolean>;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  fetchUserOrders: () => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// API base URL from environment
const ORDER_API_BASE_URL =
  import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:8082";

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Get user orders (filtered by current user)
  const userOrders = orders.filter((order) => order.userId === user?.id);

  // Fetch user orders on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("oms_token");
  };

  // Helper function to make authenticated API calls
  const makeAuthenticatedRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${ORDER_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("oms_token");
        localStorage.removeItem("oms_user");
        window.location.href = "/login";
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  // Fetch user orders from backend
  const fetchUserOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest("/api/orders");
      const ordersData = await response.json();

      // Transform backend data to match frontend interface
      const transformedOrders: Order[] = ordersData.map((order: Order) => ({
        id: order.id.toString(),
        userId: order.userId.toString(),
        productName: order.productName,
        quantity: order.quantity,
        price: order.price,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Place a new order
  const placeOrder = async (
    orderData: CreateOrderRequest
  ): Promise<boolean> => {
    if (!user) {
      toast.error("Please login to place an order");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      const newOrder = await response.json();

      // Transform and add new order to state
      const transformedOrder: Order = {
        id: newOrder.id.toString(),
        userId: newOrder.userId.toString(),
        productName: newOrder.productName,
        quantity: newOrder.quantity,
        price: newOrder.price,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
      };

      setOrders((prev) => [transformedOrder, ...prev]);
      toast.success("Order placed successfully!");
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ): Promise<boolean> => {
    if (!user) {
      toast.error("Please login to update order status");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest(
        `/api/orders/${orderId}/status?status=${status}`,
        {
          method: "PUT",
        }
      );

      const updatedOrder = await response.json();

      // Update order in state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: updatedOrder.status,
                updatedAt: updatedOrder.updatedAt,
              }
            : order
        )
      );

      toast.success("Order status updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    if (!user) {
      toast.error("Please login to cancel order");
      return false;
    }

    setIsLoading(true);
    try {
      await makeAuthenticatedRequest(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      // Update order status to cancelled in state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: OrderStatus.CANCELLED,
                updatedAt: new Date().toISOString(),
              }
            : order
        )
      );

      toast.success("Order cancelled successfully");
      return true;
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        userOrders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        fetchUserOrders,
        isLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
