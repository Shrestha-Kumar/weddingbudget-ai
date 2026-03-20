"use client";

import React from 'react';
import { Navigation } from "@/components/Navigation";
import { BrainCircuit, Fingerprint, Database, Check, X, AlertTriangle, BarChart3 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const architecture = [
    {
      title: "Neural Architecture",
      desc: "Our AI models are trained on millions of data points from past Indian weddings, predicting costs and logistics with unprecedented accuracy.",
      icon: BrainCircuit,
      color: "bg-emerald-500"
    },
    {
      title: "Rigorous Cost Tracking",
      desc: "Every micro-transaction, vendor quote, and logistical buffer is meticulously tracked and analyzed, eliminating opaque estimates.",
      icon: Fingerprint,
      color: "bg-blue-500"
    },
    {
      title: "Dynamic Data Array",
      desc: "A constantly evolving database of local vendors, regional pricing, and cultural nuances ensures hyper-local relevance and precision.",
      icon: Database,
      color: "bg-purple-500"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary/20 overflow-hidden">
      <Navigation />
      
      {/* Header */}
      <div ref={ref} className="relative pt-40 pb-32 px-4 text-center overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div style={{ y: yBg, backgroundImage: "url('https://images.unsplash.com/photo-1583939411023-14783179e581?q=80&w=2940&auto=format&fit=crop')" }} className="absolute inset-0 z-0 bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-serif text-slate-900 mb-8 tracking-tight"
          >
            About The Platform
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl md:text-3xl text-slate-600 font-light leading-relaxed"
          >
            Crafting the ultimate operating system for high-end luxury Indian weddings, combining neural architecture with rigorous mechanical cost tracking.
          </motion.p>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="py-32 px-4 bg-white border-y border-slate-200 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <BrainCircuit className="w-20 h-20 text-primary mx-auto mb-10" />
          <h2 className="text-5xl font-serif text-slate-900 mb-10">Our Philosophy</h2>
          <p className="text-2xl text-slate-600 leading-relaxed font-light">
            We recognized that the most chaotic aspect of planning a <span className="font-semibold text-slate-800">₹5 Crore</span> destination wedding isn't the venue selection—it's the hundreds of micro-transactions, logistics buffers, and wildly opaque décor estimates. This platform eliminates the black box by generating transparent, itemized estimates before the first vendor is even contacted.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          {architecture.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 * i, duration: 0.8 }} className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`}/>
              <item.icon className="w-12 h-12 text-slate-800 mb-6" />
              <h3 className="text-2xl font-serif text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Comparison Matrix */}
      <section className="py-32 px-4 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Competitor Matrix Analysis</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 font-light">Why WeddingBudget.ai completely outperforms legacy spreadsheets.</motion.p>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800">
                  <th className="p-6 font-medium tracking-wide text-sm uppercase text-slate-300">System Capability</th>
                  <th className="p-6 font-medium tracking-wide text-center text-slate-400 text-sm uppercase">Legacy Spreadsheets</th>
                  <th className="p-6 font-bold tracking-wide text-center bg-slate-800 text-white text-sm uppercase">WeddingBudget.ai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-medium text-slate-900">Deterministic Logistics Routing</td>
                  <td className="p-6 text-center"><span className="text-slate-400 font-serif">—</span></td>
                  <td className="p-6 text-center text-slate-900 font-bold flex justify-center items-center gap-2"><Check className="w-4 h-4 text-slate-600" /> <span className="text-sm">Mathematical Extrapolation</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-medium text-slate-900">Neural Décor Inference</td>
                  <td className="p-6 text-center"><span className="text-slate-400 font-serif">—</span></td>
                  <td className="p-6 text-center text-slate-900 font-bold flex justify-center items-center gap-2"><Check className="w-4 h-4 text-slate-600" /> <span className="text-sm">ONNX Vision Integration</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-medium text-slate-900">Visual Heatmap Diagnostics</td>
                  <td className="p-6 text-center"><span className="text-slate-400 font-serif">—</span></td>
                  <td className="p-6 text-center text-slate-900 font-bold flex justify-center items-center gap-2"><Check className="w-4 h-4 text-slate-600" /> <span className="text-sm">OpenCV Masking</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-medium text-slate-900">Live Task Timeline Mapping</td>
                  <td className="p-6 text-center"><span className="text-slate-400 font-serif">—</span></td>
                  <td className="p-6 text-center text-slate-900 font-bold flex justify-center items-center gap-2"><Check className="w-4 h-4 text-slate-600" /> <span className="text-sm">Built-in CRM Tracker</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-medium text-slate-900">Active Vendor Invoice Management</td>
                  <td className="p-6 text-center"><span className="text-slate-400 font-serif">Manual</span></td>
                  <td className="p-6 text-center text-slate-900 font-bold flex justify-center items-center gap-2"><Check className="w-4 h-4 text-slate-600" /> <span className="text-sm">Dashboard States Tracker</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-slate-50/50 border-t border-slate-200">
                  <td className="p-6 font-bold tracking-wider text-slate-900 uppercase text-xs">System Architecture Metrics</td>
                  <td className="p-6 text-center font-medium text-slate-500 tracking-wide text-xs">3-5 basic features</td>
                  <td className="p-6 text-center font-bold text-slate-900 tracking-wide text-base">14+ Next.js Integrations</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* Indian Wedding Example Scenarios */}
      <section className="py-24 px-4 bg-slate-100 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 flex items-center justify-center gap-4"><BarChart3 className="text-primary w-8 h-8" /> Scalable Indian Wedding Forecasts</motion.h2>
            <p className="text-lg text-slate-500 font-light">How the mathematical engine dynamically scales across discrete socioeconomic constraints.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold rounded uppercase tracking-widest mb-4">Udaipur Royal</div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Priya & Rahul</h3>
              <p className="text-slate-500 mb-6 text-sm">450 Guests • 5-Star Palace</p>
              <div className="space-y-4 pt-6 border-t border-slate-100 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Calculated Logistics</span><span className="font-medium text-slate-900">₹8.4L</span></div>
                <div className="flex justify-between"><span className="text-slate-500">AI Décor Setup Max</span><span className="font-medium text-slate-900">₹32L</span></div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Total</span>
                  <span className="font-bold text-2xl text-slate-900">₹74.5L</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold rounded uppercase tracking-widest mb-4">Goa Beachfront</div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Simran & Harpreet</h3>
              <p className="text-slate-500 mb-6 text-sm">250 Guests • Premium Resort</p>
              <div className="space-y-4 pt-6 border-t border-slate-100 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Calculated Logistics</span><span className="font-medium text-slate-900">₹4.2L</span></div>
                <div className="flex justify-between"><span className="text-slate-500">AI Décor Setup Max</span><span className="font-medium text-slate-900">₹14L</span></div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Total</span>
                  <span className="font-bold text-2xl text-slate-900">₹32.8L</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold rounded uppercase tracking-widest mb-4">Alibaug Intimate</div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Fatima & Ahmed</h3>
              <p className="text-slate-500 mb-6 text-sm">120 Guests • Heritage Villa</p>
              <div className="space-y-4 pt-6 border-t border-slate-100 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Calculated Logistics</span><span className="font-medium text-slate-900">₹1.8L</span></div>
                <div className="flex justify-between"><span className="text-slate-500">AI Décor Setup Max</span><span className="font-medium text-slate-900">₹6L</span></div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Total</span>
                  <span className="font-bold text-2xl text-slate-900">₹18.2L</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Pillars in big lines */}
      <section className="py-40 px-4 max-w-6xl mx-auto space-y-40 relative z-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row gap-16 items-start"
        >
          <div className="md:w-1/3">
            <span className="text-8xl font-serif text-slate-200 block mb-6 drop-shadow-sm">01</span>
            <h3 className="text-4xl font-serif text-slate-900 leading-tight">Computer Vision Integration</h3>
          </div>
          <div className="md:w-2/3 pt-6 border-t-2 border-primary">
            <p className="text-3xl text-slate-700 leading-relaxed font-light">
              By analyzing thousands of previous stage setups, floral arrangements, and rigging architectures, our AI immediately classifies inspiration imagery into standardized, predictable cost tiers.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row gap-16 items-start"
        >
          <div className="md:w-1/3">
            <span className="text-8xl font-serif text-slate-200 block mb-6 drop-shadow-sm">02</span>
            <h3 className="text-4xl font-serif text-slate-900 leading-tight">Hyper-Local Logistics</h3>
          </div>
          <div className="md:w-2/3 pt-6 border-t-2 border-primary">
            <p className="text-3xl text-slate-700 leading-relaxed font-light">
              Foreign budgeting tools fail in India because they cannot account for outstation guest ratios, dedicated Innova deployments, and ceremonial necessities like Dhols or Safas. We hardcoded these exact specifications into our backend matrices.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row gap-16 items-start"
        >
          <div className="md:w-1/3">
            <span className="text-8xl font-serif text-slate-200 block mb-6 drop-shadow-sm">03</span>
            <h3 className="text-4xl font-serif text-slate-900 leading-tight">Immediate Client Transparency</h3>
          </div>
          <div className="md:w-2/3 pt-6 border-t-2 border-primary">
            <p className="text-3xl text-slate-700 leading-relaxed font-light">
              Generated estimates are completely exportable into pixel-perfect PDF configurations or Excel layouts, featuring dynamic opaque UUID tokens that grant view-only access to stakeholders remotely.
            </p>
          </div>
        </motion.div>
      </section>

      {/* WedTech IIT Origin Story Component */}
      <section className="bg-slate-900 text-white py-40 px-4 relative z-20">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-6xl font-serif text-white mb-8">The Innovation Mandate</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
            <p className="text-2xl text-slate-300 font-light leading-relaxed max-w-4xl mx-auto">
              Our core corporate infrastructure was exclusively conceptualized for the <span className="font-semibold text-primary">WedTech IIT Innovation Challenge</span>. The explicit problem statement recognized that modern planners orchestrate heavily complex variables using chaotic, memory-based estimations.
            </p>
          </motion.div>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
              <div className="h-72 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop" alt="Academic Innovation" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <h4 className="absolute bottom-6 left-8 text-3xl font-serif text-white">The IIT Baseline</h4>
              </div>
              <div className="p-8">
                <p className="text-slate-300 text-lg font-light leading-relaxed">
                  We engineered an exact response to the academic parameters requiring 10,000+ scraped design references integrated into a machine learning cost prediction engine, scaling far beyond mere spreadsheets.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <div className="bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
              <div className="h-72 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2000&auto=format&fit=crop" alt="Advanced Data Array" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <h4 className="absolute bottom-6 left-8 text-3xl font-serif text-white">Scientific Market Shift</h4>
              </div>
              <div className="p-8">
                <p className="text-slate-300 text-lg font-light leading-relaxed">
                  The Indian wedding market operates on "gut feel". By fully mapping dynamic variables (like Outstation ratios, Ghodi baseline pricing, Dholi hourly rates), we converted a chaotic market into an exact science.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}
