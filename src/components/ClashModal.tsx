'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AlertTriangle, Clock, Calendar, Check, X } from 'lucide-react';

export const ClashModal: React.FC = () => {
  const { clashInfo, resolveClash } = useApp();

  if (!clashInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#fffdf5] text-neutral-900 rounded-sm shadow-2xl border-4 border-[#eedc82] p-6 text-center select-none"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
        }}
      >
        {/* Yellow disclaimer banner motif */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#fef08a] border-2 border-[#eab308] text-[#854d0e] rounded-xs shadow-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rotate-[-1deg]">
          <AlertTriangle className="w-4 h-4 text-[#ca8a04]" />
          <span>Schedule Conflict Warning</span>
        </div>

        {/* Yellow disclaimer sign */}
        <div className="mx-auto w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-300 mt-3 mb-4 shadow-inner">
          <AlertTriangle className="w-8 h-8 text-amber-600 animate-bounce" />
        </div>

        {/* Required copy from read.md */}
        <h3 className="font-editorial text-xl font-bold text-neutral-900 mb-2">
          This clashes with your scheduled event/class.
        </h3>

        <p className="text-xs text-neutral-600 mb-4 font-sans-ui">
          You are attempting to add <span className="font-bold text-neutral-800">&ldquo;{clashInfo.event.event_name}&rdquo;</span>, but your planner already has a conflicting commitment:
        </p>

        {/* Conflict Details Card */}
        <div className="p-3 bg-[#f7f2e4] border border-[#e8ddc2] rounded-xs text-left mb-6 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Conflict: {clashInfo.conflictTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>Time: {clashInfo.conflictTime}</span>
          </div>
        </div>

        {/* Exact Two Buttons from read.md: "Continue Anyway" and "Nevermind" */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => resolveClash(false)}
            className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs sm:text-sm font-semibold rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4 text-neutral-500" />
            <span>Nevermind</span>
          </button>

          <button
            onClick={() => resolveClash(true)}
            className="px-4 py-2.5 bg-[#c93b2b] hover:bg-[#b02e20] text-amber-100 text-xs sm:text-sm font-bold rounded-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-amber-200" />
            <span>Continue Anyway</span>
          </button>
        </div>

        <p className="mt-3 text-[10px] text-neutral-500 font-handwritten text-sm">
          your academic calendar remains editable under Profile
        </p>
      </div>
    </div>
  );
};
