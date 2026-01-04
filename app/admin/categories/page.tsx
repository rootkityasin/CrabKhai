'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, X, Edit, Trash2 } from 'lucide-react';
import { getCategories, createCategory, deleteCategory } from '@/app/actions/category';
import { toast } from 'sonner';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');

    const fetchData = async () => {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName) return;

        const res = await createCategory(newItemName);
        if (res.success) {
            toast.success("Category created");
            setIsModalOpen(false);
            setNewItemName('');
            fetchData();
        } else {
            toast.error("Failed to create");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        const res = await deleteCategory(id);
        if (res.success) {
            toast.success("Deleted");
            fetchData();
        } else {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Categories</h1>
                    <p className="text-sm text-slate-500">Manage product categories (Real DB).</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold">Add Category</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-4 h-4" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input
                                placeholder="Category Name (e.g. Meal)"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                autoFocus
                            />
                            <Button type="submit" className="w-full bg-orange-600">Create</Button>
                        </form>
                    </Card>
                </div>
            )}

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Products</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-slate-800">{cat.name}</td>
                                <td className="p-4 text-slate-500">{cat._count?.products || 0} items</td>
                                <td className="p-4 text-right">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => handleDelete(cat.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {!loading && categories.length === 0 && (
                            <tr><td colSpan={3} className="p-8 text-center text-slate-400">No categories found.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
