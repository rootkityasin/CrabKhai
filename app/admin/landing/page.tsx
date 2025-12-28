'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ExternalLink, Trash2, CheckCircle, Plus, X, Globe, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const initialPages = [
    { id: 1, title: 'Winter Crab Fest Special', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200', default: true },
    { id: 2, title: 'Corporate Platter Offer', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=200', default: false },
];

import { MediaUpload } from '@/components/admin/MediaUpload';

export default function LandingPages() {
    const [pages, setPages] = useState(initialPages);
    const [isAdding, setIsAdding] = useState(false);
    const [newPage, setNewPage] = useState({ title: '', image: '' });

    const handleDelete = (id: number) => {
        if (confirm('Delete this landing page?')) {
            setPages(pages.filter(p => p.id !== id));
        }
    };

    const handleSetDefault = (id: number) => {
        setPages(pages.map(p => ({
            ...p,
            default: p.id === id
        })));
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPage.title) return;

        const page = {
            id: Date.now(),
            title: newPage.title,
            image: newPage.image || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=200',
            default: false
        };
        setPages([...pages, page]);
        setIsAdding(false);
        setNewPage({ title: '', image: '' });
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">📢 Landing Pages</h1>
                    <p className="text-sm text-slate-500">Manage your promotional landing pages.</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Create New
                </Button>
            </div>

            {/* Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">New Landing Page</h2>
                                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Page Title</label>
                                    <Input
                                        placeholder="e.g. Boishakhi Special"
                                        value={newPage.title}
                                        onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Cover Media (Image or Video)</label>
                                    <MediaUpload
                                        value={newPage.image}
                                        onChange={(url) => setNewPage({ ...newPage, image: url })}
                                        onRemove={() => setNewPage({ ...newPage, image: '' })}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">Create Page</Button>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            <div className="space-y-4">
                {pages.map((page) => (
                    <Card key={page.id} className={`p-4 flex items-center gap-4 border-gray-100 shadow-sm hover:shadow-md transition-shadow ${page.default ? 'border-l-4 border-l-green-500' : ''}`}>
                        <div className="h-20 w-32 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                            <img src={page.image} alt={page.title} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800 text-lg">{page.title}</h3>
                            {page.default ? (
                                <span className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" /> Default Homepage</span>
                            ) : (
                                <span className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Globe className="w-3 h-3" /> /landing/{page.id}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <ExternalLink className="w-4 h-4 mr-2" /> Visit
                            </Button>
                            {!page.default && (
                                <Button size="sm" variant="outline" onClick={() => handleSetDefault(page.id)}>
                                    Make Default
                                </Button>
                            )}
                            <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(page.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
                {pages.length === 0 && (
                    <div className="py-12 text-center text-slate-400 border-2 border-dashed border-gray-200 rounded-lg">
                        No landing pages found.
                    </div>
                )}
            </div>
        </div>
    );
}
