"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { cn, progressPercent } from "@/lib/utils";

type MapFilter = "active" | "completed" | "over_budget" | "all";

export function USAHeatmap() {
  const store = useStore();
  const [filter, setFilter] = useState<MapFilter>("active");

  const filtered = store.projects.filter((p) => {
    if (filter === "active") return p.status === "active";
    if (filter === "completed") return p.status === "completed";
    if (filter === "over_budget") return p.totalSpent > p.totalBudget && p.totalBudget > 0;
    return true;
  });

  return (
    <div>
      {/* Filter dropdown */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critical / Over Budget</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Unconfirmed</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> On Track</span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as MapFilter)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="active">Active Projects</option>
          <option value="completed">Completed Projects</option>
          <option value="over_budget">Over Budget</option>
          <option value="all">All Projects</option>
        </select>
      </div>

      {/* Map */}
      <div className="relative w-full rounded-xl overflow-hidden bg-slate-100" style={{ paddingBottom: "52%" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg">
          {/* USA states paths - simplified but accurate outlines */}
          <g fill="#d1d5db" stroke="#ffffff" strokeWidth="1.5">
            {/* Washington */ }<path d="M108,56 L118,54 L145,56 L165,55 L168,75 L164,95 L140,93 L115,95 L105,82 Z" />
            {/* Oregon */}<path d="M105,82 L115,95 L140,93 L164,95 L168,125 L160,135 L130,140 L95,130 L90,105 Z" />
            {/* California */}<path d="M90,105 L95,130 L130,140 L135,165 L125,200 L120,235 L110,265 L95,275 L80,260 L75,230 L78,195 L80,160 L82,130 Z" />
            {/* Nevada */}<path d="M130,140 L160,135 L170,130 L175,165 L170,210 L125,200 L135,165 Z" />
            {/* Idaho */}<path d="M164,95 L168,75 L185,65 L200,70 L205,100 L195,125 L185,130 L170,130 L160,135 L168,125 Z" />
            {/* Montana */}<path d="M185,65 L200,55 L260,50 L290,52 L290,82 L270,85 L245,88 L205,100 L200,70 Z" />
            {/* Wyoming */}<path d="M205,100 L245,88 L270,85 L290,82 L290,120 L260,125 L220,128 L205,130 Z" />
            {/* Utah */}<path d="M170,130 L185,130 L195,125 L205,130 L220,128 L220,175 L195,175 L175,165 Z" />
            {/* Colorado */}<path d="M220,128 L260,125 L290,120 L305,120 L305,170 L265,172 L220,175 Z" />
            {/* Arizona */}<path d="M110,265 L120,235 L125,200 L170,210 L175,260 L155,280 L125,285 L110,270 Z" />
            {/* New Mexico */}<path d="M175,260 L170,210 L175,165 L220,175 L265,172 L268,230 L265,270 L230,275 L195,278 Z" />
            {/* North Dakota */}<path d="M290,52 L340,50 L380,48 L385,80 L350,82 L290,82 Z" />
            {/* South Dakota */}<path d="M290,82 L350,82 L385,80 L390,115 L355,118 L290,120 Z" />
            {/* Nebraska */}<path d="M290,120 L355,118 L390,115 L405,120 L420,145 L385,148 L305,150 L305,120 Z" />
            {/* Kansas */}<path d="M305,150 L385,148 L420,145 L425,190 L390,192 L305,195 L305,170 Z" />
            {/* Oklahoma */}<path d="M305,195 L390,192 L425,190 L428,210 L440,210 L440,235 L425,240 L380,240 L340,238 L305,235 L290,225 Z" />
            {/* Texas */}<path d="M265,270 L268,230 L290,225 L305,235 L340,238 L380,240 L425,240 L440,235 L445,265 L435,310 L415,350 L385,370 L360,375 L340,355 L310,340 L285,330 L270,310 L260,290 Z" />
            {/* Minnesota */}<path d="M380,48 L425,45 L430,50 L435,80 L430,100 L395,105 L390,115 L385,80 Z" />
            {/* Iowa */}<path d="M390,115 L395,105 L430,100 L445,105 L465,115 L470,140 L440,145 L420,145 L405,120 Z" />
            {/* Missouri */}<path d="M420,145 L440,145 L470,140 L485,145 L505,165 L500,195 L490,210 L460,205 L445,210 L440,210 L428,210 L425,190 Z" />
            {/* Arkansas */}<path d="M440,210 L445,210 L460,205 L490,210 L492,245 L460,248 L440,235 Z" />
            {/* Louisiana */}<path d="M440,235 L460,248 L492,245 L495,275 L510,290 L505,305 L485,310 L468,305 L455,295 L445,265 Z" />
            {/* Wisconsin */}<path d="M430,50 L435,80 L430,100 L445,105 L465,85 L495,75 L510,60 L505,50 L480,48 L450,45 Z" />
            {/* Michigan */}<path d="M510,60 L530,50 L550,40 L570,50 L580,65 L575,80 L560,90 L540,85 L525,80 L510,75 L505,65 Z" />
            {/* Illinois */}<path d="M465,115 L485,110 L505,105 L515,115 L520,145 L515,170 L505,185 L505,165 L485,145 L470,140 Z" />
            {/* Indiana */}<path d="M515,115 L540,108 L550,115 L555,155 L540,170 L520,170 L520,145 Z" />
            {/* Ohio */}<path d="M550,115 L575,105 L600,100 L620,105 L625,130 L615,150 L590,160 L565,160 L555,155 Z" />
            {/* Kentucky */}<path d="M520,170 L540,170 L565,160 L590,160 L615,150 L635,160 L620,175 L590,190 L560,195 L530,195 L505,195 L505,185 L515,170 Z" />
            {/* Tennessee */}<path d="M505,195 L530,195 L560,195 L590,190 L620,175 L660,170 L670,175 L670,195 L640,198 L530,205 L500,205 Z" />
            {/* Mississippi */}<path d="M490,210 L500,205 L530,205 L535,245 L530,280 L515,290 L505,305 L495,275 L492,245 Z" />
            {/* Alabama */}<path d="M530,205 L560,202 L580,200 L585,250 L580,280 L565,290 L555,285 L540,280 L535,245 Z" />
            {/* Georgia */}<path d="M580,200 L610,195 L640,198 L650,210 L650,255 L640,280 L625,295 L610,290 L595,285 L585,280 L585,250 Z" />
            {/* Florida */}<path d="M585,280 L595,285 L610,290 L625,295 L640,280 L655,290 L665,310 L660,340 L640,370 L625,390 L615,385 L610,360 L605,340 L595,320 L580,305 L570,295 L565,290 Z" />
            {/* South Carolina */}<path d="M640,198 L660,195 L670,195 L685,210 L685,230 L670,245 L650,255 Z" />
            {/* North Carolina */}<path d="M620,175 L660,170 L670,175 L670,195 L685,210 L710,200 L735,185 L730,175 L700,180 L665,172 L640,175 Z" />
            {/* Virginia */}<path d="M635,160 L660,148 L685,140 L715,135 L730,145 L740,158 L730,170 L710,175 L690,180 L665,172 L660,170 L640,175 L620,175 Z" />
            {/* West Virginia */}<path d="M615,150 L635,140 L645,135 L660,148 L635,160 Z" />
            {/* Pennsylvania */}<path d="M625,105 L660,95 L695,88 L720,85 L730,100 L720,115 L700,120 L670,125 L645,130 L630,125 Z" />
            {/* New York */}<path d="M695,88 L720,78 L740,70 L755,55 L775,50 L780,62 L770,72 L760,82 L745,88 L730,95 L730,100 L720,85 Z" />
            {/* New Jersey */}<path d="M730,100 L740,95 L745,110 L738,125 L730,120 L725,110 Z" />
            {/* Maryland/Delaware */}<path d="M700,120 L720,115 L730,120 L738,125 L740,135 L730,145 L715,135 L705,130 Z" />
            {/* Connecticut */}<path d="M760,82 L775,78 L780,88 L768,92 L760,88 Z" />
            {/* Rhode Island */}<path d="M780,78 L788,78 L790,86 L782,88 L780,88 Z" />
            {/* Massachusetts */}<path d="M760,72 L775,68 L790,65 L800,70 L795,78 L780,78 L775,78 L760,82 Z" />
            {/* Vermont */}<path d="M755,55 L762,42 L770,45 L768,60 L760,65 Z" />
            {/* New Hampshire */}<path d="M770,45 L778,40 L782,55 L775,65 L770,62 L768,60 Z" />
            {/* Maine */}<path d="M778,40 L790,25 L805,15 L810,30 L800,45 L790,55 L782,55 Z" />
            {/* Alaska (inset) */}<path d="M75,420 L120,400 L165,410 L180,430 L160,450 L130,455 L100,450 L75,440 Z" />
            {/* Hawaii (inset) */}<path d="M220,420 L230,418 L238,422 L242,430 L235,435 L225,432 Z M245,415 L252,412 L258,418 L254,425 L248,422 Z" />
          </g>
        </svg>

        {/* Project Markers */}
        {filtered.map((project) => {
          const { x, y } = cityToXY(project.address.city, project.address.state, project.address.lat, project.address.lng);
          const overBudget = project.totalSpent > project.totalBudget && project.totalBudget > 0;
          const projectTasks = store.tasks.filter((t) => t.projectId === project.id);
          const hasUnconfirmed = projectTasks.some((t) => !t.orderConfirmed && t.status !== "completed");

          const color = overBudget ? "bg-red-500" : hasUnconfirmed ? "bg-amber-400" : "bg-emerald-400";

          return (
            <Link key={project.id} href={`/projects/${project.id}`}
              className="absolute group" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
              {overBudget && (
                <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping"></span>
              )}
              <span className={cn("relative block w-4 h-4 rounded-full shadow-lg border-2 border-white cursor-pointer transition-transform group-hover:scale-150", color)}></span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                <strong>{project.name}</strong>
                <span className="block text-slate-300">{project.address.city}, {project.address.state}</span>
                {overBudget && <span className="block text-red-300">Over budget!</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Hand-tuned positions for known cities on this specific SVG map
const CITY_COORDS: Record<string, { x: number; y: number }> = {
  "Atlanta,GA":    { x: 64.1, y: 36.7 },
  "Dallas,TX":     { x: 38.5, y: 42.5 },
  "Phoenix,AZ":    { x: 15.1, y: 40.0 },
  "Nashville,TN":  { x: 59.4, y: 32.2 },
  "Charlotte,NC":  { x: 69.3, y: 30.3 },
  "Tampa,FL":      { x: 61.5, y: 50.8 },
  "Denver,CO":     { x: 30.2, y: 24.2 },
  "Miami,FL":      { x: 65.6, y: 61.7 },
  "Houston,TX":    { x: 40.0, y: 50.0 },
  "Chicago,IL":    { x: 52.0, y: 18.0 },
  "Los Angeles,CA":{ x: 10.0, y: 42.0 },
  "New York,NY":   { x: 77.1, y: 14.0 },
  "Seattle,WA":    { x: 13.0, y: 10.0 },
  "Portland,OR":   { x: 12.0, y: 16.0 },
  "Las Vegas,NV":  { x: 14.5, y: 33.0 },
  "San Antonio,TX": { x: 36.0, y: 50.0 },
  "Orlando,FL":    { x: 64.0, y: 53.0 },
  "Jacksonville,FL":{ x: 64.5, y: 46.0 },
  "Memphis,TN":    { x: 50.0, y: 34.0 },
  "Birmingham,AL": { x: 57.0, y: 37.0 },
  "Raleigh,NC":    { x: 72.0, y: 29.0 },
  "Richmond,VA":   { x: 72.0, y: 25.0 },
};

function cityToXY(city: string, state: string, lat: number, lng: number): { x: number; y: number } {
  const key = `${city},${state}`;
  if (CITY_COORDS[key]) return CITY_COORDS[key];
  // Fallback: linear projection calibrated to SVG
  const x = 7.8 + ((lng + 125) / 59) * 76.6;
  const y = 8.3 + ((49.5 - lat) / 25) * 54.2;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}
