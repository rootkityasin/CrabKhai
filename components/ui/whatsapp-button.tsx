'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
    phone: string;
    message?: string;
    label?: string;
}

export function WhatsAppButton({ phone, message = "Hello!", label = "Chat" }: WhatsAppButtonProps) {
    const handleClick = () => {
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Button
            onClick={handleClick}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold"
        >
            <MessageCircle className="w-4 h-4 mr-2" />
            {label}
        </Button>
    );
}
