"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useBudgetStore } from "@/store/useBudgetStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart3, AlertTriangle, Lightbulb, Building2, ListTodo } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Tracker() {
  const store = useBudgetStore();
  const [actuals, setActuals] = useState<Record<string, number>>({
    decor: 0, fnb: 0, logistics: 0, artists: 0, sundries: 0
  });
  const [vendors, setVendors] = useState<Record<string, string>>({
    decor: "", fnb: "", logistics: "", artists: "", sundries: ""
  });
  const [taskVelocity, setTaskVelocity] = useState<number>(0);

  useEffect(() => {
    // Sync Vendor DB
    const savedVendors = localStorage.getItem("persistentVendorDB");
    if (savedVendors) {
      try {
        const vList = JSON.parse(savedVendors);
        const newActuals: Record<string, number> = { decor: 0, fnb: 0, logistics: 0, artists: 0, sundries: 0 };
        const newVendorsMap: Record<string, string> = { decor: "", fnb: "", logistics: "", artists: "", sundries: "" };
        vList.forEach((v: any) => {
          if (newActuals[v.category] !== undefined) {
            newActuals[v.category] += Number(v.quote || 0);
            newVendorsMap[v.category] = newVendorsMap[v.category] ? newVendorsMap[v.category] + ", " + v.name : v.name;
          }
        });
        setActuals(newActuals);
        setVendors(newVendorsMap);
      } catch (e) {}
    }

    // Sync Tasks DB
    const savedTasks = localStorage.getItem("persistentTasksDB");
    if (savedTasks) {
      try {
        const tList = JSON.parse(savedTasks);
        const doneCount = tList.filter((t: any) => t.done).length;
        setTaskVelocity(Math.round((doneCount / tList.length) * 100));
      } catch (e) {}
    }
  }, []);

  const categories = [
    { id: "decor", name: "Décor & Production" },
    { id: "fnb", name: "Food & Beverage" },
    { id: "logistics", name: "Ground Logistics" },
    { id: "artists", name: "Artists & Entertainment" },
    { id: "sundries", name: "Sundries & Miscellaneous" }
  ];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const totalEstimatedLow = Object.values(store.costRanges).reduce((acc, range) => acc + range.low, 0);
  const totalEstimatedHigh = Object.values(store.costRanges).reduce((acc, range) => acc + range.high, 0);
  const totalActual = Object.values(actuals).reduce((acc, val) => acc + (val || 0), 0);
  const totalVariance = totalEstimatedHigh - totalActual;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Post-Booking Tracker</h1>
          <p className="text-muted-foreground">Track your negotiated actuals against the AI-generated estimates.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Budget Variance Table</CardTitle>
                <CardDescription>Enter the final booked contract value for each category</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Vendor Management</TableHead>
                      <TableHead>Estimated AI Range</TableHead>
                      <TableHead>Actual Booked (₹)</TableHead>
                      <TableHead className="text-right">Variance Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => {
                      const range = store.costRanges[cat.id as keyof typeof store.costRanges];
                      const actual = actuals[cat.id] || 0;
                      let statusText = "Pending";
                      let variant = "secondary" as any;
                      
                      if (actual > 0) {
                        if (actual > range.high) {
                          statusText = "Over Budget"; variant = "destructive";
                        } else if (actual < range.low) {
                          statusText = "Saving"; variant = "default";
                        } else {
                          statusText = "On Target"; variant = "outline";
                        }
                      }

                      return (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium whitespace-nowrap">{cat.name}</TableCell>
                          <TableCell>
                            <Input 
                              type="text" 
                              className="w-40 h-9 bg-slate-50 text-sm" 
                              value={vendors[cat.id] || ''} 
                              readOnly
                              placeholder="Auto-synced from CRM" 
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatINR(range.low)} - {formatINR(range.high)}
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="text"
                              className="w-32 h-9 border-primary/20 bg-slate-50"
                              value={actuals[cat.id] ? formatINR(actuals[cat.id]) : ''}
                              readOnly
                              placeholder="₹0"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={variant} className={variant === 'default' ? 'bg-green-600 hover:bg-green-700' : ''}>
                              {statusText}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            
            <Card className="bg-primary text-primary-foreground shadow-xl rounded-2xl border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full blur-3xl pointer-events-none"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-serif font-light drop-shadow-sm">Total Actual vs Predicted Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mt-2 drop-shadow-md tracking-tight">
                  {formatINR(totalActual)}
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5 mt-6 mb-2 overflow-hidden">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${Math.min(100, (totalActual / totalEstimatedHigh) * 100)}%` }}></div>
                </div>
                <p className="text-sm font-medium mt-3 opacity-90 tracking-wide">
                  {totalActual > totalEstimatedHigh 
                    ? `Over Baseline Minimum by ${formatINR(totalActual - totalEstimatedHigh)}`
                    : `Remaining AI Baseline Budget: ${formatINR(totalEstimatedHigh - totalActual)}`}
                </p>
              </CardContent>
            </Card>

          </div>
        </div>        {/* Calcwise Sections Styled to Royal Theme */}
        <div className="mt-16 w-full max-w-7xl mx-auto space-y-16 pb-32">
          
          {/* Step 4: Progress Tracking / Tasks */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 font-serif"><ListTodo className="w-8 h-8 text-slate-800" /> Progress Tracking</h2>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 uppercase tracking-widest text-xs font-bold" onClick={() => window.location.href = '/tasks'}>
                Manage Checklist →
              </Button>
            </div>
            <Card className="shadow-sm border border-slate-200 bg-white rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 h-full w-2 bg-slate-900"></div>
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xl mb-1">Current Sync Velocity: <span className="text-emerald-600">{taskVelocity}%</span></h3>
                  <p className="text-slate-500 font-light tracking-wide text-sm">Real-time sync applied directly from your standalone tracking module database.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Step 5: Budget Alerts & Warnings */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 font-serif"><AlertTriangle className="text-slate-800 w-8 h-8" /> Budget Alerts & Warnings</h2>
            </div>
            <Card className="shadow-sm border-slate-200 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex bg-slate-50 p-5 rounded-xl items-center gap-4 border border-slate-200 mb-8 shadow-sm">
                  <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100">
                    <Lightbulb className="text-slate-600 w-5 h-5" />
                  </div>
                  <p className="text-slate-800 font-medium tracking-wide">{totalVariance < 0 ? `Alert: Critical Deviation detected. You are bleeding exactly ${formatINR(Math.abs(totalVariance))} over your forecasted maximum threshold.` : "No alerts yet. Continue entering your actual vendor quotes to activate deterministic real-time alerts."}</p>
                </div>
                <div className="pl-2">
                  <h4 className="font-bold flex items-center gap-3 mb-4 text-slate-800 tracking-tight"><Lightbulb className="text-slate-500 w-5 h-5" /> Optimization Suggestions</h4>
                  <p className="text-slate-500 font-light leading-relaxed ml-8">{totalVariance < 0 ? "You have breached the highest bound prediction. Consider consolidating your Decor and F&B vendors to aggressively extract a package discount, or eliminate secondary setup structures immediately." : "Switch to the robust Vendor Management portal to systematically track your spending against the AI benchmarks."}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Step 6: Vendor Management & Tracking */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 font-serif"><Building2 className="w-8 h-8 text-slate-800" /> Vendor Details</h2>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 uppercase tracking-widest text-xs font-bold" onClick={() => window.location.href = '/vendors'}>
                Manage Vendors CRM →
              </Button>
            </div>
            <Card className="shadow-sm border-dashed border-slate-300 bg-slate-50/50 rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center text-slate-500 font-light tracking-wide">
                Corporate vendor data operations and invoice management have been decoupled to the standalone Vendor portal.
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
