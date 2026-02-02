import React, { useEffect, useRef, useState } from 'react';
import useTypingGame from '../../hooks/useTypingGame';

const Character = ({ char, status, isActive }) => {
  let colorClass = 'text-monke-text'; 
  if (status === 'correct') colorClass = 'text-monke-light';
  if (status === 'incorrect') colorClass = 'text-monke-error border-b-2 border-monke-error';

  return (
    <span className={`relative text-xl md:text-3xl font-mono leading-relaxed ${colorClass}`}>
      {isActive && (
        <span 
          className="absolute -left-0.5 -top-1 bottom-0 w-1 bg-monke-caret animate-pulse z-10 rounded-full"
          style={{ content: '""' }}
        ></span>
      )}
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
};

const TypingBoard = ({ text, onStatsUpdate }) => {
  const { charsState, currIndex, wpm, accuracy, phase, handleKeyDown } = useTypingGame(text);
  const inputRef = useRef(null);
  
  // CONTROLLED INPUT STATE
  // We need this to reliably clear the input after every character
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update Parent with WPM AND Accuracy
  useEffect(() => {
    const progress = text.length > 0 ? Math.round((currIndex / text.length) * 100) : 0;
    
    if (onStatsUpdate) {
      onStatsUpdate(wpm, progress, accuracy); 
    }
  }, [wpm, currIndex, accuracy, text.length, onStatsUpdate]); 

  const handleBoardClick = () => {
    inputRef.current?.focus();
  };

  // --- MOBILE INPUT LOGIC ---
  
  // 1. Handle Letters via onChange (Reliable on Android/iOS)
  const handleInputChange = (e) => {
    const val = e.target.value;
    
    // If the user added a character
    if (val.length > 0) {
        // Get the last character typed
        const lastChar = val.slice(-1);
        handleKeyDown(lastChar);
        
        // Reset input to empty immediately so we can capture the next char
        setInputValue("");
    }
  };

  // 2. Handle Special Keys via onKeyDown
  const handleInputKeyDown = (e) => {
    // We only use onKeyDown for Backspace because onChange 
    // doesn't fire when deleting from an empty string.
    if (e.key === 'Backspace') {
        handleKeyDown('Backspace');
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[50vh] outline-none w-full"
      onClick={handleBoardClick}
    >
      {/* Stats Header */}
      <div className="flex w-full max-w-4xl justify-between mb-4 text-monke-main text-lg md:text-2xl font-mono font-bold px-2">
        <span>{phase === 'finished' ? 'FINISHED' : 'TYPING...'}</span>
        <div className="flex gap-4 md:gap-6">
            <span className="text-monke-text text-base md:text-lg">{accuracy}% acc</span>
            <span>{wpm} WPM</span>
        </div>
      </div>

      {/* Typing Area */}
      <div className="relative w-full max-w-5xl p-4 md:p-8 bg-transparent rounded-lg cursor-text focus:outline-none">
        
        {/* THE HIDDEN INPUT */}
        {/* We keep it covering the text (opacity 0) so tapping text focuses it */}
        <input 
          ref={inputRef}
          type="text" 
          value={inputValue}
          className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default z-0"
          
          // Logic mapping
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          
          // Essential for Mobile Experience
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {/* Visual Text Rendering */}
        <div className="flex flex-wrap select-none break-all pointer-events-none z-10 relative">
          {charsState.map((item, index) => (
            <Character 
              key={index} 
              char={item.char} 
              status={item.status} 
              isActive={index === currIndex && phase !== 'finished'} 
            />
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-12 text-monke-text opacity-50 text-xs md:text-sm font-mono text-center">
        {/* Mobile-friendly instructions */}
        <span className="hidden md:inline">Click here or press any key to focus</span>
        <span className="md:hidden">Tap text to open keyboard</span>
      </div>
    </div>
  );
};

export default TypingBoard;