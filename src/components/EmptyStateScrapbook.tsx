'use client';

import React, { useState, useEffect } from 'react';
import { FREE_WILL_PROMPTS } from '@/lib/constants';
import { Sparkles, Compass, RefreshCw } from 'lucide-react';

interface EmptyStateScrapbookProps {
  title?: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyStateScrapbook: React.FC<EmptyStateScrapbookProps> = ({
  title = "A Blank Scrapbook Page",
  subtitle = "No scheduled commitments found for this view.",
  actionButton,
}) => {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    // Pick random initial prompt
    const randomIdx = Math.floor(Math.random() * FREE_WILL_PROMPTS.length);
    setPromptIndex(randomIdx);
  }, []);

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % FREE_WILL_PROMPTS.length);
  };

  const currentPrompt = FREE_WILL_PROMPTS[promptIndex];

  return (
    <div className="relative w-full max-w-xl mx-auto my-8 p-6 sm:p-10 bg-[#fdfaf2] border-2 border-dashed border-[#d9ceb7] rounded-sm text-neutral-800 shadow-lg text-center select-none overflow-hidden">
      
      {/* Decorative Washi Tape Strips on corners */}
      <div 
        className="absolute -top-3 -left-3 w-20 h-6 bg-[#f3da90]/80 shadow-xs rotate-[-35deg] pointer-events-none"
        style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
      />
      <div 
        className="absolute -top-3 -right-3 w-20 h-6 bg-[#f4a9a3]/80 shadow-xs rotate-[35deg] pointer-events-none"
        style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
      />

      {/* Push pin */}
      <div className="push-pin" />

      {/* Empty page graphic doodle */}
      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-[#f4ecd9] border border-[#dfd3bc] rounded-full flex items-center justify-center mb-4 shadow-inner">
        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#c93b2b]/70" />
      </div>

      <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-neutral-600 font-sans-ui mb-6 max-w-md mx-auto">
        {subtitle}
      </p>

      {/* Free Will Prompt module as specified in read.md Section 7.3 */}
      <div className="relative p-5 bg-[#fffef9] border border-[#e8ddc2] rounded-xs shadow-sm max-w-md mx-auto text-left mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="stamp-urgent text-[9px] bg-amber-50 border-amber-500 text-amber-900">
            Free Will Prompt
          </span>
          <button
            onClick={handleNextPrompt}
            title="Get another spontaneous idea"
            className="text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-sans-ui"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Shuffle</span>
          </button>
        </div>

        <p className="font-handwritten text-xl sm:text-2xl text-neutral-900 leading-snug">
          &ldquo;{currentPrompt}&rdquo;
        </p>
      </div>

      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="px-5 py-2.5 bg-[#c93b2b] hover:bg-[#b02e20] text-amber-100 text-xs sm:text-sm font-bold rounded-sm shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>{actionButton.label}</span>
        </button>
      )}

    </div>
  );
};
