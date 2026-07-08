import { useState } from "react";

// A simplified, abstract, blocky representation of India for the MVP
// This fits the modern, clean (Linear/Vercel) aesthetic better than a complex geographic SVG without a proper vector file.
const STATES = [
  { id: "AP", name: "Andhra Pradesh", cx: 400, cy: 550 },
  { id: "AR", name: "Arunachal Pradesh", cx: 750, cy: 200 },
  { id: "AS", name: "Assam", cx: 700, cy: 250 },
  { id: "BR", name: "Bihar", cx: 500, cy: 250 },
  { id: "CT", name: "Chhattisgarh", cx: 400, cy: 400 },
  { id: "GA", name: "Goa", cx: 200, cy: 600 },
  { id: "GJ", name: "Gujarat", cx: 150, cy: 350 },
  { id: "HR", name: "Haryana", cx: 250, cy: 150 },
  { id: "HP", name: "Himachal Pradesh", cx: 250, cy: 80 },
  { id: "JH", name: "Jharkhand", cx: 500, cy: 350 },
  { id: "KA", name: "Karnataka", cx: 250, cy: 650 },
  { id: "KL", name: "Kerala", cx: 250, cy: 800 },
  { id: "MP", name: "Madhya Pradesh", cx: 300, cy: 350 },
  { id: "MH", name: "Maharashtra", cx: 250, cy: 500 },
  { id: "MN", name: "Manipur", cx: 750, cy: 300 },
  { id: "ML", name: "Meghalaya", cx: 650, cy: 280 },
  { id: "MZ", name: "Mizoram", cx: 720, cy: 350 },
  { id: "NL", name: "Nagaland", cx: 780, cy: 250 },
  { id: "OR", name: "Odisha", cx: 480, cy: 450 }, // Example state
  { id: "PB", name: "Punjab", cx: 200, cy: 100 },
  { id: "RJ", name: "Rajasthan", cx: 150, cy: 220 },
  { id: "SK", name: "Sikkim", cx: 600, cy: 200 },
  { id: "TN", name: "Tamil Nadu", cx: 320, cy: 750 },
  { id: "TG", name: "Telangana", cx: 350, cy: 550 },
  { id: "TR", name: "Tripura", cx: 650, cy: 350 },
  { id: "UP", name: "Uttar Pradesh", cx: 400, cy: 200 },
  { id: "UT", name: "Uttarakhand", cx: 350, cy: 150 },
  { id: "WB", name: "West Bengal", cx: 580, cy: 350 },
  // UTs
  { id: "AN", name: "Andaman and Nicobar", cx: 700, cy: 700, isUT: true },
  { id: "CH", name: "Chandigarh", cx: 220, cy: 120, isUT: true },
  { id: "DN", name: "Dadra and Nagar Haveli and Daman and Diu", cx: 180, cy: 450, isUT: true },
  { id: "LD", name: "Lakshadweep", cx: 150, cy: 750, isUT: true },
  { id: "DL", name: "Delhi", cx: 300, cy: 180, isUT: true },
  { id: "PY", name: "Puducherry", cx: 350, cy: 700, isUT: true },
  { id: "JK", name: "Jammu and Kashmir", cx: 200, cy: 30, isUT: true },
  { id: "LA", name: "Ladakh", cx: 280, cy: 20, isUT: true },
];

export default function IndiaMap({ navigate }) {
  const [hoveredState, setHoveredState] = useState(null);

  const handleStateClick = (stateId) => {
    // Pass the stateId to the state dashboard
    navigate('state', stateId);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-text">Explore Legal Analytics by Region</h2>
        <p className="mt-2 text-sm text-text-muted">Select a State or Union Territory to view localized court performance.</p>
      </div>
      
      {/* SVG Map Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl glass-card bg-surface-2/30 p-8 shadow-2xl">
        {/* Dynamic Background Glow representing the selected/hovered state */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-surface-2/10 to-transparent transition-all duration-500" />
        
        <svg 
          viewBox="0 0 900 900" 
          className="h-full w-full drop-shadow-lg transition-transform duration-700 ease-out hover:scale-[1.02]"
        >
          {STATES.map((state) => {
            const isHovered = hoveredState === state.id;
            return (
              <g
                key={state.id}
                transform={`translate(${state.cx}, ${state.cy})`}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(state.id)}
                className="cursor-pointer transition-all duration-300"
                style={{
                  transformOrigin: `${state.cx}px ${state.cy}px`
                }}
              >
                {/* State Node (Hexagon / Circle representation for modern UI) */}
                <circle 
                  r={isHovered ? 24 : 16} 
                  className={`
                    transition-all duration-300 stroke-2
                    ${isHovered 
                      ? "fill-primary stroke-primary shadow-glow" 
                      : state.isUT 
                        ? "fill-surface border-border stroke-accent/50" 
                        : "fill-surface border-border stroke-border hover:stroke-primary/50"}
                  `}
                />
                
                {/* Label */}
                <text
                  y={isHovered ? 38 : 30}
                  textAnchor="middle"
                  className={`
                    text-[11px] font-bold tracking-wider transition-all duration-300
                    ${isHovered ? "fill-text opacity-100" : "fill-text-muted opacity-70"}
                  `}
                >
                  {state.name}
                </text>
                
                {/* Ping Animation on Hover */}
                {isHovered && (
                  <circle 
                    r="24"
                    className="fill-none stroke-primary/50 stroke-[3px] animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info panel for selected state (Hover preview) */}
      <div className={`
        absolute bottom-8 right-8 glass-card p-6 w-64 transition-all duration-500 transform
        ${hoveredState ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}
      `}>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-sm font-bold text-text uppercase tracking-widest">
            {STATES.find(s => s.id === hoveredState)?.name}
          </h3>
        </div>
        <p className="text-xs text-text-muted">
          Click to view District Courts, High Court performance, and Top Ranked Lawyers.
        </p>
      </div>
    </div>
  );
}
