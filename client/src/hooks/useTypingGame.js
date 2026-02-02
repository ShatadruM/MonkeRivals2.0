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

    if (key.length !== 1) return;

    setTotalTyped((prev) => prev + 1);

    const currentCharObj = charsState[currIndex];
    let isCorrect = false;

    if (key === currentCharObj.char) {
      isCorrect = true;
    } else {
      setErrors((prev) => prev + 1);
    }

    setCharsState((prev) => {
      const newChars = [...prev];
      newChars[currIndex].status = isCorrect ? 'correct' : 'incorrect';
      return newChars;
    });

    const nextIndex = currIndex + 1;
    setCurrIndex(nextIndex);
    
    if (nextIndex >= text.length) {
        setPhase('finished');
    }

  }, [currIndex, phase, text, charsState]);

  // --- MODIFIED EFFECT ---
  useEffect(() => {
    if (phase === 'typing' && startTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - startTime; // in ms

      // 1. Update Accuracy (Time Independent)
      // We calculate this immediately so the user sees feedback instantly
      if (totalTyped > 0) {
        const rawAcc = ((totalTyped - errors) / totalTyped) * 100;
        setAccuracy(Math.max(0, Math.round(rawAcc)));
      }

      // 2. Update WPM (Time Dependent)
      // FIX: If less than 1 second has passed, don't calculate WPM.
      // This prevents dividing by tiny numbers (0.001s) which causes the 1000+ WPM spike.
      if (timeElapsed < 1000) {
        return; 
      }

      const durationInMinutes = timeElapsed / 60000;
      const correctChars = charsState.filter(c => c.status === 'correct').length;
      
      const calculatedWpm = Math.round((correctChars / 5) / durationInMinutes);
      setWpm(calculatedWpm < 0 || !isFinite(calculatedWpm) ? 0 : calculatedWpm);
    }
  }, [charsState, phase, startTime, totalTyped, errors]);

  return { charsState, currIndex, wpm, accuracy, phase, handleKeyDown };
};

export default useTypingGame;