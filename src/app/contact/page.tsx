"use client";

import { Camera, Mail, ExternalLink } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 fade-in">
      <div className="text-center mb-8">
        <img src="/ProjectManagerLogo.svg" alt="Reinnovation Project Manager" width={80} height={80} className="mx-auto mb-4 rounded-2xl" />
        <h1 className="text-3xl font-bold text-slate-900">Reinnovation Homes</h1>
        <p className="text-slate-500 mt-2">Project Manager</p>
      </div>

      <div className="stat-card space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Get In Touch</h2>
          <p className="text-sm text-slate-600 mb-6">
            Have questions about FlipCRM or want to learn more about how we manage fix-and-flip projects? Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="space-y-4">
          <a href="mailto:info@reinnovationhomes.com"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition group">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Mail size={22} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 group-hover:text-blue-700">Email Us</p>
              <p className="text-sm text-blue-600">info@reinnovationhomes.com</p>
            </div>
            <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
          </a>

          <a href="https://www.instagram.com/reinnovationhomes/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 transition group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Camera size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 group-hover:text-pink-700">Instagram</p>
              <p className="text-sm text-pink-600">@reinnovationhomes</p>
            </div>
            <ExternalLink size={16} className="text-slate-400 group-hover:text-pink-500" />
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
