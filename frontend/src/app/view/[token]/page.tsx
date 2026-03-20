"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function SharedView({ params }: { params: { token: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSession(params.token)
      .then(res => {
        if (res.data) setData(res.data);
        else setError("Session not found");
      })
      .catch((e) => setError("Invalid session link"))
      .finally(() => setLoading(false));
  }, [params.token]);

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val/10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val/100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-emerald-950/10 pt-12 pb-24 px-4 shadow-inner relative overflow-hidden animate-pulse">
          <div className="max-w-4xl mx-auto text-center mt-4">
            <Skeleton className="h-14 w-3/4 max-w-xl mx-auto mb-6 bg-emerald-900/10 rounded-xl" />
            <Skeleton className="h-6 w-1/2 max-w-md mx-auto bg-emerald-900/5 rounded-full" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-16">
          <Card className="shadow-xl bg-white mb-8 border-none overflow-hidden">
            <CardContent className="p-8 md:p-12 mb-2">
              <Skeleton className="h-4 w-48 mx-auto mb-10 bg-slate-100 rounded-full" />
              <div className="flex justify-center items-center gap-4">
                <Skeleton className="h-20 w-48 bg-slate-100 rounded-2xl" />
                <Skeleton className="h-1 w-8 bg-slate-200" />
                <Skeleton className="h-20 w-48 bg-slate-100 rounded-2xl" />
              </div>
            </CardContent>
          </Card>
          
          <Skeleton className="h-8 w-64 mb-8 bg-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-white border-none shadow-sm h-36">
                <CardContent className="p-6 flex justify-between items-center h-full">
                  <Skeleton className="h-6 w-32 bg-slate-100" />
                  <div className="space-y-3 flex flex-col items-end">
                    <Skeleton className="h-10 w-28 bg-slate-100" />
                    <Skeleton className="h-4 w-16 bg-slate-50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center shadow-lg border-destructive/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-destructive/60"></div>
          <CardTitle className="text-2xl font-serif text-destructive tracking-tight mb-2">Invalid Session</CardTitle>
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  const { input_params, budget_output } = data;
  const totalLow = budget_output ? Object.values(budget_output).reduce((a: any, b: any) => a + b.low, 0) : 0;
  const totalHigh = budget_output ? Object.values(budget_output).reduce((a: any, b: any) => a + b.high, 0) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-950 pt-16 pb-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg')] bg-cover opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="text-4xl md:text-5xl font-serif text-white mb-4 shadow-sm tracking-tight">Your Wedding Estimate</motion.h1>
          <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="text-slate-300 md:text-lg max-w-xl mx-auto font-light tracking-wide">
            Prepared specially for you based on {input_params.guestCount} guests in {input_params.city}
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-16">
        <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2, duration: 0.6}}>
          <Card className="shadow-2xl bg-white/95 backdrop-blur-md border-white mb-12 rounded-3xl overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Total Estimated Budget</p>
              <div className="flex flex-col md:flex-row items-baseline justify-center gap-4">
                <span className="text-5xl md:text-6xl font-bold font-serif text-slate-900">{formatINR(totalLow)}</span>
                <span className="text-xl text-slate-300 font-light">—</span>
                <span className="text-5xl md:text-6xl font-bold font-serif text-slate-900">{formatINR(totalHigh)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <h2 className="text-2xl font-serif text-slate-900 mb-6 px-2">Cost Breakdown Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(budget_output || {}).map(([key, range]: any, idx) => (
            <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.4 + (idx * 0.1)}} key={key}>
              <Card className="bg-white border-slate-100 hover:border-slate-300 transition-colors shadow-sm h-full group rounded-2xl">
                <CardContent className="p-6 flex justify-between items-center h-full">
                  <div className="capitalize font-medium text-slate-700 tracking-wide text-lg group-hover:text-slate-900 transition-colors">
                    {key.replace("fnb", "Food & Beverage").replace("decor", "Décor & Production")}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-xl">{formatINR((range as any).low)}</div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">upto {formatINR((range as any).high)}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
