import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';

interface RetroDialogProps {
  speaker: string;
  avatar?: string;
  lines: string[];
  onFinish: () => void;
  accentColor?: string;
}

export const RetroDialog: React.FC<RetroDialogProps> = ({
  speaker,
  avatar,
  lines,
  onFinish,
  accentColor = '#ff70a6',
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const fullText = lines[currentLineIndex] || '';

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        if (charIndex % 3 === 0) {
          sound.playBlip();
        }
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [currentLineIndex, fullText]);

  const handleNext = () => {
    if (isTyping) {
      // Instant reveal
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }

    if (currentLineIndex < lines.length - 1) {
      sound.playJump();
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      sound.playJump();
      onFinish();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, currentLineIndex, lines]);

  return (
    <div
      onClick={handleNext}
      className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[700px] z-50 cursor-pointer"
    >
      <div className="bg-[#1b0a2a]/95 text-pink-100 p-4 md:p-5 pixel-corners pixel-border shadow-2xl relative">
        {/* Speaker Name Tag */}
        <div
          className="absolute -top-4 left-6 px-3 py-1 font-pixel text-xs text-white uppercase shadow-md flex items-center gap-1.5"
          style={{ backgroundColor: accentColor }}
        >
          {avatar && <span>{avatar}</span>}
          <span>{speaker}</span>
        </div>

        {/* Content Box */}
        <div className="min-h-[70px] md:min-h-[85px] flex items-start gap-4 pt-2">
          {avatar && (
            <div className="hidden sm:flex w-12 h-12 bg-pink-950/60 border-2 border-pink-500/50 items-center justify-center text-2xl shrink-0">
              {avatar}
            </div>
          )}
          <div className="flex-1 font-retro text-2xl md:text-3xl leading-snug tracking-wider text-pink-50">
            {displayedText}
          </div>
        </div>

        {/* Next Prompt */}
        <div className="mt-2 flex items-center justify-between text-[10px] md:text-xs text-pink-300/80 font-pixel">
          <span className="opacity-75">
            Page {currentLineIndex + 1}/{lines.length}
          </span>
          <span className="animate-pulse flex items-center gap-1 text-yellow-300">
            <span>[Tap / Space]</span>
            <span>▼</span>
          </span>
        </div>
      </div>
    </div>
  );
};
