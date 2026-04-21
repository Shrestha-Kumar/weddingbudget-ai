"use client";

import { useEffect, useState } from "react";
import { fetchAllSessions } from "@/lib/api";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History, TrendingUp, TrendingDown, RefreshCcw, Trash2 } from "lucide-react";
import { deleteSession } from "@/lib/api";

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
  
  const loadSessions = () => {
    fetchAllSessions()
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setSessions(res.data);
        } else {
          setSessions([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch sessions:", err);
        setSessions([]);
      });
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCompareToggle = (id: string) => {
    setComparing(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this scenario? This action cannot be undone.")) return;
    try {
      await deleteSession(id);
      loadSessions();
      setComparing(prev => prev.filter(x => x !== id));
    } catch (e) {
      alert("Failed to delete session.");
    }
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
          <div className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-slate-900 transition-all hover:bg-slate-800">
            <History className="w-4 h-4" /> 
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {sessions?.length || 0} Saved Tracks
            </span>
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
                  <Card key={id} className={`border ${index === 0 ? 'border-primary' : 'border-slate-300'} bg-white shadow-sm relative overflow-hidden rounded-2xl`}>
                    <div className={`absolute top-0 right-0 px-4 py-1 text-[9px] text-white font-bold uppercase tracking-widest ${index === 0 ? 'bg-primary' : 'bg-slate-400'}`}>
                      Model {index === 0 ? 'A' : 'B'}
                    </div>
                    <CardHeader className="pb-4">
                      <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{new Date(s.created_at).toLocaleDateString()}</CardDescription>
                      <CardTitle className="text-3xl font-serif text-slate-900 tracking-tight">{formatINR(total)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 border-t border-slate-100">
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 uppercase text-[9px] font-bold tracking-widest">Venue Tier</span>
                        <span className={`font-bold ${s.input_params.hotelTier !== other?.input_params.hotelTier ? 'text-primary' : 'text-slate-900'}`}>
                          {s.input_params.hotelTier}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 uppercase text-[9px] font-bold tracking-widest">Location</span>
                        <span className={`font-bold ${s.input_params.city !== other?.input_params.city ? 'text-primary' : 'text-slate-900'}`}>
                          {s.input_params.city}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 uppercase text-[9px] font-bold tracking-widest">Guest Count</span>
                        <span className={`font-bold ${s.input_params.guestCount !== other?.input_params.guestCount ? 'text-primary' : 'text-slate-900'}`}>
                          {s.input_params.guestCount} profiles
                        </span>
                      </div>

                      <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Financial Delta</span>
                        {isCheaper ? (
                          <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 italic">
                             <TrendingDown className="w-3.5 h-3.5"/> {-((otherTotal - total)/otherTotal * 100).toFixed(1)}% Saving
                          </span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 italic">
                             <TrendingUp className="w-3.5 h-3.5"/> {+((total - otherTotal)/otherTotal * 100).toFixed(1)}% Premium
                          </span>
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
              <Card key={s.id} className={`transition-all duration-300 rounded-2xl overflow-hidden border-slate-200 ${isComparing ? 'ring-2 ring-primary border-primary bg-slate-50 shadow-lg' : 'hover:shadow-md bg-white'}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-serif flex items-center justify-between tracking-tight text-slate-900">
                    {s.input_params?.city || "Unknown City"} Event
                    <span className="text-[10px] font-bold tracking-widest text-primary bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 uppercase">{formatINR(total)}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {new Date(s.created_at).toLocaleDateString()} • {s.input_params?.guestCount} Guests
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 border-t border-slate-50">
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Venue Tier</span>
                      <span className="font-bold text-slate-700">{s.input_params?.hotelTier}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Active Stages</span>
                      <span className="font-bold text-slate-700">{s.input_params?.events?.length || 0} Index Points</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={isComparing ? "default" : "outline"} 
                      className={`flex-grow h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isComparing ? 'bg-primary text-white shadow-lg scale-95' : 'border-slate-200 text-slate-500'}`}
                      onClick={() => handleCompareToggle(s.id)}
                    >
                      {isComparing ? "Comparing" : "Compare"}
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={(e) => handleDeleteSession(e, s.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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
