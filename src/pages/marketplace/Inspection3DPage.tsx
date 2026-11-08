import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  RotateCw, 
  Maximize2,
  Tag,
  HelpCircle
} from 'lucide-react';
import { ThreeInspectionStudio, ModelType } from '../../components/three/ThreeInspectionStudio';

export const Inspection3DPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialModel = (searchParams.get('model') as ModelType) || 'phone';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WebGL 3D Studio PBR Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            3D Inspection Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Interactive peer-to-peer verification with studio-grade PBR reflections, multi-axis orbit, and exploded mechanical separation.
          </p>
        </div>

        <Link
          to="/explore"
          className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          Browse Marketplace Listings <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main 3D Viewport Frame */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
        <ThreeInspectionStudio initialModel={initialModel} />
      </div>

      {/* Feature Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Exploded Mechanical View
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Glide the exploded view slider in the bottom dock to disengage external plates, inspect camera sensors, watch rotors, and internal build authenticity.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Studio PBR Environment Reflection
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Procedural HDR environment maps generated via Three.js RoomEnvironment reveal brushed metallic textures, sapphire reflections, and bevel chamfers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Zero-Occlusion Bottom Dock
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All controls are concentrated into a collapsible horizontal dock pinned to the bottom center, leaving the central 3D viewport 100% unobstructed.
          </p>
        </div>
      </div>
    </div>
  );
};
