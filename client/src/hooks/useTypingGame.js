import { useState, useEffect, useCallback } from 'react';

const useTypingGame = (text) => {
  const [charsState, setCharsState] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [phase, setPhase] = useState('start'); 
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  
 
  const [accuracy, setAccuracy] = useState(100);
  const [totalTyped, setTotalTyped] = useState(0);
  const [errors, setErrors] = useState(0);

  // Initialize state
  useEffect(() => {
    const chars = text.split('').map(char => ({ char, status: 'idle' }));
    setCharsState(chars);
    setCurrIndex(0);
    setPhase('start');
    setWpm(0);
    setStartTime(null);
    // Reset stats
    setTotalTyped(0);
    setErrors(0);
    setAccuracy(100);
  }, [text]);

  const handleKeyDown = useCallback((key) => {
    if (phase === 'finished') return;

    if (phase === 'start') {
      setPhase('typing');
      setStartTime(Date.now());
    }

    if (key === 'Backspace') {
      if (currIndex > 0) {
        setCurrIndex((prev) => prev - 1);
        setCharsState((prev) => {
          const newChars = [...prev];
          newChars[currIndex - 1].status = 'idle';
          return newChars;
        });
      }
      return;
    }

    // Ignore non-char keys
    if (key.length !== 1) return;

    // Increment total keystrokes for accuracy calc
    setTotalTyped((prev) => prev + 1);

    const currentCharObj = charsState[currIndex];
    let isCorrect = false;

    if (key === currentCharObj.char) {
      isCorrect = true;
    } else {
      // Track error
      setErrors((prev) => prev + 1);
    }

    // Update Character UI
    setCharsState((prev) => {
      const newChars = [...prev];
      newChars[currIndex].status = isCorrect ? 'correct' : 'incorrect';
      return newChars;
    });

    // --- CHANGED: Always move forward, even on error ---
    const nextIndex = currIndex + 1;
    setCurrIndex(nextIndex);
    
    if (nextIndex >= text.length) {
        setPhase('finished');
    }

  }, [currIndex, phase, text, charsState]);

  // Calculate WPM & Accuracy live
  useEffect(() => {
    if (phase === 'typing' && startTime) {
      const durationInMinutes = (Date.now() - startTime) / 60000;
      const correctChars = charsState.filter(c => c.status === 'correct').length;
      
      // WPM
      const calculatedWpm = Math.round((correctChars / 5) / durationInMinutes);
      setWpm(calculatedWpm < 0 || !isFinite(calculatedWpm) ? 0 : calculatedWpm);

      // Accuracy: (Total - Errors) / Total
      // We use totalTyped which grows with every key press
      if (totalTyped > 0) {
          const rawAcc = ((totalTyped - errors) / totalTyped) * 100;
          setAccuracy(Math.max(0, Math.round(rawAcc)));
      }
    }
  }, [charsState, phase, startTime, totalTyped, errors]);

  return { charsState, currIndex, wpm, accuracy, phase, handleKeyDown };
};

export default useTypingGame;