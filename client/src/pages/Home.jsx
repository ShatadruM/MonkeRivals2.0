import React, { useState, useRef, useEffect, useCallback } from 'react';
import TypingBoard from '../components/Game/TypingBoard';
import ResultsView from '../components/Game/ResultsView';
import { RefreshCcw } from 'lucide-react';

const SOLO_TEXT = "Migrating the backend to AWS right now";

const Home = () => {
  const [gameState, setGameState] = useState('idle'); 
  // Initialize stats with accuracy
  const [stats, setStats] = useState({ wpm: 0, progress: 0, accuracy: 100 });
  const [historyData, setHistoryData] = useState([]);
  
  const statsRef = useRef(stats);
  const timerRef = useRef(null);
  
  const [boardKey, setBoardKey] = useState(0); 

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const startGraph = useCallback(() => {
    if (timerRef.current) return;
    
    setGameState('playing');
    let seconds = 0;
    
    timerRef.current = setInterval(() => {
      seconds++;
      setHistoryData(prev => [
        ...prev,
        { 
          time: seconds, 
          myWpm: statsRef.current.wpm, 
          oppWpm: null 
        }
      ]);
    }, 1000);
  }, []);

  const stopGraph = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Updated to accept accuracy
  const handleStatsUpdate = useCallback((wpm, progress, accuracy) => {
    setStats({ wpm, progress, accuracy });

    if (progress > 0 && !timerRef.current) {
       startGraph();
    }

    if (progress === 100) {
      stopGraph();
      setGameState('finished');
    }
  }, [startGraph, stopGraph]);

  const handleRestart = () => {
    stopGraph();
    setGameState('idle');
    setStats({ wpm: 0, progress: 0, accuracy: 100 });
    setHistoryData([]);
    setBoardKey(prev => prev + 1);
  };

  useEffect(() => {
    return () => stopGraph();
  }, [stopGraph]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full max-w-7xl mx-auto px-4">
      
      {gameState !== 'finished' && (
        <div className="mt-12 mb-16 text-center animate-in fade-in duration-500">
          <h2 className="text-monke-text font-mono text-lg mb-2">Solo Practice</h2>
          <p className="text-monke-main/60 font-mono text-sm">Type freely. No pressure.</p>
        </div>
      )}

      {gameState !== 'finished' && (
        <div className="w-full">
            <TypingBoard 
                key={boardKey} 
                text={SOLO_TEXT} 
                onStatsUpdate={handleStatsUpdate}
            />
            
            <div className="mt-12 flex justify-center gap-4">
                <button 
                    onClick={handleRestart}
                    className="text-monke-text hover:text-monke-main transition p-2 flex items-center gap-2 font-mono text-sm"
                    title="Restart Test"
                >
                    <RefreshCcw size={16} /> Restart
                </button>
            </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="mt-20 w-full">
            <ResultsView 
                result={{
                    isWinner: true, 
                    wpm: stats.wpm,
                    accuracy: stats.accuracy // NOW USING REAL ACCURACY
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