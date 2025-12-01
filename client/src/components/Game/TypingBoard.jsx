import React, { useEffect, useRef } from 'react';
import useTypingGame from '../../hooks/useTypingGame';

const Character = ({ char, status, isActive }) => {
  let colorClass = 'text-monke-text'; 
  if (status === 'correct') colorClass = 'text-monke-light';
  if (status === 'incorrect') colorClass = 'text-monke-error border-b-2 border-monke-error';

  return (
    <span className={`relative text-2xl md:text-3xl font-mono leading-relaxed ${colorClass}`}>
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
  // Destructure accuracy from the hook
  const { charsState, currIndex, wpm, accuracy, phase, handleKeyDown } = useTypingGame(text);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update Parent with WPM AND Accuracy
  useEffect(() => {
    const progress = text.length > 0 ? Math.round((currIndex / text.length) * 100) : 0;
    
    if (onStatsUpdate) {
      onStatsUpdate(wpm, progress, accuracy); // Passing accuracy now
    }
  }, [wpm, currIndex, accuracy, text.length, onStatsUpdate]); 

  const handleBoardClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[50vh] outline-none w-full"
      onClick={handleBoardClick}
    >
      <div className="flex w-full max-w-4xl justify-between mb-4 text-monke-main text-2xl font-mono font-bold">
        <span>{phase === 'finished' ? 'FINISHED' : 'TYPING...'}</span>
        <div className="flex gap-6">
            <span className="text-monke-text text-lg">{accuracy}% acc</span>
            <span>{wpm} WPM</span>
        </div>
      </div>

      <div className="relative w-full max-w-5xl p-8 bg-transparent rounded-lg cursor-text focus:outline-none">
        <input 
          ref={inputRef}
          type="text" 
          className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default z-0"
          onKeyDown={(e) => handleKeyDown(e.key)}
          autoFocus
          autoComplete="off"
        />
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

      <div className="mt-12 text-monke-text opacity-50 text-sm font-mono">
        Click here or press any key to focus
      </div>
    </div>
  );
};

export default TypingBoard;