'use client';

import { Search, Plus, MoreVertical, Copy, Store, X, Trash2, Edit, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ProductBoard } from '@/components/admin/ProductBoard';
import { useAdmin } from '@/components/providers/AdminProvider';

export default function ProductsPage() {
    // Replace local state with Global Context
    const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useAdmin();

    const [view, setView] = useState<'table' | 'kanban'>('table');
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, sku: '' });

    const handleDelete = (id: string) => {
        if (confirm('Delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleStageMove = (id: string, newStage: string) => {
        updateProduct(id, { stage: newStage });
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const product = {
            id: Date.now().toString(),
            name: newProduct.name,
            sku: newProduct.sku || Math.floor(Math.random() * 1000000).toString(),
            variants: 1,
            price: newProduct.price,
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=100&fit=crop',
            stock: true,
            source: 'Self',
            stage: 'Draft'
        };
        addProduct(product);
        setIsAdding(false);
        setNewProduct({ name: '', price: 0, sku: '' });
    };

    // Derived state for stats? (Optional, if we want to show counts somewhere global)

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">All Products</h1>
                    <p className="text-sm text-slate-500">Manage your menu items and production pipeline.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                        <button
                            onClick={() => setView('table')}
                            className={cn("p-1.5 rounded-md transition-all", view === 'table' ? "bg-white shadow-sm text-slate-900" : "text-slate-400")}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('kanban')}
                            className={cn("p-1.5 rounded-md transition-all", view === 'kanban' ? "bg-white shadow-sm text-slate-900" : "text-slate-400")}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input type="search" placeholder="Search products..." className="pl-9 w-[200px] sm:w-[250px] bg-white" />
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="bg-orange-600 hover:bg-orange-700 text-white"><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
                </div>
            </div>

            {/* Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">New Product</h2>
                                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Product Name</label>
                                    <Input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Price (৳)</label>
                                        <Input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })} required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">SKU (Optional)</label>
                                        <Input value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">Save Product</Button>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {view === 'table' ? (
                <Card className="border-none shadow-none bg-transparent">
                    <Tabs defaultValue="all" className="w-full">
                        <div className="overflow-x-auto pb-2">
                            <TabsList className="bg-white p-1 border border-gray-100 h-auto inline-flex">
                                <TabsTrigger value="all" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">All Products</TabsTrigger>
                                <TabsTrigger value="process" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Ready to Process</TabsTrigger>
                                <TabsTrigger value="fry" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Ready to Fry</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="all" className="mt-4">
                            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 w-4"><input type="checkbox" /></th>
                                            <th className="p-4">Product</th>
                                            <th className="p-4">Stage</th>
                                            <th className="p-4">SKU</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Available Quantity</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50/50">
                                                <td className="p-4"><input type="checkbox" /></td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-800">{product.name}</div>
                                                            <div className="text-xs text-orange-600">{product.variants} variants</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className="text-slate-500 border-slate-200">
                                                        {product.stage}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-slate-500">{product.sku}</td>
                                                <td className="p-4 font-bold text-slate-800">৳{product.price}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={product.stock}
                                                            onCheckedChange={() => toggleStock(product.id)}
                                                        />
                                                        <span className={cn("text-xs font-medium", product.stock ? "text-green-600" : "text-red-500")}>
                                                            {product.stock ? "In Stock" : "Sold Out"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(`${window.location.origin}/buy/${product.id}`);
                                                                alert('Smart Link Copied!');
                                                            }}
                                                        >
                                                            <Copy className="w-3 h-3 mr-1" /> Copy Link
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>
            ) : (
                <ProductBoard products={products} onMove={handleStageMove} />
            )}
        </div>
    );
}
