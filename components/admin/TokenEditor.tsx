'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateAdminSetupToken } from '@/app/actions/admin-helper';
import { toast } from 'sonner';
import { Edit2, Save, X, Eye, EyeOff } from 'lucide-react';

export function TokenEditor({ initialToken }: { initialToken: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [token, setToken] = useState(initialToken);
    const [showToken, setShowToken] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const res = await updateAdminSetupToken(token);
        if (res.success) {
            toast.success("Security token updated successfully");
            setIsEditing(false);
        } else {
            toast.error("Failed to update token");
        }
        setLoading(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border shadow-sm">
                <Input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="h-9 w-48 border-0 focus-visible:ring-0 px-2 font-mono text-sm"
                    autoFocus
                />
                <Button size="sm" onClick={handleSave} disabled={loading} className="h-8 px-3 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 px-2 text-slate-500">
                    <X className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className={`font-mono font-bold bg-white px-3 py-1.5 rounded border border-purple-200 text-slate-700 min-w-[200px] text-center relative group select-all`}>
                {showToken ? token : '•'.repeat(token.length)}

                <button
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
            </div>

            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2 text-purple-700 border-purple-200 hover:bg-purple-100">
                <Edit2 className="w-3.5 h-3.5" /> Change
            </Button>
        </div>
    );
}
