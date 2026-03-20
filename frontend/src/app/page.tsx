"use client";
import manifest from "../../public/keyframes_manifest.json";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Camera, BarChart3, Loader2 } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const FRAME_COUNT = manifest.hero_frames.length;
const currentFrame = (index: number) => manifest.hero_frames[index - 1];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Preloading State
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Parallax tracking for the Video Hero
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload all 240 frames immediately on mount
  useEffect(() => {
    let loadedImgs: HTMLImageElement[] = [];
    let loadCounter = 0;
    
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadCounter++;
        setLoadedCount(loadCounter);
        if (loadCounter === FRAME_COUNT) {
          // Give a tiny buffer for extreme smoothness before fading out loader
          setTimeout(() => setIsReady(true), 500);
        }
      };
      // Important to push to array so they are cached in sequence
      loadedImgs.push(img);
    }
    setImages(loadedImgs);

    // Initial canvas sizing
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll mapping logic
  const currentIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);
  
  const updateCanvas = (index: number) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // optimization
    const img = images[index];
    
    if (img && img.complete && ctx && canvas.width > 0 && canvas.height > 0) {
      // Object-cover rendering logic
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      
      // We no longer set canvas.width here, which prevents the 2D context from crashing during fast scroll scrubs
      ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }
  };

  useMotionValueEvent(currentIndex, "change", (latestVal) => {
    if (isReady) {
      const frameIndex = Math.floor(latestVal);
      // Ensure we don't go out of bounds
      updateCanvas(Math.min(Math.max(frameIndex, 0), FRAME_COUNT - 1));
    }
  });

  // Initial paint when ready
  useEffect(() => {
    if (isReady && images.length > 0) {
      updateCanvas(0);
    }
  }, [isReady]);

  // Calculate text opacity so it fades out gracefully at the very end of the 400vh scrub
  const textOpacity = useTransform(scrollYProgress, [0, 0.7, 0.95], [1, 1, 0]);
  
  // Calculate canvas opacity to smoothly transition the hero sequence out instead of a hard cut
  const canvasOpacity = useTransform(scrollYProgress, [0.85, 1], [0.6, 0]);

  return (
    <div className="w-full bg-black selection:bg-white/20 overflow-clip m-0 p-0 font-sans text-white">
      <AnimatePresence>
        {!isReady && (
          <motion.div exit={{ opacity: 0, transition: { duration: 0.8 } }} className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-[100]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-white animate-spin mb-8 opacity-50" />
              <h2 className="text-3xl font-serif text-white tracking-widest mb-4">BUFFERING ASSETS</h2>
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${Math.floor((loadedCount / FRAME_COUNT) * 100)}%` }}></div>
              </div>
              <p className="mt-4 text-white/40 font-light tracking-[0.2em] text-sm uppercase">Loading Frame {loadedCount} of {FRAME_COUNT}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />
      
      {/* 1. Hardware Accelerated Canvas Scrub Sequence */}
      {/* Increased height to 400vh to make the scroll scrub last much longer */}
      <section ref={containerRef} className="relative h-[400vh] w-full bg-black">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* Framer-driven Canvas mapped to useScroll opacity for a smooth exit */}
          <motion.canvas 
            ref={canvasRef}
            style={{ opacity: canvasOpacity }}
            className="absolute inset-0 z-0 w-full h-full object-cover mix-blend-screen"
          />
          
          {/* Deep Cinematic Overlay to ensure text legibility over the frames */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/40 to-black pointer-events-none" />
          
          <motion.div style={{ opacity: textOpacity }} className="relative z-10 w-full px-6 max-w-7xl mx-auto flex flex-col items-center justify-center mt-20 text-center pointer-events-none">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="text-6xl sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold text-white mb-6 leading-[0.85] tracking-tighter"
            >
              A budget <br/>
              makes it <span className="italic font-light text-white/90">real.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="text-lg md:text-2xl text-white/80 font-light mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide"
            >
              The deterministic engine calculating luxury logistics and predicting breathtaking décor costs through neural arrays.
            </motion.p>
            
            <motion.div style={{ pointerEvents: "auto" }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1 }}>
              <Link href="/wizard">
                <Button size="lg" className="rounded-none px-12 py-8 text-sm uppercase tracking-[0.3em] font-semibold text-black bg-white hover:bg-white/90 transition-all border-0 shadow-2xl hover:scale-105">
                  Get Started <span className="text-black/50 ml-2 font-normal">— Free</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Asymmetrical Grid 1 (Transition to White) */}
      <section className="relative z-10 bg-white text-black py-40 px-6 sm:px-12 rounded-t-[3rem] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-[100rem] mx-auto grid md:grid-cols-12 gap-16 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="md:col-span-4 flex flex-col justify-end"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1]">Neural Network <br/>Décor Inference.</h2>
            <p className="text-xl text-black/60 font-light leading-relaxed mb-10">
              Stop relying on vague vendor estimates. Upload your mood boards or select from our curated library. Our proprietary vision AI immediately categorizes and estimates the procurement and setup cost of your desired aesthetics using thousands of historical data points.
            </p>
            <Link href="/wizard">
              <Button variant="link" className="text-black p-0 h-auto text-lg tracking-widest uppercase font-semibold hover:text-black/50 transition-colors">
                See How It Works ↗
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="md:col-span-8 h-[600px] md:h-[800px] bg-slate-100 rounded-3xl relative overflow-hidden flex items-center justify-center group"
          >
             <img src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg" alt="Neural Decor Analysis" className="object-cover w-full h-full transition-transform duration-[2000ms] group-hover:scale-110" />
             <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 p-10 to-transparent">
                <span className="text-white text-xl font-light tracking-widest flex items-center gap-4"><Camera className="w-6 h-6"/> Vision Matrix Active</span>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Asymmetrical Grid 2 (Black Theme Reversal) */}
      <section className="relative z-10 bg-black text-white py-40 px-6 sm:px-12">
        <div className="max-w-[100rem] mx-auto grid md:grid-cols-12 gap-16 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="md:col-span-8 md:order-first order-last h-[600px] md:h-[800px] bg-zinc-900 rounded-3xl relative overflow-hidden group border border-white/5"
          >
             <img src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg" alt="Logistics Flow" className="object-cover w-full h-full transition-transform duration-[2000ms] group-hover:scale-110 opacity-70" />
             <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/20 p-10 to-transparent">
                <span className="text-white text-xl font-light tracking-widest flex items-center gap-4"><BarChart3 className="w-6 h-6"/> Deterministic Data Core</span>
             </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="md:col-span-4"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1]">Hard Logistics <br/>Engine.</h2>
            <p className="text-xl text-white/60 font-light leading-relaxed mb-10">
              Stop guessing on car rentals and hotel buffers. Our deterministic backend precisely calculates Innova round-trips, driver allowances, and per-head F&B consumption mapped strictly to specific Indian wedding profiles.
            </p>
            <ul className="space-y-6 text-xl text-white/80 font-light tracking-wide mb-10">
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-white shrink-0 rounded-full"></span> Configurable outstation ratios</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-white shrink-0 rounded-full"></span> Exact gala-dinner markup matrices</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-white shrink-0 rounded-full"></span> Multi-Scenario Deltas</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 4. Horizontal Feature Cards (Squarespace 'Everything you need') */}
      <section className="bg-[#f2f2f2] text-black py-40 px-6 sm:px-12 relative z-10 rounded-3xl mx-4 mb-4">
        <div className="max-w-[100rem] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">The Tech <br/>Stack.</h2>
            <p className="text-xl text-black/50 font-light max-w-sm">Built using industry-standard modern web architecture.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "NextJS 14 & Tailwind", desc: "A beautifully responsive React frontend heavily utilizing Framer Motion for hardware-accelerated animations and Glassmorphic aesthetics." },
              { title: "Fast-API Backend", desc: "A pure asynchronous Python microservice routing deterministically calculated datasets mapping complex F&B matrices and logistic ratios." },
              { title: "Supabase & ONNX", desc: "Blazing fast PostgreSQL edge connections coupled with a zero-latency ONNX CPU inference engine classifying décor semantics." }
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15, duration: 0.8 }}>
                <div className="bg-white p-12 md:p-16 rounded-[2rem] h-[450px] flex flex-col justify-between hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-700 group border border-black/5 cursor-pointer">
                  <h4 className="text-3xl font-bold tracking-tight text-black flex items-center justify-between">
                    {feature.title}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-500">→</span>
                  </h4>
                  <p className="text-black/50 text-xl font-light leading-relaxed group-hover:text-black/80 transition-colors duration-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Hackathon Context Section */}
      <section className="bg-zinc-950 text-white py-40 px-6 sm:px-12 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
           <div className="md:w-1/3">
              <h3 className="text-3xl font-serif text-white/90 mb-4 tracking-wide border-l-2 border-white/20 pl-6">WedTech IIT Innovation Challenge 2025</h3>
              <p className="text-white/40 font-light tracking-widest text-sm uppercase">Product 3 (P3) Submission</p>
           </div>
           
           <div className="md:w-2/3 space-y-8">
              <p className="text-2xl md:text-3xl font-light text-white/80 leading-relaxed tracking-wide">
                Build WeddingBudget.ai — an AI-powered wedding budget estimation engine for high-end Indian destination weddings. The platform takes structured inputs about a wedding (city, hotel tier, guest count, functions) and outputs an itemised Low/Mid/High budget estimate.
              </p>
              <p className="text-xl md:text-2xl font-light text-white/50 leading-relaxed tracking-wide">
                This estimate is powered by a custom computer vision model that predicts décor costs directly from imagery, combined with deterministic calculation engines mapped strictly for logistics, F&B, artists, and sundries.
              </p>
              <div className="pt-8 border-t border-white/10 flex flex-col gap-2">
                 <p className="text-lg text-white/70 italic">Issued by <span className="font-semibold text-white">Events by Athea</span></p>
                 <p className="text-white/40 font-light text-sm">A high-end wedding planning firm managing 50+ destination weddings annually with budgets ranging from ₹50 Lakhs to ₹10 Crores.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 5. Giant Stat Footer Showcase */}
      <section className="bg-black text-white py-40 px-6 sm:px-12 relative z-10">
        <div className="max-w-[100rem] mx-auto text-center flex flex-col items-center">
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.2 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
            className="text-[6rem] sm:text-[10rem] md:text-[18rem] font-bold tracking-tighter leading-none hover:opacity-100 transition-opacity duration-1000 cursor-default"
          >
            ₹5 Crore
          </motion.h2>
          <p className="text-2xl md:text-5xl text-white/80 font-light mt-8 tracking-tight">The wedding black-box, <span className="italic">solved.</span></p>
          
          <div className="mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-between w-full">
            <div className="text-white/40 text-sm tracking-widest uppercase mb-8 md:mb-0">Designed exclusively for the WedTech Innovation Challenge</div>
            <Link href="/wizard">
              <Button size="lg" className="rounded-none px-12 py-8 text-sm uppercase tracking-[0.3em] font-semibold text-black bg-white hover:bg-white/80 transition-all border-0 shadow-2xl">
                Start For Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
