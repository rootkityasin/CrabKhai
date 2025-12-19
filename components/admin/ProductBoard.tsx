'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Archive, ArrowRight, Share2, CheckCircle } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    stage: string; // 'Draft', 'Process', 'Fry', 'Selling'
    image: string;
    stock: boolean;
}

interface ProductBoardProps {
    products: Product[];
    onMove: (id: string, newStage: string) => void;
}

export function ProductBoard({ products, onMove }: ProductBoardProps) {
    const columns = [
        { title: 'Draft / Incoming', stage: 'Draft', color: 'bg-gray-100 text-gray-500' },
        { title: 'Ready to Process', stage: 'Process', color: 'bg-blue-100 text-blue-600' },
        { title: 'Ready to Fry', stage: 'Fry', color: 'bg-orange-100 text-orange-600' },
        { title: 'Live on Store', stage: 'Selling', color: 'bg-green-100 text-green-600' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-200px)] overflow-x-auto pb-4">
            {columns.map((col) => (
                <div key={col.stage} className="flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-100 min-w-[280px]">
                    <div className={`p-3 border-b border-gray-100 font-bold flex items-center justify-between ${col.color.replace('bg-', 'text-')}`}>
                        <span className="text-sm">{col.title}</span>
                        <Badge variant="outline" className="bg-white border-none shadow-sm text-inherit">
                            {products.filter(p => p.stage === col.stage).length}
                        </Badge>
                    </div>

                    <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                        {products
                            .filter(p => p.stage === col.stage)
                            .map(product => (
                                <Card key={product.id} className="p-3 cursor-grab hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-sm border-gray-100">
                                    <div className="flex gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{product.name}</h4>
                                            <div className="text-xs text-slate-500 font-medium mt-1">৳{product.price}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-300 hover:text-slate-600">
                                            <MoreVertical className="w-3 h-3" />
                                        </Button>

                                        <div className="flex gap-1">
                                            {col.stage !== 'Selling' && (
                                                <Button size="sm" variant="secondary" className="h-6 text-[10px] px-2" onClick={() => onMove(product.id, getNextStage(col.stage))}>
                                                    Next <ArrowRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            )}
                                            {col.stage === 'Selling' && (
                                                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 text-blue-600 border-blue-100 bg-blue-50" onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/buy/${product.id}`);
                                                    alert('Link Copied!');
                                                }}>
                                                    <Share2 className="w-3 h-3 mr-1" /> Share
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}

                        {products.filter(p => p.stage === col.stage).length === 0 && (
                            <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                Empty
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function getNextStage(current: string) {
    if (current === 'Draft') return 'Process';
    if (current === 'Process') return 'Fry';
    if (current === 'Fry') return 'Selling';
    return 'Selling';
}
