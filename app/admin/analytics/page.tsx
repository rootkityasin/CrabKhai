'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, TrendingUp, Users, ShoppingCart, Activity, DollarSign, XCircle } from 'lucide-react';

// Data for Line/Bar Charts
const data = [
    { name: 'Mon', sales: 4000, visits: 2400 },
    { name: 'Tue', sales: 3000, visits: 1398 },
    { name: 'Wed', sales: 2000, visits: 9800 },
    { name: 'Thu', sales: 2780, visits: 3908 },
    { name: 'Fri', sales: 1890, visits: 4800 },
    { name: 'Sat', sales: 2390, visits: 3800 },
    { name: 'Sun', sales: 3490, visits: 4300 },
];

// Data for Pie Chart
const categoryData = [
    { name: 'Live Crab', value: 400 },
    { name: 'Ready to Eat', value: 300 },
    { name: 'Frozen', value: 300 },
    { name: 'Platters', value: 200 },
];
const COLORS = ['#ea580c', '#f97316', '#fbbf24', '#94a3b8'];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Analytics Reports</h1>
                    <p className="text-sm text-slate-500">Full business overview and performance metrics.</p>
                </div>
                <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-md border border-gray-200">
                    Last 7 Days
                </div>
            </div>

            {/* Primary Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="Total Revenue" value="৳ 152,400" icon={TrendingUp} sub="This Month" color="text-green-600" />
                <MetricCard title="New Customers" value="342" icon={Users} sub="+12% vs last month" color="text-blue-600" />
                <MetricCard title="Avg. Order Value" value="৳ 305" icon={ShoppingCart} sub="-2% vs last month" color="text-orange-600" />
                <MetricCard title="Cancellations" value="1.2%" icon={XCircle} sub="Low rate" color="text-red-500" />
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="Net Profit" value="৳ 45,200" icon={DollarSign} sub="Approx. (30%)" color="text-emerald-600" bg="bg-emerald-50" />
                <MetricCard title="Refunds" value="৳ 1,200" icon={Activity} sub="3 Orders" color="text-slate-600" bg="bg-slate-50" />
                <MetricCard title="Kitchen Time" value="24m" icon={Activity} sub="Avg. Prep" color="text-purple-600" bg="bg-purple-50" />
                <MetricCard title="Mobile Orders" value="68%" icon={Activity} sub="vs 32% Web" color="text-blue-600" bg="bg-blue-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart (Area) */}
                <Card className="border-gray-100 shadow-sm col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="sales" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart (Category Sales) */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Bar Chart (Traffic) */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Traffic vs Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                    <Bar dataKey="visits" name="Visits" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="sales" name="Sales" fill="#ea580c" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, sub, color, bg }: any) {
    return (
        <Card className={`border-none shadow-sm ${bg || 'bg-white border border-gray-100'}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-500">{title}</span>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-xs text-slate-400 mt-1">{sub}</div>
            </CardContent>
        </Card>
    )
}
