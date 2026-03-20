"use client";
import manifest from "../../../public/keyframes_manifest.json";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBudgetStore } from "@/store/useBudgetStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const CITIES = ["Udaipur", "Jaipur", "Goa", "Mumbai", "Delhi", "Kerala"];
const HOTEL_TIERS = ["5-star palace", "5-star city", "4-star", "resort", "farmhouse"];
const EVENTS_LIST = ["Haldi", "Mehendi", "Mahila Sangeet", "Baraat", "Pheras", "Reception"];

const FRAME_COUNT = manifest.wizard_frames.length; 
const currentFrame = (index: number) => manifest.wizard_frames[index - 1];

function BackgroundVideoLooper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const requestRef = useRef<number>();
  const lastDrawTimeRef = useRef<number>(0);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new window.Image();
        img.src = currentFrame(i);
        imgs.push(img);
    }
    imagesRef.current = imgs;

    const draw = (time: number) => {
      if (time - lastDrawTimeRef.current >= 33) { // 30 FPS targeting
        const img = imagesRef.current[frameIndexRef.current];
        if (img && img.complete && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx && canvas.width > 0 && canvas.height > 0) {
             const hRatio = canvas.width / img.width;
             const vRatio = canvas.height / img.height;
             const ratio = Math.max(hRatio, vRatio);
             const cx = (canvas.width - img.width * ratio) / 2;
             const cy = (canvas.height - img.height * ratio) / 2;
             ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
          }
        }
        frameIndexRef.current = (frameIndexRef.current + 1) % FRAME_COUNT;
        lastDrawTimeRef.current = time;
      }
      requestRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
       if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
       }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    
    requestRef.current = requestAnimationFrame(draw);
    
    return () => {
       window.removeEventListener("resize", handleResize);
       if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
    </div>
  );
}


export default function Wizard() {
  const router = useRouter();
  const { city, hotelTier, hotelRooms, guestCount, outstationPercentage, events, brideHometown, groomHometown, setDetails } = useBudgetStore();
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = () => {
    // Navigate to library to select decor imagery first, as per requirements
    router.push("/library");
  };

  const slideVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative font-sans text-white">
      <BackgroundVideoLooper />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Button variant="ghost" className="mb-8 text-white/50 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs" onClick={() => router.push('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
        </Button>
      
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-tighter"
          >
            Design Architecture.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-white/60 font-light tracking-wide text-lg"
          >
            Parameterizing your luxury destination profile.
          </motion.p>
        </div>

        <Card className="shadow-2xl bg-black/40 backdrop-blur-2xl border-white/10 rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-black/20 pb-6 pt-8">
            <CardTitle className="text-white text-2xl font-light tracking-wide">Intake Sequence <span className="text-white/40 ml-2 text-sm">// {step} OUT OF 5</span></CardTitle>
            <CardDescription className="flex gap-2 mt-6">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className={`h-1 flex-1 rounded-full ${step >= idx ? 'bg-white' : 'bg-white/10'}`} />
              ))}
            </CardDescription>
          </CardHeader>

          <CardContent className="overflow-hidden relative min-h-[350px] px-8 pt-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xl font-light text-white/90 tracking-wide">Where is the event executing?</Label>
                    <Select value={city} onValueChange={(v) => setDetails({ city: v as string })}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 text-white text-lg focus:ring-white/20">
                        <SelectValue placeholder="Select Destination Target" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {CITIES.map(c => <SelectItem key={c} value={c} className="focus:bg-white/10">{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xl font-light text-white/90 tracking-wide">Specify venue architecture tier</Label>
                    <Select value={hotelTier} onValueChange={(v) => setDetails({ hotelTier: v as string })}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 text-white text-lg focus:ring-white/20">
                        <SelectValue placeholder="Select Global Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {HOTEL_TIERS.map(c => <SelectItem key={c} value={c} className="capitalize focus:bg-white/10">{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <Label className="text-xl font-light text-white/90 tracking-wide">Reserved capacity block</Label>
                    <Input 
                      type="number" className="h-16 bg-white/5 border-white/10 text-white text-lg focus:ring-white/20 placeholder:text-white/20" 
                      placeholder="e.g. 100 Keys"
                      value={hotelRooms || ''} 
                      onChange={(e) => setDetails({ hotelRooms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xl font-light text-white/90 tracking-wide">Total absolute guest payload</Label>
                    <Input 
                      type="number" className="h-16 bg-white/5 border-white/10 text-white text-lg focus:ring-white/20 placeholder:text-white/20" 
                      placeholder="e.g. 450 Guests"
                      value={guestCount || ''} 
                      onChange={(e) => setDetails({ guestCount: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <Label className="text-xl font-light text-white/90 tracking-wide">Outstation logistic ratio (%)</Label>
                    <Input 
                      type="number" min="0" max="100" className="h-16 bg-white/5 border-white/10 text-white text-lg focus:ring-white/20 placeholder:text-white/20" 
                      placeholder="e.g. 60%"
                      value={outstationPercentage || ''} 
                      onChange={(e) => setDetails({ outstationPercentage: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-sm text-white/40 tracking-wide font-light">Sets parameters for flight matrices and internal transport loops.</p>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <Label className="text-xl font-light text-white/90 tracking-wide block mb-4">Event Function Schedule</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {EVENTS_LIST.map((ev) => (
                      <Button
                        key={ev}
                        variant="outline"
                        className={`h-16 justify-center text-lg tracking-wide rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 ${events.includes(ev) ? "bg-white text-black font-semibold border-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "text-white/70"}`}
                        onClick={() => {
                          if (events.includes(ev)) setDetails({ events: events.filter(e => e !== ev) });
                          else setDetails({ events: [...events, ev] });
                        }}
                      >
                        {ev}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xl font-light text-white/90 tracking-wide">Origin Node: Bride</Label>
                    <Input 
                      className="h-16 bg-white/5 border-white/10 text-white text-lg focus:ring-white/20 placeholder:text-white/20" 
                      placeholder="e.g. Mumbai"
                      value={brideHometown} 
                      onChange={(e) => setDetails({ brideHometown: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <Label className="text-xl font-light text-white/90 tracking-wide">Origin Node: Groom</Label>
                    <Input 
                      className="h-16 bg-white/5 border-white/10 text-white text-lg focus:ring-white/20 placeholder:text-white/20" 
                      placeholder="e.g. London"
                      value={groomHometown} 
                      onChange={(e) => setDetails({ groomHometown: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-white/5 bg-black/40 p-8">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 px-8 py-6 rounded-xl uppercase tracking-widest text-xs" onClick={prevStep} disabled={step === 1}>
              Go Back
            </Button>
            {step < 5 ? (
              <Button 
                onClick={nextStep} 
                disabled={
                   (step === 1 && !city) ||
                   (step === 2 && (!hotelTier || hotelRooms <= 0 || isNaN(hotelRooms))) ||
                   (step === 3 && (guestCount <= 0 || isNaN(guestCount) || outstationPercentage < 0 || outstationPercentage > 100 || isNaN(outstationPercentage))) ||
                   (step === 4 && events.length === 0)
                }
                className="bg-white text-black hover:bg-white/90 px-10 py-6 rounded-xl uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Initialize Step {step + 1} →
              </Button>
            ) : (
              <Button 
                onClick={onSubmit} 
                className="bg-white text-black hover:bg-white/90 px-10 py-6 rounded-xl uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                disabled={!brideHometown.trim() || !groomHometown.trim()}
              >
                Launch Inference Array
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
