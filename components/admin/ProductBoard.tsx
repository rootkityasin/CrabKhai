'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Archive, ArrowRight, Share2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Product {
    id: string;
    name: string;
    price: number;
    stage: string;
    image: string;
    stock: boolean;
}

interface ProductBoardProps {
    products: Product[];
    onMove: (id: string, newStage: string) => void;
    config?: any;
}

const columns = [
    { title: 'Draft / Hidden', stage: 'Draft', color: 'bg-gray-100 text-gray-500' },
    { title: 'Coming Soon', stage: 'Coming Soon', color: 'bg-blue-100 text-blue-600' },
    { title: 'Live / Selling', stage: 'Selling', color: 'bg-green-100 text-green-600' },
    { title: 'Archived', stage: 'Archived', color: 'bg-slate-100 text-slate-400' },
];

function SortableItem({ product, formatStock, children }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: product.id,
        data: { type: 'Item', product }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            {children}
        </div>
    );
}

export function ProductBoard({ products, onMove, config }: ProductBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    );

    const formatStock = (pieces: number, unitWeight: number = 200) => {
        const unit = config?.measurementUnit || 'PCS';
        if (unit === 'VOLUME') {
            const totalVolume = pieces * unitWeight;
            return totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)} Ltr (${pieces})` : `${totalVolume} ml (${pieces})`;
        }
        if (unit === 'WEIGHT') {
            const weight = pieces * unitWeight;
            const display = weight >= 1000 ? `${(weight / 1000).toFixed(1)} kg` : `${weight} g`;
            return `${display} (${pieces})`;
        }
        return `Stock: ${pieces}`;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        setActiveProduct(products.find(p => p.id === active.id) || null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Optional: Could handle optimistic sorting here but simplest is just stage monitoring
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveProduct(null);

        if (!over) return;

        // Dropped on a column (droppable container)
        const overId = over.id as string;
        // Check if overId is a stage name 
        const isStage = columns.some(c => c.stage === overId);

        if (isStage && overId !== active.data.current?.product.stage) {
            onMove(active.id as string, overId);
        } else {
            // Dropped on another item? find its stage
            // This simple version assumes dropping primarily on the column container or empty area
            // If needed we can find the stage of the 'over' item
        }
    };

    // Helper to render card
    const renderCard = (product: any) => (
        <Card key={product.id} className="p-3 cursor-grab hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-sm border-gray-100 mb-2">
            <div className="flex gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{product.name}</h4>
                    <div className="text-xs text-slate-500 font-medium mt-1">৳{product.price} • {formatStock((product as any).pieces || 0, (product as any).weight || 200)}</div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-300">
                    <MoreVertical className="w-3 h-3" />
                </Button>

                {product.stage === 'Selling' && (
                    <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 text-blue-600 border-blue-100 bg-blue-50 cursor-pointer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${window.location.origin}/buy/${product.id}`);
                        alert('Link Copied!');
                    }}>
                        <Share2 className="w-3 h-3 mr-1" /> Share
                    </Button>
                )}
            </div>
        </Card>
    );

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-200px)] overflow-x-auto pb-4">
                {columns.map((col) => (
                    <SortableContext key={col.stage} id={col.stage} items={products.filter(p => p.stage === col.stage).map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {/* We use a Droppable Container manually if we want empty area drops, but SortableContext acts as one if we use it right. Actually, better to wrap in a Droppable Area */}
                        <DroppableColumn col={col} products={products.filter(p => p.stage === col.stage)} renderCard={renderCard} formatStock={formatStock} />
                    </SortableContext>
                ))}
            </div>
            <DragOverlay>
                {activeProduct ? renderCard(activeProduct) : null}
            </DragOverlay>
        </DndContext>
    );
}

// Inner Component for Column to useDroppable
import { useDroppable } from '@dnd-kit/core';

function DroppableColumn({ col, products, renderCard, formatStock }: any) {
    const { setNodeRef } = useDroppable({
        id: col.stage,
    });

    return (
        <div ref={setNodeRef} className="flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-100 min-w-[280px]">
            <div className={`p-3 border-b border-gray-100 font-bold flex items-center justify-between ${col.color.replace('bg-', 'text-')}`}>
                <span className="text-sm">{col.title}</span>
                <Badge variant="outline" className="bg-white border-none shadow-sm text-inherit">
                    {products.length}
                </Badge>
            </div>
            <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {products.map((product: any) => (
                    <SortableItem key={product.id} product={product} formatStock={formatStock}>
                        {renderCard(product)}
                    </SortableItem>
                ))}
                {products.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        Drop Here
                    </div>
                )}
            </div>
        </div>
    );
}

const getNextStage = (current: string) => {
    // Legacy support if needed
    if (current === 'Draft') return 'Coming Soon';
    if (current === 'Coming Soon') return 'Selling';
    if (current === 'Selling') return 'Archived';
    if (current === 'Archived') return 'Draft';
    return 'Draft';
};
