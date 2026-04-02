"use client";

import { HeatmapPoint } from "@/lib/types";
import Link from "next/link";

// Simple USA map with state-positioned property bubbles
// Uses approximate x,y positions based on lat/lng mapped to a viewport

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  // Approximate mercator projection for CONUS
  const minLat = 24.5, maxLat = 49.5, minLng = -125, maxLng = -66;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

export function USAHeatmap({ points }: { points: HeatmapPoint[] }) {
  return (
    <div className="relative w-full" style={{ paddingBottom: "55%" }}>
      {/* Background map silhouette */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <svg viewBox="0 0 960 600" className="w-full h-full opacity-[0.07]" fill="currentColor">
          {/* Simplified US outline */}
          <path d="M230,480 L200,450 L180,400 L160,350 L150,300 L160,250 L180,200 L220,160 L280,130 L340,110 L400,100 L460,95 L520,100 L580,95 L640,100 L700,110 L750,130 L790,160 L810,200 L820,240 L830,280 L850,320 L860,360 L850,400 L830,440 L800,470 L760,490 L720,500 L680,510 L640,520 L600,525 L560,520 L520,510 L480,505 L440,510 L400,520 L360,530 L320,525 L280,510 L250,495 Z" />
        </svg>

        {/* State grid lines for visual effect */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
      </div>

      {/* Property Bubbles */}
      {points.map((point) => {
        const { x, y } = latLngToXY(point.lat, point.lng);
        const color = point.hasHotTasks
          ? "bg-red-500"
          : point.hasUnconfirmedOrders
          ? "bg-amber-400"
          : "bg-emerald-400";
        const size = point.hasHotTasks ? "w-5 h-5" : "w-4 h-4";

        return (
          <Link
            key={point.id}
            href={`/projects/${point.projectId}`}
            className="absolute group"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
          >
            {/* Pulse ring for hot tasks */}
            {point.hasHotTasks && (
              <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping"></span>
            )}
            <span className={`relative block ${size} rounded-full ${color} shadow-lg border-2 border-white cursor-pointer transition-transform group-hover:scale-150`}></span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
              {point.label}
              {point.hasHotTasks && <span className="block text-red-300 text-[10px]">Critical tasks today</span>}
              {point.hasUnconfirmedOrders && <span className="block text-amber-300 text-[10px]">Unconfirmed orders</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
