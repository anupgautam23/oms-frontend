
import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";

export interface Order {
  id: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  userId: string;
  userName?: string;
}

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  placeOrder: (productName: string, quantity: number, userId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      productName: 'Laptop Pro',
      quantity: 2,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      userId: '1',
      userName: 'John Doe'
    },
    {
      id: '2',
      productName: 'Wireless Mouse',
      quantity: 5,
      status: 'processing',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      userId: '1',
      userName: 'John Doe'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const userOrders = orders.filter(order => order.userId === '1');

  const placeOrder = (productName: string, quantity: number, userId: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newOrder: Order = {
        id: Date.now().toString(),
        productName,
        quantity,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId,
        userName: 'John Doe'
      };
      
      setOrders(prev => [newOrder, ...prev]);
      toast.success('Order placed successfully!');
      setIsLoading(false);
    }, 1000);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    toast.success('Order status updated');
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      userOrders, 
      placeOrder, 
      updateOrderStatus, 
      isLoading 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
