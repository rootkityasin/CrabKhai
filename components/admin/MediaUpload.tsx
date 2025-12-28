'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FileVideo, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MediaUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    className?: string;
}

export function MediaUpload({
    value,
    onChange,
    onRemove,
    className
}: MediaUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Check if Cloudinary is configured
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            toast.error("Cloudinary not configured. Please check environment variables.");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        // Determine resource type based on file type
        const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                onChange(data.secure_url);
                toast.success("Media uploaded successfully!");
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
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'video/*': ['.mp4', '.webm', '.ogg']
        },
        maxFiles: 1,
        disabled: isUploading
    });

    const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || value?.includes('/video/');

    return (
        <div className={cn("w-full space-y-4", className)}>
            {value ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 group bg-slate-950">
                    {isVideo ? (
                        <video
                            src={value}
                            controls
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <img
                            src={value}
                            alt="Upload"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )}

                    <div className="absolute top-2 right-2 z-10">
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
                            <div className="relative">
                                <ImageIcon className={cn("w-8 h-8 text-slate-400 absolute -left-2 top-0", isDragActive && "text-orange-600")} />
                                <FileVideo className={cn("w-6 h-6 text-slate-300 absolute left-4 bottom-0", isDragActive && "text-orange-400")} />
                            </div>
                        )}
                    </div>
                    <div className="text-center space-y-1 mt-2">
                        <p className="text-sm font-medium text-slate-700">
                            {isDragActive ? "Drop media here" : "Click or drag image/video"}
                        </p>
                        <p className="text-xs text-slate-400">
                            Supports Images & Videos (Max 50MB)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
