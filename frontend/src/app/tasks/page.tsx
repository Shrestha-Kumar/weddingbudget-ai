"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ListTodo } from "lucide-react";

export default function TasksDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finalize wedding date", done: false, timeline: "6 Months Before" },
    { id: 2, text: "Fix budget parameters based on AI Engine", done: false, timeline: "6 Months Before" },
    { id: 3, text: "Create master guest list", done: false, timeline: "6 Months Before" },
    { id: 4, text: "Book primary venue and blocked rooms", done: false, timeline: "6 Months Before" },
    { id: 5, text: "Book wedding photographer portfolio", done: false, timeline: "3 Months Before" },
    { id: 6, text: "Book head caterer / F&B tasting", done: false, timeline: "3 Months Before" },
    { id: 7, text: "Decide on final décor mappings", done: false, timeline: "3 Months Before" },
    { id: 8, text: "Order premium destination attire", done: false, timeline: "3 Months Before" },
    { id: 9, text: "Confirm all vendor bookings + cash advances", done: false, timeline: "1 Month Before" },
    { id: 10, text: "Dispatch luxury invitations", done: false, timeline: "1 Month Before" },
    { id: 11, text: "Draft comprehensive seating charts", done: false, timeline: "1 Month Before" },
    { id: 12, text: "Finalize airport transportation fleet", done: false, timeline: "1 Month Before" }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  useEffect(() => {
    const saved = localStorage.getItem("persistentTasksDB");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("persistentTasksDB", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground">Keep strict timeline compliance spanning the next 12 months of high-end planning.</p>
        </div>

        <section className="pb-32">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold flex items-center gap-3 text-slate-900"><ListTodo className="w-8 h-8 text-slate-800" /> Master Timeline Array</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-12">
              {Array.from(new Set(tasks.map(t => t.timeline))).map(timeline => (
                <div key={timeline} className="relative">
                  <h3 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-widest bg-slate-100 inline-block px-4 py-1.5 rounded-full border border-slate-200">{timeline}</h3>
                  <div className="space-y-3 pl-2">
                    {tasks.filter(t => t.timeline === timeline).map(task => (
                      <div key={task.id} className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200 cursor-pointer group" onClick={() => toggleTask(task.id)}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${task.done ? 'bg-slate-900 text-white' : 'border-2 border-slate-300 bg-slate-50 group-hover:border-slate-400'}`}>
                          {task.done && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-lg transition-all ${task.done ? "text-slate-400 line-through" : "text-slate-800 font-medium group-hover:text-slate-900"}`}>{task.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:w-80">
              <div className="bg-white border text-center border-slate-200 p-6 rounded-2xl shadow-sm sticky top-8">
                <h4 className="font-bold text-slate-900 mb-2">Completion Velocity</h4>
                <div className="text-5xl font-serif font-light text-primary mb-4">{Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)}%</div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                  <div className="bg-slate-900 h-2 rounded-full transition-all duration-1000" style={{ width: `${(tasks.filter(t => t.done).length / tasks.length) * 100}%` }}></div>
                </div>
                <p className="text-sm text-slate-500">You have completed {tasks.filter(t => t.done).length} out of {tasks.length} core master tasks.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
