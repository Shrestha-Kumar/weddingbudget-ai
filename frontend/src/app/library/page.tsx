"use client";

import { Navigation } from "@/components/Navigation";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useState, useEffect } from "react";
import { predictImageCost, fetchLibraryImages } from "@/lib/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IndianRupee } from "lucide-react";


export default function Library() {
  const { events, addDecorImage, removeDecorImage, selectedDecorImages } = useBudgetStore();
  const [activeEvent, setActiveEvent] = useState(events[0] || "Mehendi");
  const [analyzingImage, setAnalyzingImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, any>>({});
  const [dbImages, setDbImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  useEffect(() => {
    const eventKeywordMap: Record<string, string> = {
      "Haldi": "haldi",
      "Mehendi": "mehendi",
      "Mahila Sangeet": "sangeet",
      "Baraat": "baraat",
      "Pheras": "pheras",
      "Reception": "reception"
    };
    const keyword = eventKeywordMap[activeEvent] || "general";
    setIsLoadingImages(true);
    fetchLibraryImages(keyword).then((res) => {
      setDbImages(res.data);
      setIsLoadingImages(false);
    }).catch((err) => {
      console.error(err);
      setIsLoadingImages(false);
    });
  }, [activeEvent]);
  
  const handleAnalyze = async (image: any) => {
    setAnalyzingImage(image.id);
    try {
      const result = await predictImageCost(image.cloudinary_url);
      setPredictions(prev => ({ ...prev, [image.id]: result.data }));
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setAnalyzingImage(null);
    }
  };

  const handleSelect = (image: any) => {
    addDecorImage(activeEvent, { ...image, prediction: predictions[image.id] });
  };
  
  const handleDeselect = (imageId: string) => {
    removeDecorImage(activeEvent, imageId);
  };
  
  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val/10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val/100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Décor Intelligence Library</h1>
          <p className="text-muted-foreground">Select inspirational images for each function to let our AI estimate the décor costs.</p>
        </div>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {events.map(ev => (
            <Button
              key={ev}
              variant={activeEvent === ev ? "default" : "outline"}
              onClick={() => setActiveEvent(ev)}
              className="rounded-full whitespace-nowrap"
            >
              {ev}
              {selectedDecorImages[ev]?.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white/20">{selectedDecorImages[ev].length}</Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingImages ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={`skel-${i}`} className="overflow-hidden shadow-sm">
                <Skeleton className="h-64 w-full rounded-none" />
                <CardContent className="p-4 bg-white space-y-3">
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            dbImages.map((img) => {
              const isSelected = selectedDecorImages[activeEvent]?.some(i => i.id === img.id);
              const prediction = predictions[img.id];
              
              return (
                <Card key={img.id} className={`overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'}`}>
                  <div className="h-64 overflow-hidden relative group bg-slate-200">
                    <img src={prediction?.gradcam_image || img.cloudinary_url} alt={img.alt_text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className="bg-black/60 backdrop-blur-md hover:bg-black/70 border-none">{img.search_query?.split(' ')[0] || 'Decor'}</Badge>
                      {prediction?.gradcam_image && (
                        <Badge className="bg-emerald-500/90 text-white backdrop-blur-md hover:bg-emerald-600 border-none tracking-wide animate-pulse">Grad-CAM Overlay Active</Badge>
                      )}
                    </div>
                  </div>
                
                <CardContent className="p-4 bg-white">
                  {!prediction && analyzingImage !== img.id && (
                    <Button variant="outline" className="w-full" onClick={() => handleAnalyze(img)}>
                      Analyze Décor Cost
                    </Button>
                  )}
                  
                  {analyzingImage === img.id && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-primary animate-pulse font-medium">
                        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
                        AI Model Analyzing Design...
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  )}
                  
                  {prediction && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Cost Setup</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">{formatINR(prediction.cost_low)}</span>
                        <span className="text-sm text-muted-foreground">to</span>
                        <span className="text-lg font-bold text-slate-900">{formatINR(prediction.cost_high)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {Math.round(prediction.confidence * 100)}% Match Confidence
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {prediction && (
                  <CardFooter className="p-4 pt-0 bg-white">
                    {isSelected ? (
                      <Button variant="destructive" className="w-full" onClick={() => handleDeselect(img.id)}>
                        Remove from {activeEvent}
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleSelect(img)}>
                        Select for {activeEvent}
                      </Button>
                    )}
                  </CardFooter>
                )}
              </Card>
            )
          }))}
        </div>
        
      </div>
    </div>
  );
}
