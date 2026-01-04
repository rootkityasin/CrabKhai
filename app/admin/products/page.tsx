'use client';

import { Search, Plus, MoreVertical, Copy, Store, X, Trash2, Edit, LayoutGrid, List, Filter, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { ProductBoard } from '@/components/admin/ProductBoard';
import { useAdmin } from '@/components/providers/AdminProvider';
import { toast } from 'sonner';

import { MediaUpload } from '@/components/admin/MediaUpload';
import { Textarea } from '@/components/ui/textarea';

export default function ProductsPage() {
    // Replace local state with Global Context
    const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useAdmin();

    const [view, setView] = useState<'table' | 'kanban'>('table');
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        sku: '',
        image: '',
        images: [] as string[],
        nutrition: '',
        cookingInstructions: '',
        pointsReward: 0,
        weight: 0,
        pieces: 0,
        quantity: 0
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    // Filter States
    const [filterStock, setFilterStock] = useState<string>('all');
    const [filterStage, setFilterStage] = useState<string>('all');

    // Unique Stages for Filter
    const stages = Array.from(new Set(products.map(p => p.stage)));

    const filteredProducts = products.filter(p => {
        const matchesStock =
            filterStock === 'all' ? true :
                filterStock === 'instock' ? p.stock :
                    !p.stock;

        const matchesStage =
            filterStage === 'all' ? true :
                p.stage === filterStage;

        return matchesStock && matchesStage;
    });

    const handleDelete = (id: string) => {
        if (confirm('Delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleStageMove = (id: string, newStage: string) => {
        updateProduct(id, { stage: newStage });
    };

    const handleClone = (product: any) => {
        const clonedProduct = {
            ...product,
            id: Date.now().toString(),
            name: `${product.name} (Copy)`,
            sku: `${product.sku}-COPY`
        };
        addProduct(clonedProduct);
        toast.success("Product cloned successfully");
    };

    const handleEdit = (product: any) => {
        setNewProduct({
            name: product.name,
            price: product.price,
            sku: product.sku,
            image: product.image,
            images: product.images || [], // Load existing gallery images
            nutrition: product.nutrition || '',
            cookingInstructions: product.cookingInstructions || '',
            pointsReward: product.pointsReward || 0,
            weight: product.weight || 0,
            pieces: product.pieces || 0,
            quantity: product.quantity || 0
        });
        setEditingId(product.id);
        setIsAdding(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate Nutrition based on Weight
        const w = newProduct.weight || 0;
        const nutritionCalc = [
            `Energy (calories): ${(w * 1.25).toFixed(1)}`,
            `Fat: ${(w * 0.0104).toFixed(2)} g`,
            `Of which saturated fat: 0 g`,
            `Cholesterol: ${(w * 0.3125).toFixed(2)} mg`,
            `Carbohydrates: ${(w * 0.1979).toFixed(2)} g`,
            `Of which sugars: 0 g`,
            `Protein: ${(w * 0.0938).toFixed(2)} g`,
            `Sodium: ${(w * 3.4375).toFixed(2)} mg`
        ].join('\n');

        if (editingId) {
            // Update existing
            updateProduct(editingId, {
                name: newProduct.name,
                price: newProduct.price,
                sku: newProduct.sku,
                image: newProduct.image,
                images: newProduct.images || [],
                nutrition: nutritionCalc,
                cookingInstructions: newProduct.cookingInstructions,
                pointsReward: newProduct.pointsReward,
                weight: newProduct.weight,
                pieces: newProduct.pieces,
                quantity: newProduct.quantity
            });
            toast.success("Product updated successfully");
        } else {
            // Add new
            const product = {
                id: Date.now().toString(),
                name: newProduct.name,
                sku: newProduct.sku || Math.floor(Math.random() * 1000000).toString(),
                variants: 1,
                price: newProduct.price,
                image: newProduct.image || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=100&fit=crop',
                images: newProduct.images || [],
                stock: true,
                source: 'Self',
                stage: 'Draft',
                nutrition: nutritionCalc,
                cookingInstructions: newProduct.cookingInstructions,
                pointsReward: newProduct.pointsReward,
                weight: newProduct.weight,
                pieces: newProduct.pieces,
                quantity: newProduct.quantity
            };
            addProduct(product);
            toast.success("Product created successfully");
        }

        setIsAdding(false);
        setEditingId(null);
        setNewProduct({ name: '', price: 0, sku: '', image: '', images: [], nutrition: '', cookingInstructions: '', pointsReward: 0, weight: 0, pieces: 0, quantity: 0 });
    };

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">📦 All Products</h1>
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
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search products..." className="pl-9 w-[200px] lg:w-[300px] bg-white" />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={(filterStock !== 'all' || filterStage !== 'all') ? "bg-orange-50 border-orange-200 text-orange-700" : ""}>
                                    <Filter className="w-4 h-4 mr-2" /> Filter {(filterStock !== 'all' || filterStage !== 'all') && '(Active)'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Filter Products</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Refine by stock or stage.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label>Stock Status</Label>
                                            <Select value={filterStock} onValueChange={setFilterStock}>
                                                <SelectTrigger className="col-span-2 h-8">
                                                    <SelectValue placeholder="All" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="instock">In Stock</SelectItem>
                                                    <SelectItem value="outstock">Out of Stock</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label>Stage</Label>
                                            <Select value={filterStage} onValueChange={setFilterStage}>
                                                <SelectTrigger className="col-span-2 h-8">
                                                    <SelectValue placeholder="All" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Stages</SelectItem>
                                                    {stages.map(s => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => {
                            setEditingId(null);
                            setNewProduct({ name: '', price: 0, sku: '', image: '', images: [], nutrition: '', cookingInstructions: '', pointsReward: 0, weight: 0, pieces: 0, quantity: 0 });
                            setIsAdding(true);
                        }}>
                            <Plus className="w-4 h-4 mr-2" /> Add Product
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {
                isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Product' : 'New Product'}</h2>
                                    <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                                </div>
                                <form onSubmit={handleSave} className="space-y-4">
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
                                            <label className="text-sm font-medium">Available Quantity</label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={newProduct.quantity}
                                                onChange={e => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Loyalty Points</label>
                                            <Input type="number" placeholder="0" value={newProduct.pointsReward} onChange={e => setNewProduct({ ...newProduct, pointsReward: parseInt(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">SKU (Optional)</label>
                                            <Input value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Main Product Image</label>
                                            <MediaUpload
                                                value={newProduct.image}
                                                onChange={(url: string) => setNewProduct({ ...newProduct, image: url })}
                                                onRemove={() => setNewProduct({ ...newProduct, image: '' })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Gallery Images (3-4 Recommended)</label>
                                            <MediaUpload
                                                multiple
                                                values={newProduct.images}
                                                onValuesChange={(urls) => setNewProduct({ ...newProduct, images: urls })}
                                                onRemove={(url) => setNewProduct({ ...newProduct, images: newProduct.images.filter(u => u !== url) })}
                                                onChange={() => { }} // Dummy prop for type safety (optional)
                                            />
                                        </div>
                                    </div>

                                    <Button type="button" onClick={() => {
                                        // Quick auto-calc manual trigger if needed, but we do it on save primarily or useEffect
                                        // Let's just rely on Save to generating it, or generate live for preview?
                                        // User logic: "just take input how much gram it is... multiply it".
                                        // We will save valid string to 'nutrition' field on submit.
                                    }} className="hidden">Calc</Button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Weight (grams)</label>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 500"
                                                value={newProduct.weight}
                                                onChange={(e) => {
                                                    const w = parseInt(e.target.value) || 0;
                                                    setNewProduct({ ...newProduct, weight: w });
                                                }}
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Nutrition info will be auto-calculated.</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Pieces (pcs)</label>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 6"
                                                value={newProduct.pieces}
                                                onChange={(e) => setNewProduct({ ...newProduct, pieces: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cooking Instructions (Optional)</label>
                                        <Textarea
                                            placeholder="e.g. Fry for 5 mins at 180°C..."
                                            value={newProduct.cookingInstructions}
                                            onChange={(e) => setNewProduct({ ...newProduct, cookingInstructions: e.target.value })}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                        {editingId ? 'Update Product' : 'Save Product'}
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </div >
                )
            }

            {
                view === 'table' ? (
                    <Card className="border-none shadow-none bg-transparent">
                        <Tabs defaultValue="all" className="w-full">
                            <div className="overflow-x-auto pb-2">
                                <TabsList className="bg-white p-1 border border-gray-100 h-auto inline-flex">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">All Products</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="all" className="mt-4">
                                <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-x-auto custom-table-scrollbar">
                                    <table className="w-full text-sm text-left min-w-[800px]">
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
                                            {filteredProducts.map((product) => (
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
                                                        <span className="font-medium text-slate-700">{product.quantity || 0}</span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => window.open(`/buy/${product.id}`, '_blank')}>
                                                                    <Eye className="w-4 h-4 mr-2" /> View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEdit(product)}>
                                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleClone(product)}>
                                                                    <Copy className="w-4 h-4 mr-2" /> Clone product
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product.id)}>
                                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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
                )
            }
        </div >
    );
}
