'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Image from 'next/image';

// Mock Product Fetcher
const getProduct = (id: string) => {
    return {
        id,
        name: 'Live Mud Crab (XL)',
        price: 1250,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        description: 'Fresh giant mud crab from Sundarbans. Guaranteed live delivery.',
    };
};

export default function SmartLinkPage() {
    const params = useParams();
    const product = getProduct(params.productId as string);

    const handleWhatsAppOrder = () => {
        const text = `Hi, I want to order *${product.name}* (Price: ৳${product.price}). Please confirm.`;
        window.open(`https://wa.me/8801700000000?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white shadow-xl border-t-4 border-t-orange-600">
                <div className="h-48 relative bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold text-slate-900">{product.name}</CardTitle>
                        <Badge className="bg-orange-100 text-orange-700 font-bold text-lg">৳{product.price}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{product.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
                        ⚡ <strong>Instant Order:</strong> No login required. Changes apply via WhatsApp.
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                    <Button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 text-md">
                        <MessageCircle className="w-5 h-5 mr-2" /> Order on WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full">
                        Add to Cart & Browsing
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
