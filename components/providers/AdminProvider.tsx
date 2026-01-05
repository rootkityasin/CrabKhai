'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

// --- Types ---
export type Role = 'SUPER_ADMIN' | 'HUB_ADMIN';

export interface Hub {
    id: string;
    name: string;
    location: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    hubId?: string; // If null/undefined, effectively Super Admin access to all
}

// --- Mock Data ---
const HUBS: Hub[] = [
    { id: 'dhaka-central', name: 'Dhaka Central Hub', location: 'Dhaka' },
    { id: 'khulna-hub', name: 'Khulna Hub', location: 'Khulna' },
    { id: 'chattogram-hub', name: 'Chattogram Hub', location: 'Chattogram' },
];

const MOCK_USERS: User[] = [
    { id: 'super-admin', name: 'Super Admin', email: 'admin@crabkhai.com', role: 'SUPER_ADMIN' },
    { id: 'khulna-admin', name: 'Khulna Manager', email: 'khulna@crabkhai.com', role: 'HUB_ADMIN', hubId: 'khulna-hub' },
    { id: 'dhaka-admin', name: 'Dhaka Manager', email: 'dhaka@crabkhai.com', role: 'HUB_ADMIN', hubId: 'dhaka-central' },
];

const initialOrders = [
    { id: '#1411610', date: 'Oct 04, 2024, 05:32 PM', customer: 'Shiham Chowdhury', phone: '01856241009', items: 2, source: 'WEB', price: 1250, status: 'Confirmed', hubId: 'dhaka-central' },
    { id: '#1411611', date: 'Oct 04, 2024, 06:15 PM', customer: 'Rakib Hasan', phone: '01711223344', items: 5, source: 'WHATSAPP', price: 4500, status: 'Placed', hubId: 'khulna-hub' },
    { id: '#1411612', date: 'Oct 04, 2024, 07:00 PM', customer: 'New User', phone: '01900000000', items: 1, source: 'WEB', price: 850, status: 'Processing', hubId: 'dhaka-central' },
    { id: '#1411613', date: 'Oct 05, 2024, 11:00 AM', customer: 'Khulna Cust', phone: '01500000000', items: 3, source: 'WEB', price: 2100, status: 'Confirmed', hubId: 'khulna-hub' },
];

