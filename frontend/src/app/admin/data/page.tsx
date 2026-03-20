"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/lib/api";

export default function AdminData() {
  const [rates, setRates] = useState<any>({ fnb: [], bar: [], logistics: [] });
  const [artists, setArtists] = useState<any[]>([]);
  const [newArtist, setNewArtist] = useState({ category: "", tier: 1, fee_low: 0, fee_high: 0 });

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/rates`)
      .then(r => r.json())
      .then(d => { if (d.status === "success") setRates(d.data); });
      
    fetch(`${API_BASE_URL}/admin/artists`)
      .then(r => r.json())
      .then(d => { if (d.status === "success") setArtists(d.data); });
  }, []);

  const handleAddArtist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/artists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtist)
      });
      const d = await res.json();
      if (d.status === "success" && d.data) {
        setArtists([...artists, d.data]);
        setNewArtist({ category: "", tier: 1, fee_low: 0, fee_high: 0 });
      }
    } catch (e) {
      alert("Failed to add artist");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-slate-900 mb-2">Platform Data Configuration</h1>
        <p className="text-muted-foreground mb-8">Maintain fixed costs, artist rate cards, and F&B base rules.</p>
        
        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="artists">Artists & Entertainment</TabsTrigger>
            <TabsTrigger value="logistics">Logistics Rules</TabsTrigger>
            <TabsTrigger value="fnb">Food & Beverage Rates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="artists">
            <Card>
              <CardHeader>
                <CardTitle>Artists Database</CardTitle>
                <CardDescription>Manage rate ranges for entertainment tiers.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-slate-50 border rounded-lg flex gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-xs">Category</label>
                    <Input value={newArtist.category} onChange={e => setNewArtist({...newArtist, category: e.target.value})} placeholder="e.g. Singer" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Tier (1-4)</label>
                    <Input type="number" min="1" max="4" value={newArtist.tier} onChange={e => setNewArtist({...newArtist, tier: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Fee Low (₹)</label>
                    <Input type="number" value={newArtist.fee_low} onChange={e => setNewArtist({...newArtist, fee_low: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Fee High (₹)</label>
                    <Input type="number" value={newArtist.fee_high} onChange={e => setNewArtist({...newArtist, fee_high: parseInt(e.target.value)})} />
                  </div>
                  <Button onClick={handleAddArtist} className="bg-primary">Add Artist Tier</Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Fee Range (₹)</TableHead>
                      <TableHead>Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artists.map((a: any) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.category}</TableCell>
                        <TableCell>{a.tier}</TableCell>
                        <TableCell>₹{a.fee_low.toLocaleString()} - ₹{a.fee_high.toLocaleString()}</TableCell>
                        <TableCell>{a.is_active ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logistics">
            <Card>
              <CardHeader>
                <CardTitle>Logistics Config</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guests per Innova</TableHead>
                      <TableHead>Min Cost / KM</TableHead>
                      <TableHead>Max Cost / KM</TableHead>
                      <TableHead>Driver Allowance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates.logistics.map((l: any) => (
                      <TableRow key={l.id}>
                        <TableCell>{l.guests_per_innova}</TableCell>
                        <TableCell>₹{l.innova_cost_per_km_min}</TableCell>
                        <TableCell>₹{l.innova_cost_per_km_max}</TableCell>
                        <TableCell>₹{l.driver_allowance_per_day}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fnb">
            <Card>
              <CardHeader>
                <CardTitle>Food & Beverage Per Head Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meal Type</TableHead>
                      <TableHead>Venue Tier</TableHead>
                      <TableHead>Cost Low (₹/head)</TableHead>
                      <TableHead>Cost High (₹/head)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates.fnb.map((f: any) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">{f.meal_type}</TableCell>
                        <TableCell>{f.venue_tier}</TableCell>
                        <TableCell>₹{f.cost_per_head_low.toLocaleString()}</TableCell>
                        <TableCell>₹{f.cost_per_head_high.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
