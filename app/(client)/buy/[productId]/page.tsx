'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProduct } from '@/app/actions/product';

export default function SmartLinkPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;
            if (productId) {
                const data = await getProduct(productId);
                if (data) setProduct(data);
            }
            setLoading(false);
        };
        loadProduct();
    }, [params.productId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 text-center">
                    <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
                    <p className="text-gray-500 mt-2">The product you are looking for does not exist or has been removed.</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/'}>Go Home</Button>
                </Card>
            </div>
        );
    }

    const handleWhatsAppOrder = () => {
        const text = `Hi, I want to order *${product.name}* (Price: ৳${product.price}). Please confirm.`;
        window.open(`https://wa.me/8801804221161?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white shadow-xl border-t-4 border-t-orange-600">
                <div className="h-48 relative bg-gray-100 group">
                    {/* Glass Pieces Tag */}
                    {(product as any).pieces && (product as any).pieces > 0 && (
                        <div className="absolute top-3 right-3 z-20">
                            <span className="px-2.5 py-1 rounded-lg bg-white/70 backdrop-blur-md border border-white/50 text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-crab-red inline-block" />
                                {(product as any).pieces} pcs
                            </span>
                        </div>
                    )}
                    <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
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
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                        <ArrowRight className="w-4 h-4 mr-2" /> Add to Cart & Browsing
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