const initialProducts = [
    // Best Sellers
    {
        id: '1',
        sku: 'BS001',
        name: 'Signature Masala Crab wings',
        variants: 1,
        price: 350,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/651903648889884.png',
        images: [
            'https://www.easykoro.com/inventories/fit-in/400x400/651903648889884.png',
            'https://www.easykoro.com/inventories/fit-in/400x400/1684482693291279.png',
            'https://www.easykoro.com/inventories/fit-in/400x400/604194297355933.png'
        ],
        stock: true,
        source: 'Self',
        stage: 'Selling',
        hubId: 'dhaka-central',
        pieces: 12,
        totalSold: 443,
        weightOptions: ['200g', '400g', '600g', '1kg'],
        features: [
            '100% real crab meat',
            'Ready to cook & serve in minutes',
            'Crispy texture, juicy inside',
            'Perfect for snacks, tiffin, or gatherings'
        ]
    },
    {
        id: '2',
        sku: 'BS002',
        name: 'Signature Masala Crab Bomb',
        variants: 2,
        price: 350,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/1684482693291279.png',
        images: [
            'https://www.easykoro.com/inventories/fit-in/400x400/1684482693291279.png',
            'https://www.easykoro.com/inventories/fit-in/400x400/651903648889884.png'
        ],
        stock: true,
        source: 'Self',
        stage: 'Selling',
        hubId: 'dhaka-central',
        pieces: 8,
        totalSold: 1250,
        weightOptions: ['250g', '500g'],
        features: [
            'Spicy masala blend',
            'No preservatives',
            'Halal certified'
        ]
    },
    {
        id: '3',
        sku: 'BS003',
        name: 'Crispy Crab Wings',
        variants: 0,
        price: 330,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/604194297355933.png',
        stock: true,
        source: 'Self',
        stage: 'Selling',
        hubId: 'dhaka-central',
        pieces: 10,
        totalSold: 89,
        weightOptions: ['1 Box'],
        features: ['Kid favorite', 'Mild spice']
    },

    // Super Savings
    {
        id: '4',
        sku: 'SS001',
        name: 'WINGS & BOMB COMBO',
        variants: 1,
        price: 1200,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/4838007732246716.jpg',
        stock: true,
        source: 'Self',
        stage: 'Selling',
        hubId: 'dhaka-central',
        pieces: 20,
        totalSold: 320,
        weightOptions: ['Family Pack'],
        features: ['Best Value', 'Includes Sauce']
    },
    { id: '5', sku: 'SS002', name: 'Tempura Shrimp', variants: 3, price: 400, image: 'https://www.easykoro.com/inventories/fit-in/400x400/745402355963125.png', stock: true, source: 'Self', stage: 'Selling', hubId: 'khulna-hub', pieces: 15, totalSold: 56, weightOptions: ['200g'], features: ['Authentic Japanese Style'] },

    // New Arrivals
    { id: '6', sku: 'NA001', name: 'Raw Crab Clean', variants: 0, price: 450, image: 'https://www.easykoro.com/inventories/fit-in/400x400/587600975137614.png', stock: true, source: 'Self', stage: 'Selling', hubId: 'chattogram-hub', pieces: 6, totalSold: 12, weightOptions: ['1kg'], features: ['Fresh Catch'] },
    { id: '7', sku: 'NA002', name: 'Crispy Crab Bomb', variants: 1, price: 330, image: 'https://www.easykoro.com/inventories/fit-in/400x400/606088101401451.png', stock: true, source: 'Self', stage: 'Selling', hubId: 'dhaka-central', pieces: 9, totalSold: 200, weightOptions: ['500g'], features: ['Party Snack'] },

    // Others
    { id: '8', sku: '799245', name: 'Shell-less Crab Meat', variants: 3, price: 1850, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=300&fit=crop', stock: true, source: 'Self', stage: 'Process', hubId: 'dhaka-central', pieces: 18, totalSold: 5, weightOptions: ['1kg'], features: ['Premium Quality'] },
    { id: '9', sku: '799246', name: 'Crab Masala Mix', variants: 1, price: 450, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=300&fit=crop', stock: false, source: 'Self', stage: 'Draft', hubId: 'khulna-hub', pieces: 12, totalSold: 0, weightOptions: ['100g'], features: ['Spice Mix'] },
];

interface AdminContextType {
    orders: any[];
    products: any[];
    allProducts: any[];
    allOrders: any[];
    settings: {
        contactPhone: string;
        contactEmail: string;
        contactAddress: string;
        shopName: string;
        logoUrl: string;
        measurementUnit: string;
        allergensText: string;
        certificates: string[];
    };

    // RBAC & Hubs
    currentUser: User;
    activeHubId: string | 'ALL'; // 'ALL' only for Super Admin to see aggregate
    hubs: Hub[];
    availableHubs: Hub[]; // Hubs visible to current user
    switchHub: (hubId: string | 'ALL') => void;
    loginAs: (userId: string) => void;

    // Actions
    setOrders: (orders: any[]) => void;
    setProducts: (products: any[]) => void;
    updateSettings: (settings: any) => void;
    addOrder: (order: any) => void;
    updateOrder: (id: string, updates: any) => void;
    updateProduct: (id: string, updates: any) => void;
    addProduct: (product: any) => void;
    deleteOrder: (id: string) => void;
    deleteProduct: (id: string) => void;
    toggleStock: (id: string) => void;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    // Auth State
    const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default Super Admin
    const [activeHubId, setActiveHubId] = useState<string | 'ALL'>('ALL');

    const [orders, setOrdersState] = useState(initialOrders);
    const [products, setProductsState] = useState(initialProducts);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true); // Default collapsed (mobile friendly start)

    // --- RBAC Logic ---

    // Login Handler (Simulated)
    const loginAs = (userId: string) => {
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            // If Hub Admin, force their hub. If Super Admin, default to ALL or keep current.
            if (user.role === 'HUB_ADMIN' && user.hubId) {
                setActiveHubId(user.hubId);
            } else {
                setActiveHubId('ALL');
            }
        }
    };

    // Derived: Available Hubs for the current user
    const availableHubs = useMemo(() => {
        if (currentUser.role === 'SUPER_ADMIN') return HUBS;
        return HUBS.filter(h => h.id === currentUser.hubId);
    }, [currentUser]);

    // Derived: Filtered Data based on Active Hub / Role
    const filteredOrders = useMemo(() => {
        if (activeHubId === 'ALL') return orders;
        return orders.filter(o => o.hubId === activeHubId);
    }, [orders, activeHubId]);

    const filteredProducts = useMemo(() => {
        if (activeHubId === 'ALL') return products;
        return products.filter(p => p.hubId === activeHubId || !p.hubId); // Products might remain global? Assuming local for now.
    }, [products, activeHubId]);


    // --- Persistence & Settings ---
    const [settings, setSettings] = useState({
        contactPhone: "+880 1804 221 161",
        contactEmail: "crabkhaibangladesh@gmail.com",
        contactAddress: "195 Green Road, Dhaka",
        shopName: "Crab & Khai",
        logoUrl: "/logo.svg",
        measurementUnit: "PCS",
        allergensText: "Crustaceans",
        certificates: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/HACCP_Certification_Mark.svg/1200px-HACCP_Certification_Mark.svg.png",
            "https://www.qualityaustria.com/fileadmin/_processed_/c/9/csm_GMP_Good_Manufacturing_Practice_Logo_3502845680.jpg",
        ]
    });

    // Load from LocalStorage on Mount AND fetch fresh config
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            // 1. Try LocalStorage for instant render
            const savedData = localStorage.getItem('crab-khai-admin-data-v7');
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    if (parsed.orders) setOrdersState(parsed.orders);
                    if (parsed.products) setProductsState(parsed.products);
                    if (parsed.settings) setSettings(prev => ({ ...prev, ...parsed.settings }));
                } catch (e) { console.error(e); }
            }

            // 2. Fetch fresh from DB (Background)
            import('@/app/actions/settings').then(mod => {
                mod.getSiteConfig().then(dbConfig => {
                    if (dbConfig) {
                        setSettings(prev => ({
                            ...prev,
                            ...dbConfig,
                            logoUrl: dbConfig.logoUrl ?? prev.logoUrl
                        }));
                    }
                });
            });
        }
    }, []);

    // Save to LocalStorage on Change
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const dataToSave = {
                orders: orders,
                products: products,
                settings: settings
            };
            localStorage.setItem('crab-khai-admin-data-v7', JSON.stringify(dataToSave));
        }
    }, [orders, products, settings]);


    // --- Actions ---
    const setOrders = (newOrders: any[]) => setOrdersState(newOrders);
    const setProducts = (newProducts: any[]) => setProductsState(newProducts);
    const updateSettings = (newSettings: any) => setSettings(prev => ({ ...prev, ...newSettings }));

    const addOrder = (order: any) => setOrdersState([{ ...order, hubId: activeHubId === 'ALL' ? 'dhaka-central' : activeHubId }, ...orders]); // Default hub if ALL
    const updateOrder = (id: string, updates: any) => {
        setOrdersState(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    };
    const deleteOrder = (id: string) => setOrdersState(prev => prev.filter(o => o.id !== id));

    const addProduct = (product: any) => setProductsState([{ ...product, hubId: activeHubId === 'ALL' ? 'dhaka-central' : activeHubId }, ...products]);
    const updateProduct = (id: string, updates: any) => {
        setProductsState(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };
    const toggleStock = (id: string) => {
        setProductsState(prev => prev.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
    };
    const deleteProduct = (id: string) => setProductsState(prev => prev.filter(p => p.id !== id));

    const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
    const switchHub = (hubId: string | 'ALL') => setActiveHubId(hubId);

    return (
        <AdminContext.Provider value={{
            // Data exposed is now filtered!
            orders: filteredOrders,
            products: filteredProducts,
            allProducts: products, // Expose raw products for client usage ignoring admin hub filter
            allOrders: orders, // Expose raw orders if needed
            settings,

            currentUser,
            activeHubId,
            hubs: HUBS,
            availableHubs,
            switchHub,
            loginAs,

            setOrders, setProducts, updateSettings,
            addOrder, updateOrder, deleteOrder,
            addProduct, updateProduct, deleteProduct, toggleStock,
            isSidebarCollapsed, toggleSidebar,
            logout: () => window.location.href = '/'
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
