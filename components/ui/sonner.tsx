'use client';

import { toast, Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="system"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white/80 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl",
                    description: "group-[.toast]:text-gray-500",
                    actionButton:
                        "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
                    cancelButton:
                        "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
