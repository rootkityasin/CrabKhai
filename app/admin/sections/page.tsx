'use client';

import { useState, useEffect } from 'react';
import { getSections, createSection, updateSection, deleteSection, seedDefaultSections } from '@/app/actions/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical, Save, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function SectionsPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newSection, setNewSection] = useState({ title: '', slug: '' });

    const fetchSections = async () => {
        setLoading(true);
        const data = await getSections();
        setSections(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleCreate = async () => {
        if (!newSection.title || !newSection.slug) return;
        const res = await createSection({
            ...newSection,
            order: sections.length // Append to end
        });
        if (res.success) {
            toast.success("Section created");
            setIsAdding(false);
            setNewSection({ title: '', slug: '' });
            fetchSections();
        } else {
            toast.error("Failed to create");
        }
    };

    const handleUpdate = async (id: string, updates: any) => {
        // Optimistic
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        const res = await updateSection(id, updates);
        if (!res.success) {
            toast.error("Failed to update");
            fetchSections(); // Revert
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this section?")) return;
        setSections(prev => prev.filter(s => s.id !== id));
        const res = await deleteSection(id);
        if (res.success) {
            toast.success("Deleted");
        } else {
            toast.error("Failed to delete");
            fetchSections();
        }
    };

    const handleSeed = async () => {
        await seedDefaultSections();
        toast.success("Defaults seeded");
        fetchSections();
    };

    // Auto-generate slug
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setNewSection({ title, slug });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Home Page Sections</h1>
                    <p className="text-sm text-slate-500">Manage the active product rails on the home page.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSeed}><RefreshCw className="w-4 h-4 mr-2" /> Seed Defaults</Button>
                    <Button onClick={() => setIsAdding(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Section
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="p-4 border-orange-100 bg-orange-50/50">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-slate-500">Title</label>
                            <Input
                                value={newSection.title}
                                onChange={handleTitleChange}
                                placeholder="e.g. Flash Sales"
                                className="bg-white"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-slate-500">Slug</label>
                            <Input
                                value={newSection.slug}
                                onChange={e => setNewSection({ ...newSection, slug: e.target.value })}
                                placeholder="e.g. flash-sales"
                                className="bg-white"
                            />
                        </div>
                        <div className="flex gap-2 pb-0.5">
                            <Button size="sm" onClick={handleCreate}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        </div>
                    </div>
                </Card>
            )}

            <div className="space-y-4">
                {sections.map((section) => (
                    <Card key={section.id} className="p-4 flex items-center gap-4 group hover:shadow-md transition-all">
                        <div className="cursor-move text-slate-300 hover:text-slate-500">
                            <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                            <Input
                                value={section.title}
                                onChange={(e) => handleUpdate(section.id, { title: e.target.value })}
                                className="font-bold border-transparent hover:border-slate-200 focus:border-slate-200 px-0 h-auto py-1 text-lg mb-1 bg-transparent"
                            />
                            <div className="text-xs text-slate-400 flex gap-2">
                                <span>/{section.slug}</span>
                                <span>•</span>
                                <span>{section._count?.products || 0} Products</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-500">
                                    {section.isActive ? 'Active' : 'Hidden'}
                                </span>
                                <Switch
                                    checked={section.isActive}
                                    onCheckedChange={(c) => handleUpdate(section.id, { isActive: c })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-400">Order</label>
                                <Input
                                    type="number"
                                    className="w-16 h-8 text-center"
                                    value={section.order}
                                    onChange={(e) => handleUpdate(section.id, { order: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-slate-300 hover:text-red-500"
                                onClick={() => handleDelete(section.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {!loading && sections.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed">
                    No sections found. Click "Seed Defaults" to start.
                </div>
            )}
        </div>
    );
}
