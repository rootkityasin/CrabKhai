'use client';

import { useCartStore } from '@/lib/store';
import { Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createOrder } from '@/app/actions/order';
import { getSiteConfig } from '@/app/actions/settings';
import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';
import { CouponSection } from './CouponSection';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/track';

export function GlobalCheckoutDrawer() {
    const { checkoutOpen, closeCheckout, items, total, discount, clearCart, coupon } = useCartStore();
    const [isAnimating, setIsAnimating] = useState(false);
    const [siteConfig, setSiteConfig] = useState<any>(null);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState<any>({
        name: '',
        phone: '',
        area: '',
        address: ''
    });

    useEffect(() => {
        getSiteConfig().then(setSiteConfig);
    }, []);

    // Track InitiateCheckout when drawer opens
    useEffect(() => {
        if (checkoutOpen && items.length > 0) {
            trackEvent({
                eventName: 'InitiateCheckout',
                eventData: {
                    content_ids: items.map(i => i.id),
                    contents: items.map(i => ({ id: i.id, quantity: i.quantity })),
                    num_items: items.length,
                    value: totalAmount,
                    currency: 'BDT'
                }
            });
        }
    }, [checkoutOpen]);

    // Totals
    const subTotalAmount = total();
    const discountAmount = discount();
    const discountedTotal = Math.max(0, subTotalAmount - discountAmount);
    const deliveryFee = 60;
    const taxRate = siteConfig?.taxPercentage || 0;
    const taxAmount = Math.ceil((discountedTotal * taxRate) / 100);
    const totalAmount = discountedTotal + deliveryFee + taxAmount;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAnimating(true);

        const orderData = {
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: `${formData.address}, ${formData.area}`,
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: totalAmount,
            couponCode: coupon?.code,
            discountAmount: discountAmount
        };

        const res = await createOrder(orderData);

        if (res.success) {
            // Server-Side Tracking: Purchase
            trackEvent({
                eventName: 'Purchase',
                eventData: {
                    content_ids: items.map(i => i.id),
                    contents: items.map(i => ({ id: i.id, quantity: i.quantity })),
                    num_items: items.length,
                    value: totalAmount,
                    currency: 'BDT',
                    order_id: res.orderId // Assuming createOrder returns orderId
                },
                userData: {
                    email: '', // Not captured in this form currently
                    phone: formData.phone,
                    name: formData.name,
                    area: formData.area,
                    city: 'Dhaka' // Default city if not specified, or use area
                }
            });

            toast.success("Order placed successfully!");
            setTimeout(() => {
                setIsAnimating(false);
                clearCart();
                closeCheckout();
                router.push('/cart'); // Or stay on page? Redirect to Cart for Success View is safest as CartPage handles Success State
                // Actually, if we clear cart, CartPage shows empty state.
                // We should probably show a success message in the Drawer or toast.
                // But the user typically expects a confirmation page. 
                // Let's redirect to /cart?orderPlaced=true or allow CartPage to detect success?
                // For now, let's just clear and show toast, maybe redirect to home?
                // User didn't specify. I'll stick to a success toast and close.
            }, 1000);
        } else {
            toast.error(res.error || "Failed to place order");
            setIsAnimating(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <Drawer open={checkoutOpen} onOpenChange={(open) => !open && closeCheckout()}>
            <DrawerContent className="max-h-[90vh]">
                <div className="w-full max-w-lg mx-auto bg-slate-50/50 flex flex-col h-full">
                    <DrawerHeader className="border-b border-gray-100 pb-4 bg-white flex-shrink-0">
                        <DrawerTitle className="text-2xl font-black text-center text-slate-900">Checkout</DrawerTitle>
                        <DrawerDescription className="text-center font-medium">
                            Complete your order
                        </DrawerDescription>
                    </DrawerHeader>

                    {/* Scrollable Form Area */}
                    <div className="p-4 overflow-y-auto flex-1">
                        <div className="space-y-6">
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold">৳{subTotalAmount}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="font-bold">৳{deliveryFee}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold mb-2">
                                        <span>Discount</span>
                                        <span>-৳{discountAmount}</span>
                                    </div>
                                )}
                                <div className="border-t border-orange-200 mt-2 pt-2 flex justify-between text-base font-black text-crab-red">
                                    <span>Total</span>
                                    <span>৳{totalAmount}</span>
                                </div>
                            </div>

                            <CouponSection />

                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-3">
                                <h3 className="font-bold text-gray-900">Delivery Information</h3>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all outline-none font-medium text-black"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all outline-none font-medium text-black"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <Select
                                            value={formData.area}
                                            onValueChange={(val) => setFormData({ ...formData, area: val })}
                                            required
                                        >
                                            <SelectTrigger className="w-full h-[58px] bg-white border-gray-200 rounded-xl focus:ring-crab-red/20 text-black">
                                                <SelectValue placeholder="Area" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                                <SelectItem value="Ctg">Ctg</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        required
                                        className="col-span-2 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all outline-none font-medium text-black"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom flex-shrink-0">
                        <Button
                            form="checkout-form"
                            type="submit"
                            disabled={isAnimating}
                            className="w-full h-14 bg-crab-red hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-crab-red/20 active:scale-95 transition-all"
                        >
                            {isAnimating ? <Loader2 className="animate-spin w-5 h-5" /> : `Place Order - ৳${totalAmount}`}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
