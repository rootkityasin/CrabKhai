'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, Layers, Trash2, Edit, X, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const initialCategories = [
    { id: 1, name: 'Live Crab', image: '🦀', sortOrder: 1, products: 12, status: 'Active' },
    { id: 2, name: 'Frozen Crab', image: '🧊', sortOrder: 2, products: 8, status: 'Active' },
    { id: 3, name: 'Crab Meat', image: '🥩', sortOrder: 3, products: 5, status: 'Active' },
    { id: 4, name: 'Ready to Eat', image: '🍛', sortOrder: 4, products: 15, status: 'Active' },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({ name: '', image: '', sortOrder: 1, status: 'Active' });

    // Add or Update
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        if (editingId) {
            // Update existing
            setCategories(categories.map(cat =>
                cat.id === editingId ? { ...cat, ...formData, products: cat.products } : cat
            ));
        } else {
            // Create new
            const newId = Math.max(...categories.map(c => c.id), 0) + 1;
            setCategories([...categories, { id: newId, products: 0, ...formData }]);
        }
        resetForm();
    };

    const handleEdit = (cat: any) => {
        setEditingId(cat.id);
        setFormData({ name: cat.name, image: cat.image, sortOrder: cat.sortOrder, status: cat.status });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({ name: '', image: '', sortOrder: categories.length + 1, status: 'Active' });
        setEditingId(null);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Categories</h1>
                    <p className="text-sm text-slate-500">Organize your products into categories.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingId ? 'Edit Category' : 'New Category'}
                                </h2>
                                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Category Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Mud Crab"
                                            className="mt-1"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Icon</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                placeholder="🦀"
                                                className="text-center text-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Sort Order</label>
                                        <Input
                                            type="number"
                                            value={formData.sortOrder}
                                            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Hidden">Hidden</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">
                                        {editingId ? 'Save Changes' : 'Create Category'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            <Card className="border-gray-100 shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input type="search" placeholder="Search categories..." className="pl-9 bg-gray-50 border-gray-200" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4 w-4"><input type="checkbox" /></th>
                                <th className="p-4">Sort</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Products</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.sort((a, b) => a.sortOrder - b.sortOrder).map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50/50 group">
                                    <td className="p-4"><input type="checkbox" /></td>
                                    <td className="p-4 text-slate-400 font-mono text-xs">#{cat.sortOrder}</td>
                                    <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-200 group-hover:scale-110 transition-transform">
                                            {cat.image}
                                        </div>
                                        <div>
                                            <div className="group-hover:text-orange-600 transition-colors">{cat.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">{cat.products} items</td>
                                    <td className="p-4">
                                        <Badge variant="outline" className={cat.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500"}>
                                            {cat.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(cat)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(cat.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        No categories found.
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
