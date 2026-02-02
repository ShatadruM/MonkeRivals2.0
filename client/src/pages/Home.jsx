import React, { useState, useRef, useEffect, useCallback } from 'react';
import TypingBoard from '../components/Game/TypingBoard';
import ResultsView from '../components/Game/ResultsView';
import { RefreshCcw, Loader2 } from 'lucide-react';

const Home = () => {
  const [gameState, setGameState] = useState('loading');
  const [gameText, setGameText] = useState("");
  const [source, setSource] = useState("");
  
  const [stats, setStats] = useState({ wpm: 0, progress: 0, accuracy: 100 });
  const [historyData, setHistoryData] = useState([]);
  
  const statsRef = useRef(stats);
  const timerRef = useRef(null);
  const [boardKey, setBoardKey] = useState(0); 

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const fetchContent = useCallback(async () => {
    setGameState('loading');
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/content/random');
      const data = await res.json();
      setGameText(data.content);
      setSource(data.source);
      setGameState('idle');
    } catch (err) {
      console.error("Failed to fetch content:", err);
      setGameText("The quick brown fox jumps over the lazy dog."); 
      setGameState('idle');
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const startGraph = useCallback(() => {
    if (timerRef.current) return;
    setGameState('playing');
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setHistoryData(prev => [
        ...prev,
        { time: seconds, myWpm: statsRef.current.wpm, oppWpm: null }
      ]);
    }, 1000);
  }, []);

  const stopGraph = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStatsUpdate = useCallback((wpm, progress, accuracy) => {
    setStats({ wpm, progress, accuracy });

    if (progress > 0 && !timerRef.current) startGraph();
    if (progress === 100) {
      stopGraph();
      setGameState('finished');
    }
  }, [startGraph, stopGraph]);

  const handleRestart = async () => {
    stopGraph();
    setStats({ wpm: 0, progress: 0, accuracy: 100 });
    setHistoryData([]);
    await fetchContent(); 
    setBoardKey(prev => prev + 1);
  };

  useEffect(() => {
    return () => stopGraph();
  }, [stopGraph]);

  return (
    // CHANGE: Changed min-h to allow scrolling if needed, added padding for safe areas
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
      
      {/* Loading State */}
      {gameState === 'loading' && (
        // CHANGE: Reduced top margin on mobile (mt-20) vs desktop (md:mt-32)
        <div className="flex flex-col items-center mt-20 md:mt-32 animate-pulse">
          <Loader2 className="animate-spin text-monke-main mb-4" size={32} md:size={48} />
          <p className="text-monke-text font-mono text-sm md:text-base">Fetching quote...</p>
        </div>
      )}

      {/* GAME: Typing Board */}
      {(gameState === 'idle' || gameState === 'playing') && (
        <div className="w-full flex flex-col items-center">
          
          {/* Header Info */}
          {/* CHANGE: Drastically reduced margins so header + text fits above the keyboard */}
          <div className="mt-4 mb-6 md:mt-12 md:mb-16 text-center animate-in fade-in duration-500">
            <h2 className="text-monke-text font-mono text-base md:text-lg mb-1 md:mb-2">Solo Practice</h2>
            <p className="text-monke-main/60 font-mono text-xs md:text-sm truncate max-w-[300px] md:max-w-none mx-auto">
              Source: {source || "Unknown"}
            </p>
          </div>

          {/* Container for the board to ensure full width on mobile */}
          <div className="w-full">
            <TypingBoard 
                key={boardKey} 
                text={gameText} 
                onStatsUpdate={handleStatsUpdate}
                // Optional: Pass a prop to tell the board to auto-focus if supported
                // autoFocus={true} 
            />
          </div>
            
          {/* Restart Button */}
          {/* CHANGE: Reduced margin top */}
          <div className="mt-6 md:mt-12 flex justify-center gap-4">
              <button 
                  onClick={handleRestart}
                  className="text-monke-text hover:text-monke-main transition p-3 md:p-2 flex items-center gap-2 font-mono text-sm active:scale-95 touch-manipulation"
                  title="Restart Test"
              >
                  <RefreshCcw size={16} /> <span className="hidden md:inline">New Quote</span><span className="md:hidden">Restart</span>
              </button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {gameState === 'finished' && (
        <div className="mt-8 md:mt-20 w-full">
            <ResultsView 
                result={{
                    isWinner: true, 
                    wpm: stats.wpm,
                    accuracy: stats.accuracy
                }}
                historyData={historyData}
                onPlayAgain={handleRestart}
            />
        </div>
      )}
    </div>
  );
};

export default Home;