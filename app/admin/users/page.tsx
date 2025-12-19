'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Shield, MoreVertical, Trash2, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock Data
const initialUsers = [
    { id: 1, name: 'Admin User', role: 'Owner', email: 'admin@crabkhai.com', status: 'Active' },
    { id: 2, name: 'Kitchen Staff 1', role: 'Chef', email: 'chef1@crabkhai.com', status: 'Active' },
];

export default function UsersPage() {
    const [users, setUsers] = useState(initialUsers);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff' });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        const user = {
            id: users.length + 1,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: 'Active'
        };

        setUsers([...users, user]);
        setIsAdding(false);
        setNewUser({ name: '', email: '', role: 'Staff' });
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Users & Permissions</h1>
                    <p className="text-sm text-slate-500">Manage staff access and roles.</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>

            {/* Add User Modal Overlay */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
                                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <Input
                                        placeholder="e.g. Rahim Chef"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="e.g. chef@crabkhai.com"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Role</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="Admin">Admin (Owner)</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Chef">Chef (Kitchen)</option>
                                        <option value="Rider">Rider (Delivery)</option>
                                    </select>
                                </div>
                                <div className="pt-2 flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Create Account</Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            <Card className="border-gray-100 shadow-sm">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input type="search" placeholder="Search team..." className="pl-9 bg-gray-50 border-gray-200" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{user.name}</div>
                                            <div className="text-xs text-slate-400">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1 font-medium text-slate-700">
                                            <Shield className="w-3 h-3 text-slate-400" /> {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(user.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No users found. Add one to get started.
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
