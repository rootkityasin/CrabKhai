'use client';

import React, { createContext, useContext, useState } from 'react';

// Mock Data
const initialOrders = [
    { id: '#1411610', date: 'Oct 04, 2024, 05:32 PM', customer: 'Shiham Chowdhury', phone: '01856241009', items: 2, source: 'WEB', price: 1250, status: 'Confirmed' },
    { id: '#1411611', date: 'Oct 04, 2024, 06:15 PM', customer: 'Rakib Hasan', phone: '01711223344', items: 5, source: 'WHATSAPP', price: 4500, status: 'Placed' },
    { id: '#1411612', date: 'Oct 04, 2024, 07:00 PM', customer: 'New User', phone: '01900000000', items: 1, source: 'WEB', price: 850, status: 'Processing' },
];

const initialProducts = [
    { id: '1', sku: '799244', name: 'Live Mud Crab (XL)', variants: 5, price: 1250, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=100&fit=crop', stock: true, source: 'Self', stage: 'Selling' },
    { id: '2', sku: '799245', name: 'Shell-less Crab Meat', variants: 3, price: 1850, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=100&fit=crop', stock: true, source: 'Self', stage: 'Process' },
    { id: '3', sku: '799246', name: 'Crab Masala Mix', variants: 1, price: 450, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=100&fit=crop', stock: false, source: 'Self', stage: 'Draft' },
];

interface AdminContextType {
    orders: any[];
    products: any[];
    setOrders: (orders: any[]) => void;
    setProducts: (products: any[]) => void;
    addOrder: (order: any) => void;
    updateOrder: (id: string, updates: any) => void;
    updateProduct: (id: string, updates: any) => void;
    addProduct: (product: any) => void;
    deleteOrder: (id: string) => void;
    deleteProduct: (id: string) => void;
    toggleStock: (id: string) => void;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrdersState] = useState(initialOrders);
    const [products, setProductsState] = useState(initialProducts);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const setOrders = (newOrders: any[]) => setOrdersState(newOrders);
    const setProducts = (newProducts: any[]) => setProductsState(newProducts);

    const addOrder = (order: any) => setOrdersState([order, ...orders]);
    const updateOrder = (id: string, updates: any) => {
        setOrdersState(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    };
    const deleteOrder = (id: string) => setOrdersState(prev => prev.filter(o => o.id !== id));

    const addProduct = (product: any) => setProductsState([product, ...products]);
    const updateProduct = (id: string, updates: any) => {
        setProductsState(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };
    const toggleStock = (id: string) => {
        setProductsState(prev => prev.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
    };
    const deleteProduct = (id: string) => setProductsState(prev => prev.filter(p => p.id !== id));

    const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

    return (
        <AdminContext.Provider value={{
            orders, products, setOrders, setProducts,
            addOrder, updateOrder, deleteOrder,
            addProduct, updateProduct, deleteProduct, toggleStock,
            isSidebarCollapsed, toggleSidebar
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
