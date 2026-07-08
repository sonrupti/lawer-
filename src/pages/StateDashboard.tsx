import { useState } from 'react';
import { ArrowLeft, Users, Building2, TrendingUp, BarChart, Scale, FileText, ChevronRight } from 'lucide-react';
import type { Page } from '../App';
import LawyerCard from '../components/LawyerCard';
import { lawyers } from '../data/lawyers';

interface Props {
  stateId: string;
  navigate: (page: Page, query?: string) => void;
}

export default function StateDashboard({ stateId, navigate }: Props) {
  // Mock data tailored for the state
  const stateName = stateId === "OR" ? "Odisha" : stateId; // fallback
  
  const topLawyers = lawyers.slice(0, 4); // mock top lawyers
  
  const stats = [
    { label: "Pending Cases", value: "3.2M", icon: <FileText size={18} /> },
    { label: "Disposed Cases", value: "8.1M", icon: <CheckCircle size={18} /> },
    { label: "Avg Disposal Time", value: "2.4 Yrs", icon: <Clock size={18} /> },
    { label: "Active Advocates", value: "45,210", icon: <Users size={18} /> },
  ];

  const courts = [
    { name: `${stateName} High Court`, type: "High Court", cases: "452K", trend: "+12%" },
    { name: "Cuttack District Court", type: "District Court", cases: "125K", trend: "+5%" },
    { name: "Bhubaneswar Family Court", type: "Family Court", cases: "45K", trend: "+2%" },
    { name: "Commercial Court", type: "Special", cases: "12K", trend: "-1%" },
  ];

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300 pb-20">
      
      {/* Header Area */}
      <div className="bg-surface border-b border-border relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back to National View
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-accent text-xs font-semibold tracking-widest uppercase">State Analytics</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-text tracking-tight">
                {stateName} <span className="text-text-muted font-light">Legal Dashboard</span>
              </h1>
            </div>
            
            <div className="flex gap-3">
              <button className="glass-card px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface-2 transition-colors">
                Download Report
              </button>
              <button 
                onClick={() => navigate('search', stateId)}
                className="bg-primary text-bg px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Find Advocate in {stateName}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        
        {/* KPI Grid */}
        <section>
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">State Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card glass-card-hover p-6">
                <div className="flex items-center gap-3 text-primary mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">{stat.icon}</div>
                  <span className="text-sm font-semibold text-text-muted">{stat.label}</span>
                </div>
                <div className="text-3xl font-black text-text">{stat.value}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Lawyers Section */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text tracking-tight flex items-center gap-2">
                <TrendingUp className="text-accent" /> Trending Advocates
              </h2>
              <button 
                onClick={() => navigate('search', stateId)}
                className="text-sm font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1"
              >
                View all <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {topLawyers.map(lawyer => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} navigate={navigate} />
              ))}
            </div>
          </section>

          {/* Court Explorer Section */}
          <section className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-text tracking-tight flex items-center gap-2 mb-6">
              <Building2 className="text-secondary" /> Court Explorer
            </h2>
            <div className="glass-card p-1">
              <div className="flex flex-col">
                {courts.map((court, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 border-b border-border/50 last:border-0 hover:bg-surface-2/50 transition-colors cursor-pointer group"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">{court.name}</h3>
                      <span className="text-xs text-text-muted">{court.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-text">{court.cases}</div>
                      <div className={`text-xs ${court.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                        {court.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-border/50 bg-surface/50">
                <button 
                  onClick={() => navigate('court')}
                  className="text-xs font-bold text-primary uppercase tracking-widest hover:text-accent transition-colors"
                >
                  View Full Analytics
                </button>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

// Temporary inline icons to avoid missing imports
function CheckCircle({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
}
function Clock({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
}
