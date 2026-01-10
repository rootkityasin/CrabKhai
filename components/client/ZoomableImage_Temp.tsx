import { useState } from 'react';
import { motion } from 'framer-motion';

// Helper for Zoom - Placing this in the same file or separate
export function ZoomableImage({ src }: { src: string }) {
    const [scale, setScale] = useState(1);

    // Simple double tap to zoom
    const handleDoubleTap = () => {
        setScale(prev => prev === 1 ? 2.5 : 1);
    };

    return (
        <div className="w-full h-full overflow-auto flex items-center justify-center" onDoubleClick={handleDoubleTap}>
            <motion.img
                src={src}
                className="max-h-full max-w-full object-contain transition-transform duration-300"
                style={{ scale }}
                drag
                dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
            // Note: True multi-touch pinch usually needs more complex logic or 'touch-action: none' + pointer events. 
            // For a robust "Pinch to Zoom" without libs, standard browser zoom in a fullscreen div is best, 
            // but Viewport meta often blocks it. 
            // We'll stick to a simple pan/zoom simulation or just let the browser handle it if possible.
            />
        </div>
    );
}
