"use client";

import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/api";

export default function AdminLabel() {
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    function_type: "Mehendi",
    style: "Traditional",
    complexity_tier: 3,
    cost_seed_low: 50000,
    cost_seed_mid: 150000,
    cost_seed_high: 250000,
    notes: ""
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/images/unlabeled`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setImages(data.data);
        }
      })
      .catch(e => console.error("Error fetching images", e));
  }, []);

  const handleSkip = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (images.length === 0 || currentIndex >= images.length) return;
    const currentImage = images[currentIndex];
    setSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/admin/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_id: currentImage.id,
          ...formData
        })
      });
      setCurrentIndex(prev => prev + 1);
    } catch (e) {
      console.error(e);
      alert("Failed to save label");
    } finally {
      setSubmitting(false);
    }
  }, [images, currentIndex, formData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") handleSubmit();
      if (e.ctrlKey && e.key === "ArrowRight") handleSkip();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, handleSkip]);

  const currentImage = images[currentIndex];

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-muted-foreground">Loading images or no unlabeled images left...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= images.length) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-muted-foreground">Batch complete! Refresh for more.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-serif text-slate-900">Admin Labelling Interface</h1>
          <div className="text-sm text-muted-foreground">Image {currentIndex + 1} of {images.length}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="overflow-hidden border-2 border-primary/20 bg-black/5 flex items-center justify-center p-2 min-h-[500px]">
              <img 
                src={currentImage.cloudinary_url} 
                alt="Decor" 
                className="max-h-[600px] w-auto max-w-full rounded shadow-md object-contain"
              />
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Training Labels</CardTitle>
                <CardDescription>Assign ground truth costs and categorize the image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Function Type</Label>
                    <Input value={formData.function_type} onChange={e => setFormData({...formData, function_type: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <Input value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Complexity Tier (1 - 5)</Label>
                  <Input type="number" min="1" max="5" value={formData.complexity_tier} onChange={e => setFormData({...formData, complexity_tier: parseInt(e.target.value)})} />
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-y my-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Low Cost Seed (₹)</Label>
                    <Input type="number" value={formData.cost_seed_low} onChange={e => setFormData({...formData, cost_seed_low: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Mid Cost Seed (₹)</Label>
                    <Input type="number" value={formData.cost_seed_mid} onChange={e => setFormData({...formData, cost_seed_mid: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">High Cost Seed (₹)</Label>
                    <Input type="number" value={formData.cost_seed_high} onChange={e => setFormData({...formData, cost_seed_high: parseFloat(e.target.value)})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Input placeholder="Optional annotator notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>

              </CardContent>
              <CardFooter className="flex justify-between border-t bg-slate-50/50 pt-6">
                <Button variant="outline" onClick={handleSkip} title="Ctrl+Right Arrow">
                  Skip Image
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className="bg-primary px-8" title="Ctrl+Enter">
                  {submitting ? "Saving..." : "Save Label & Next"}
                </Button>
              </CardFooter>
            </Card>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground justify-end">
              <span>Shortcuts: <strong>Ctrl + Enter</strong> (Save)</span>
              <span><strong>Ctrl + →</strong> (Skip)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
