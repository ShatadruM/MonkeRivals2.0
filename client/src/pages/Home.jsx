import React, { useState, useRef, useEffect, useCallback } from 'react';
import TypingBoard from '../components/Game/TypingBoard';
import ResultsView from '../components/Game/ResultsView';
import { RefreshCcw, Loader2 } from 'lucide-react'; // Added Loader2

const Home = () => {
  const [gameState, setGameState] = useState('loading'); // Start in 'loading'
  
  // --- CHANGE 1: Dynamic Text State ---
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

  // fetching the quote
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
      setGameText("The quick brown fox jumps over the lazy dog."); // Fallback
      setGameState('idle');
    }
  }, []);

  // fetching only on mount
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

  // -Fetch New Quote on Restart 
  const handleRestart = async () => {
    stopGraph();
    setStats({ wpm: 0, progress: 0, accuracy: 100 });
    setHistoryData([]);
    // Wait for new text before resetting board
    await fetchContent(); 
    setBoardKey(prev => prev + 1);
  };

  useEffect(() => {
    return () => stopGraph();
  }, [stopGraph]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full max-w-7xl mx-auto px-4">
      
      {/* Loading State */}
      {gameState === 'loading' && (
        <div className="flex flex-col items-center mt-32 animate-pulse">
          <Loader2 className="animate-spin text-monke-main mb-4" size={48} />
          <p className="text-monke-text font-mono">Fetching quote...</p>
        </div>
      )}

     

      {/* GAME: Typing Board */}
      {(gameState === 'idle' || gameState === 'playing') && (
        <div className="w-full">
          <div className="mt-12 mb-16 text-center animate-in fade-in duration-500">
          <h2 className="text-monke-text font-mono text-lg mb-2">Solo Practice</h2>
          <p className="text-monke-main/60 font-mono text-sm">Source: {source || "Unknown"}</p>
        </div>
            <TypingBoard 
                key={boardKey} 
                text={gameText} // Use dynamic variable instead of constant
                onStatsUpdate={handleStatsUpdate}
            />
            
            <div className="mt-12 flex justify-center gap-4">
                <button 
                    onClick={handleRestart}
                    className="text-monke-text hover:text-monke-main transition p-2 flex items-center gap-2 font-mono text-sm"
                    title="Restart Test"
                >
                    <RefreshCcw size={16} /> New Quote
                </button>
            </div>
        </div>
      )}

      {/* RESULTS */}
      {gameState === 'finished' && (
        <div className="mt-20 w-full">
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