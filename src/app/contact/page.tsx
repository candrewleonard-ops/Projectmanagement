"use client";

import { Camera, Mail, ExternalLink, Globe, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 fade-in">
      <div className="text-center mb-8">
        <div className="inline-block p-1 rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 mb-4">
          <img src="/ProjectManagerLogo.svg" alt="Reinnovation" width={80} height={80} className="rounded-2xl bg-white p-2" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-violet-700 bg-clip-text text-transparent">Reinnovation Homes</h1>
        <p className="text-slate-500 mt-2">Project Manager &middot; Fix &amp; Flip CRM</p>
      </div>

      <div className="stat-card space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <MessageCircle size={18} className="text-blue-500" /> Get In Touch
          </h2>
          <p className="text-sm text-slate-600">
            Have questions about FlipCRM or want to learn more about how we manage fix-and-flip projects? Reach out through any of the channels below.
          </p>
        </div>

        <div className="space-y-3">
          <a href="mailto:info@reinnovationhomes.com"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Mail size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 group-hover:text-blue-700">Email Us</p>
              <p className="text-sm text-blue-600">info@reinnovationhomes.com</p>
            </div>
            <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
          </a>

          <a href="https://www.instagram.com/reinnovationhomes/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-pink-100 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Camera size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 group-hover:text-pink-700">Instagram</p>
              <p className="text-sm text-pink-600">@reinnovationhomes</p>
            </div>
            <ExternalLink size={16} className="text-slate-400 group-hover:text-pink-500" />
          </a>

          <a href="https://reinnovationhomes.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-100 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Globe size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 group-hover:text-emerald-700">Website</p>
              <p className="text-sm text-emerald-600">reinnovationhomes.com</p>
            </div>
            <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-500" />
          </a>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            Reinnovation Homes &middot; Fix &amp; Flip Project Management
          </p>
        </div>
      </div>
    </div>
  );
}
