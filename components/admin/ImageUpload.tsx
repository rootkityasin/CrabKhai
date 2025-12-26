'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    recommendedSize?: string;
    className?: string;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    recommendedSize = "800x600",
    className
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Check if Cloudinary is configured
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            toast.error("Cloudinary not configured. Please check environment variables.");
            // For demo/dev purposes, we might just mock it if real upload fails
            // But let's try to be helpful
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                onChange(data.secure_url);
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Upload failed: " + (data.error?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Something went wrong during upload.");
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        disabled: isUploading
    });

    return (
        <div className={cn("w-full space-y-4", className)}>
            {value ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 group">
                    <img
                        src={value}
                        alt="Upload"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            onClick={(e) => { e.preventDefault(); onRemove(); }}
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 rounded-full shadow-sm"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer hover:bg-slate-50/50",
                        isDragActive ? "border-orange-500 bg-orange-50/50" : "border-slate-200",
                        isUploading && "opacity-50 pointer-events-none"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className={cn("p-4 rounded-full bg-slate-50 transition-colors", isDragActive && "bg-orange-100")}>
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                        ) : (
                            <UploadCloud className={cn("w-8 h-8 text-slate-400", isDragActive && "text-orange-600")} />
                        )}
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-slate-700">
                            {isDragActive ? "Drop the image here" : "Click or drag image to upload"}
                        </p>
                        <p className="text-xs text-slate-400">
                            Recommended size: {recommendedSize}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
