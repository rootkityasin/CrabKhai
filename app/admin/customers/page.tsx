'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreVertical, User, Plus, X, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const initialCustomers = [
    { id: 1, name: 'Shiham Chowdhury', email: 'shiham@example.com', phone: '01856241009', orders: 12, spent: 15200 },
    { id: 2, name: 'Rakib Hasan', email: 'rakib@example.com', phone: '01711223344', orders: 5, spent: 4500 },
    { id: 3, name: 'Karim Ullah', email: 'karim@example.com', phone: '01998877665', orders: 2, spent: 1200 },
];

export default function CustomersPage() {
    const [customers, setCustomers] = useState(initialCustomers);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
    const [search, setSearch] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    const handleEdit = (customer: any) => {
        setNewCustomer({ name: customer.name, phone: customer.phone, email: customer.email });
        setEditingId(customer.id);
        setIsAdding(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this customer?')) {
            setCustomers(customers.filter(c => c.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCustomer.name || !newCustomer.phone) return;

        if (editingId) {
            // Update existing
            setCustomers(customers.map(c => c.id === editingId ? { ...c, ...newCustomer } : c));
        } else {
            // Add new
            const customer = {
                id: customers.length + 1,
                ...newCustomer,
                orders: 0,
                spent: 0
            };
            setCustomers([...customers, customer]);
        }

        setIsAdding(false);
        setNewCustomer({ name: '', phone: '', email: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">👥 Customers</h1>
                    <p className="text-sm text-slate-500">View and manage your customer base.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                    <Button onClick={() => { setIsAdding(true); setEditingId(null); setNewCustomer({ name: '', phone: '', email: '' }); }} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Customer
                    </Button>
                </div>
            </div>

            {/* Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
                                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <Input
                                        placeholder="Customer Name"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Phone</label>
                                    <Input
                                        placeholder="017..."
                                        value={newCustomer.phone}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Email (Optional)</label>
                                    <Input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                    {editingId ? 'Save Changes' : 'Save Customer'}
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            <Card className="border-gray-100 shadow-sm">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search by name or phone..."
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto custom-table-scrollbar">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4 w-4"><input type="checkbox" /></th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">History</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50/50">
                                    <td className="p-4"><input type="checkbox" /></td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{customer.name}</div>
                                                <div className="text-xs text-slate-400">ID: #{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        <div className="flex items-center gap-2 text-sm"><Phone className="w-3 h-3" /> {customer.phone}</div>
                                        {customer.email && <div className="flex items-center gap-2 text-xs text-slate-400 mt-1"><Mail className="w-3 h-3" /> {customer.email}</div>}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">৳{customer.spent.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500">{customer.orders} Orders</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(customer)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(customer.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No customers found matching "{search}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
