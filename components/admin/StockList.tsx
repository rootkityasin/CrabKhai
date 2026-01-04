'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adjustStock, updateStock } from "@/app/actions/inventory";
import { getSiteConfig } from "@/app/actions/settings";
import { toast } from "sonner";
import { useEffect } from "react";
import { Search, Save, Plus, Minus, RefreshCw } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function StockList({ products }: { products: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    // Adjustment State
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
    const [amount, setAmount] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [siteConfig, setSiteConfig] = useState<any>(null);

    useEffect(() => {
        getSiteConfig().then(setSiteConfig);
    }, []);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAdjustModal = (product: any, type: 'add' | 'remove') => {
        setSelectedProduct(product);
        setAdjustType(type);
        setAmount("");
        setIsDialogOpen(true);
    };

    const handleAdjustment = async () => {
        if (!selectedProduct || !amount) return;
        const val = parseInt(amount);
        if (isNaN(val) || val <= 0) {
            toast.error("Invalid amount");
            return;
        }

        const delta = adjustType === 'add' ? val : -val;

        // Optimistic check (though server assumes truth)
        if (adjustType === 'remove' && selectedProduct.pieces < val) {
            toast.error("Cannot remove more than current stock");
            return;
        }

        setLoading(selectedProduct.id);
        const res = await adjustStock(selectedProduct.id, delta);
        if (res.success) {
            toast.success(`Stock ${adjustType === 'add' ? 'added' : 'removed'} successfully`);
            setIsDialogOpen(false);
        } else {
            toast.error("Failed to adjust stock");
        }
        setLoading(null);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white"
                />
            </div>

            <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-slate-500 font-medium border-b">
                        <tr>
                            <th className="p-3">Product</th>
                            <th className="p-3 text-center">Current Stock</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map((p) => {
                            const isLowStock = p.pieces < 10;
                            return (
                                <tr key={p.id} className="hover:bg-gray-50/50">
                                    <td className="p-3 font-medium text-slate-800">
                                        <div className="flex items-center gap-3">
                                            {p.image ? (
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                                                    <span className="text-[10px] text-slate-400">Img</span>
                                                </div>
                                            )}
                                            <div>
                                                {p.name}
                                                <div className="text-xs text-slate-400">{p.category.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        {p.type === 'COMBO' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {(() => {
                                                    // Calculate Virtual Stock
                                                    if (!p.comboItems || p.comboItems.length === 0) return '0 Sets';
                                                    const limits = p.comboItems.map((item: any) =>
                                                        item.child ? Math.floor(item.child.pieces / item.quantity) : 0
                                                    );
                                                    return `${Math.min(...limits)} Sets`;
                                                })()}
                                            </span>
                                        ) : (
                                            (() => {
                                                const unit = siteConfig?.measurementUnit || 'PCS';

                                                if (unit === 'PCS') {
                                                    return (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.pieces < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {p.pieces} Pcs
                                                        </span>
                                                    );
                                                }

                                                const unitValue = p.weight || 200;

                                                if (unit === 'VOLUME') {
                                                    const totalVolume = p.pieces * unitValue;
                                                    const display = totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)} Ltr` : `${totalVolume} ml`;
                                                    return (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.pieces < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {display}
                                                            <span className="ml-1 opacity-75">({p.pieces})</span>
                                                        </span>
                                                    );
                                                }

                                                // Default to WEIGHT
                                                const weightInGrams = p.pieces * unitValue;
                                                const isLowStock = p.pieces < 10;
                                                return (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {weightInGrams >= 1000
                                                            ? `${(weightInGrams / 1000).toFixed(1)} kg`
                                                            : `${weightInGrams} g`
                                                        }
                                                        <span className="ml-1 opacity-75">({p.pieces})</span>
                                                    </span>
                                                );
                                            })()
                                        )}
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-green-200 hover:bg-green-50 text-green-700"
                                                onClick={() => openAdjustModal(p, 'add')}
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> Add
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-red-200 hover:bg-red-50 text-red-700"
                                                onClick={() => openAdjustModal(p, 'remove')}
                                            >
                                                <Minus className="w-4 h-4 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={3} className="p-8 text-center text-slate-400">No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Adjustment Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{adjustType === 'add' ? 'Add Stock' : 'Remove Stock'}</DialogTitle>
                        <DialogDescription>
                            {selectedProduct?.name} - Current: {selectedProduct?.pieces}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-xs font-bold text-slate-500 mb-2 block">
                            Quantity to {adjustType === 'add' ? 'add' : 'remove'}
                        </label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button
                            className={adjustType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                            onClick={handleAdjustment}
                        >
                            {adjustType === 'add' ? 'Add Stock' : 'Remove Stock'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
