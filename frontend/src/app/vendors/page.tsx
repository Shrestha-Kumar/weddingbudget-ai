"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const categories = [
  { id: "decor", name: "Décor & Production" },
  { id: "fnb", name: "Food & Beverage" },
  { id: "logistics", name: "Ground Logistics" },
  { id: "artists", name: "Artists & Entertainment" },
  { id: "sundries", name: "Sundries & Miscellaneous" }
];

export default function VendorsDashboard() {
  const [vendorDB, setVendorDB] = useState<any[]>([]);
  const [newVendor, setNewVendor] = useState({ name: "", category: "decor", contact: "", quote: "", date: "" });

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Vendor Detail CRM</h1>
          <p className="text-muted-foreground">Manage your negotiated contracts and independent supplier networks here.</p>
        </div>

        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 font-serif"><Building2 className="w-8 h-8 text-slate-800" /> Active Vendor Pipeline</h2>
          </div>
          <Card className="shadow-sm border-slate-200 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <h4 className="font-bold text-slate-800 mb-6 tracking-tight text-lg">Add New Corporate Vendor</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 pb-10 border-b border-slate-100">
                <Input placeholder="Vendor Name" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} className="bg-slate-50 border-slate-200 h-12" />
                <select className="flex h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900" value={newVendor.category} onChange={e => setNewVendor({...newVendor, category: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Input placeholder="Contact Identity / Phone" value={newVendor.contact} onChange={e => setNewVendor({...newVendor, contact: e.target.value})} className="bg-slate-50 border-slate-200 h-12" />
                <Input type="number" placeholder="Quote Amount (₹)" value={newVendor.quote} onChange={e => setNewVendor({...newVendor, quote: e.target.value})} className="bg-slate-50 border-slate-200 h-12" />
                <Button className="h-12 w-full text-base tracking-wide bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm border-0" onClick={() => { if(newVendor.name) { setVendorDB([...vendorDB, { ...newVendor, id: Date.now() }]); setNewVendor({name:"", category:"decor", contact:"", quote:"", date:""}); } }}>Add Vendor</Button>
              </div>
              
              {vendorDB.length === 0 ? (
                <div className="text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed py-16">
                  <p className="text-slate-500 font-light tracking-wide">The CRM is currently empty. Drop in your first vendor invoice above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vendorDB.map(v => (
                    <div key={v.id} className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-shadow group">
                      <div className="flex flex-col gap-1 w-full md:w-auto mb-4 md:mb-0">
                        <p className="font-bold text-slate-800 text-lg flex items-center gap-3">{v.name} <span className="text-xs font-light tracking-widest text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm uppercase">{categories.find(c => c.id === v.category)?.name}</span></p>
                        <p className="text-sm font-medium text-slate-500">{v.contact}</p>
                      </div>
                      <div className="text-right w-full md:w-auto flex justify-between md:block bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1 md:text-right text-left">Quoted Invoice</p>
                        <p className="font-bold text-xl text-slate-900">{formatINR(Number(v.quote))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
