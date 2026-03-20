"use client";

import { useEffect, useState } from "react";
import { fetchAllSessions } from "@/lib/api";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";

export const formatINR = (num: number) => {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  } else {
    return `₹${num.toLocaleString('en-IN')}`;
  }
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [comparing, setComparing] = useState<string[]>([]);
  
  useEffect(() => {
    fetchAllSessions().then(res => setSessions(res.data)).catch(console.error);
  }, []);

  const handleCompareToggle = (id: string) => {
    setComparing(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const getTotal = (budget_output: any) => {
    if (!budget_output) return 0;
    return Object.values(budget_output).reduce((acc: any, range: any) => acc + (range.mid || 0), 0) as number;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-4xl font-serif text-slate-900 mb-2">Historical Scenarios</h1>
            <p className="text-slate-500">Track and compare previous wedding permutations to optimize ROI.</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center gap-2">
            <History className="w-5 h-5" /> 
            {sessions.length} Saved Tracks
          </div>
        </div>

        {/* COMPARISON ENGINE ZONE */}
        {comparing.length === 2 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
              <RefreshCcw className="w-6 h-6 text-primary"/> Scenario Analysis 
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comparing.map((id, index) => {
                const s = sessions.find(x => x.id === id);
                if (!s) return null;
                const other = sessions.find(x => x.id === comparing[index === 0 ? 1 : 0]);
                const total = getTotal(s.budget_output);
                const otherTotal = getTotal(other?.budget_output);
                const isCheaper = total < otherTotal;

                return (
                  <Card key={id} className={`border-2 ${index === 0 ? 'border-blue-200' : 'border-emerald-200'} bg-white shadow-xl relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 px-4 py-1 text-sm text-white font-medium ${index === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                      Model {index === 1 ? 'A' : 'B'}
                    </div>
                    <CardHeader>
                      <CardDescription className="text-xs uppercase tracking-widest">{new Date(s.created_at).toLocaleString()}</CardDescription>
                      <CardTitle className="text-3xl font-serif text-slate-900">{formatINR(total)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500">Venue Tier</span>
                        <span className={`font-medium ${s.input_params.hotelTier !== other?.input_params.hotelTier ? 'text-primary' : 'text-slate-900'}`}>
                          {s.input_params.hotelTier}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500">Location</span>
                        <span className={`font-medium ${s.input_params.city !== other?.input_params.city ? 'text-primary' : 'text-slate-900'}`}>
                          {s.input_params.city}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500">Guest Array</span>
                        <span className={`font-medium ${s.input_params.guestCount !== other?.input_params.guestCount ? 'text-primary' : 'text-slate-900'}`}>
                          {s.input_params.guestCount} profiles
                        </span>
                      </div>

                      <div className="pt-4 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Financial Delta</span>
                        {isCheaper ? (
                          <span className="text-emerald-600 flex items-center font-bold gap-1"><TrendingDown className="w-4 h-4"/> {-((otherTotal - total)/otherTotal * 100).toFixed(1)}%</span>
                        ) : (
                          <span className="text-red-600 flex items-center font-bold gap-1"><TrendingUp className="w-4 h-4"/> {+((total - otherTotal)/otherTotal * 100).toFixed(1)}% Premium</span>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-serif text-slate-900 mb-6">Execution Log</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((s) => {
            const isComparing = comparing.includes(s.id);
            const total = getTotal(s.budget_output);
            
            return (
              <Card key={s.id} className={`transition-all duration-300 ${isComparing ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:shadow-md'}`}>
                <CardHeader>
                  <CardTitle className="text-lg font-serif flex items-center justify-between">
                    {s.input_params?.city || "Unknown City"} Event
                    <span className="text-sm font-sans tracking-wide text-primary bg-white px-2 py-1 rounded shadow-sm border">{formatINR(total)}</span>
                  </CardTitle>
                  <CardDescription>
                    {new Date(s.created_at).toLocaleDateString()} • {s.input_params?.guestCount} Guests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li><strong className="text-slate-900">Tier:</strong> {s.input_params?.hotelTier}</li>
                    <li><strong className="text-slate-900">Events:</strong> {s.input_params?.events?.length || 0} stages booked</li>
                  </ul>
                  <div className="flex gap-3">
                    <Button 
                      variant={isComparing ? "default" : "outline"} 
                      className={`w-full ${isComparing ? 'bg-slate-900 text-white' : ''}`}
                      onClick={() => handleCompareToggle(s.id)}
                    >
                      {isComparing ? "Selected for Split" : "Add to Compare"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
