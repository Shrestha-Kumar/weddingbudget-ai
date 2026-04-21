"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, MapPin, Users, IndianRupee, Sparkles, Hotel, Loader2, ArrowRight, ArrowLeft, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { scoutChat, searchVenues } from "@/lib/api";

interface Venue {
  id: string;
  name: string;
  city: string;
  hotel_tier: string;
  capacity: number;
  base_price_low: number;
  base_price_high: number;
  price_per_plate_veg: number;
  price_per_plate_non_veg: number;
  description: string;
  images: string[];
  amenities?: string[];
  visit_url?: string;
}

// Real data will be fetched from API

export default function VenueScout() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string; type?: "tool" }[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [step, setStep] = useState<"budget" | "guests" | "location" | "searching" | "results">("budget");
  const [budget, setBudget] = useState(0);
  const [guests, setGuests] = useState(0);
  const [location, setLocation] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem("scout_session");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMessages(data.messages || []);
        setStep(data.step || "budget");
        setBudget(data.budget || 0);
        setGuests(data.guests || 0);
        setLocation(data.location || "");
        if (data.venues) {
          setVenues(data.venues);
        }
      } catch (e) {
        console.error("Failed to parse scout session", e);
      }
    } else {
      setMessages([{ role: "assistant", content: "Architecture initialization complete. I am your Agentic Venue Scout. To begin our search, please specify your total venue budget (excluding decor)." }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("scout_session", JSON.stringify({ messages, step, budget, guests, location, venues }));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, step, budget, guests, location]);

  const resetMission = () => {
    localStorage.removeItem("scout_session");
    setMessages([{ role: "assistant", content: "Architecture reset. I am ready to begin a new scouting mission. Please specify your venue budget." }]);
    setStep("budget");
    setBudget(0);
    setGuests(0);
    setVenues([]);
  };

  const parseBudget = (str: string): number => {
    const s = str.toLowerCase().replace(/,/g, "").trim();
    let multiplier = 1;
    if (s.includes("crore") || s.includes("cr")) multiplier = 10000000;
    else if (s.includes("lakh") || s.includes("lac") || s.endsWith("l")) multiplier = 100000;
    
    const numMatch = s.match(/[\d.]+/);
    if (!numMatch) return 0;
    return parseFloat(numMatch[0]) * multiplier;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    if (step === "budget") {
      const val = parseBudget(userMessage);
      if (val <= 0) {
        setMessages(prev => [...prev, { role: "assistant", content: "Input parity failed. I couldn't parse that budget payload. Please use terms like '2 Crore' or '50 Lakh'." }]);
        return;
      }
      setBudget(val);
      setMessages(prev => [...prev, { role: "assistant", content: `Budget baseline recognized: ₹${val.toLocaleString('en-IN')}. Please inject the guest count for capacity validation.` }]);
      setStep("guests");
    } else if (step === "guests") {
      const val = parseInt(userMessage.replace(/[^0-9]/g, ""));
      if (isNaN(val)) {
        setMessages(prev => [...prev, { role: "assistant", content: "Guest count error. Please provide a numerical value (e.g. 500)." }]);
        return;
      }
      setGuests(val);
      setMessages(prev => [...prev, { role: "assistant", content: `Guest count confirmed: ${val}. Where would you like to host this event? (Enter any city, e.g. Udaipur, Goa, or even London)` }]);
      setStep("location");
    } else if (step === "location") {
      setLocation(userMessage);
      setStep("searching");
      setIsThinking(true);
      
      setMessages(prev => [...prev, { role: "assistant", content: `Targeting location: ${userMessage}. Initiating global intelligence recovery...` }]);
      
      try {
        const res = await scoutChat(userMessage, { budget, guests, city: userMessage });
        const tools = res.data.tools_used || ["Neural_Search", "Web_Intelligence"];

        for (const t of tools) {
          await new Promise(r => setTimeout(r, 800));
          setMessages(prev => [...prev, { role: "assistant", content: `Tool Invocation: ${t}`, type: "tool" }]);
        }

        setIsThinking(false);
        setStep("results");
        setVenues(res.data.venues || []);
        setMessages(prev => [...prev, { role: "assistant", content: res.data.content }]);
      } catch (e: any) {
        setIsThinking(false);
        setMessages(prev => [...prev, { role: "assistant", content: `Scouting failure: ${e.message}. Link sync interrupted.` }]);
      }
    } else if (step === "results") {
        // Conversational refining
        setIsThinking(true);
        try {
            const res = await scoutChat(userMessage, { budget, guests });
            setMessages(prev => [...prev, { role: "assistant", content: res.data.content }]);
            if (res.data.venues && res.data.venues.length > 0) {
                setVenues(res.data.venues);
            }
        } catch (e: any) {
            setMessages(prev => [...prev, { role: "assistant", content: "I encountered a synchronization error in the thinking array." }]);
        }
        setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col h-[calc(100vh-64px)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
             <Button variant="ghost" size="sm" className="mb-2 text-slate-500 hover:text-slate-900 -ml-2" onClick={() => router.push('/dashboard')}>
               <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
             </Button>
            <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Venue Scout AI</h1>
            <p className="text-slate-500 font-medium">Agentic intelligence layer for hotel tier recovery.</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={resetMission} variant="outline" className="border-slate-200 text-slate-600 bg-white shadow-sm">
                <RefreshCw className="w-4 h-4 mr-2" /> Reset Session
             </Button>
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Agent" className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">+12</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Chat Interface */}
          <Card className="lg:col-span-4 border-slate-200 bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 leading-none">Intelligence Array</p>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Link</p>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50/30">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm shadow-sm ${
                      m.role === "user" 
                        ? "bg-slate-900 text-white" 
                        : m.type === "tool"
                        ? "bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-500 italic"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}>
                      {m.type === "tool" && <Loader2 className="w-3 h-3 inline mr-2 animate-spin opacity-50" />}
                      {m.content}
                    </div>
                  </motion.div>
                ))}
                {isThinking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex gap-1 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <Input
                  placeholder={step === "results" ? "Recovery cycle complete" : "Enter mission parameters..."}
                  value={input}
                  disabled={step === "searching" || step === "results"}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="bg-slate-50 border-slate-200 h-12 pl-4 pr-12 text-slate-900 rounded-xl focus:ring-slate-900"
                />
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  disabled={!input || step === "searching" || step === "results"}
                  className="absolute right-1 top-1 h-10 w-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Grid */}
          <div className="lg:col-span-8 overflow-y-auto pr-2 scrollbar-hide space-y-6">
            {step === "results" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venues.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-white border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                      <div className="h-48 relative overflow-hidden bg-slate-100">
                        {v.images?.[0] ? (
                            <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Hotel className="w-12 h-12" />
                            </div>
                        )}
                        <div className={`absolute top-4 left-4 ${v.id.startsWith('web-') ? 'bg-emerald-600' : 'bg-slate-900'} text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                          {v.id.startsWith('web-') && <Sparkles className="w-3 h-3" />}
                          {v.hotel_tier}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">{v.name}</h3>
                            <p className="text-slate-400 text-xs flex items-center gap-1.5 uppercase font-bold tracking-wider"><MapPin className="w-3 h-3" /> {v.city}</p>
                          </div>
                        </div>
                        
                        <p className="text-slate-500 text-sm font-light leading-relaxed mb-6 italic line-clamp-2">"{v.description}"</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                            <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {v.capacity} Guests</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Veg / Plate</p>
                            <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> ₹{v.price_per_plate_veg ? Number(v.price_per_plate_veg).toLocaleString('en-IN') : '2,500'}</p>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => v.visit_url ? window.open(v.visit_url, '_blank') : null}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 text-sm font-bold shadow-sm"
                        >
                          Explore Venue
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                   <Hotel className="w-10 h-10 text-slate-200" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Awaiting Parameters</h2>
                <p className="text-slate-400 text-sm max-w-sm font-light leading-relaxed italic">Confirm budget and guest requirements in the chat matrix to initiate intelligence recovery.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
