import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import TypingBoard from '../components/Game/TypingBoard';
import ResultsView from '../components/Game/ResultsView';
import { Swords, Loader2, Clock } from 'lucide-react';

const Arena = () => {
  const socket = useSocket();
   const { mongoUser } = useAuth(); 
  const [matchState, setMatchState] = useState('idle'); 
  const [gameText, setGameText] = useState("");
  const [opponentInfo, setOpponentInfo] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // Stats
  const [myStats, setMyStats] = useState({ wpm: 0, progress: 0, accuracy: 100 });
  const [oppStats, setOppStats] = useState({ wpm: 0, progress: 0 });
  const [historyData, setHistoryData] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  
  // Refs
  // We initialize accuracy to 100 so it doesn't show 0 if game ends instantly
  const statsRef = useRef({ myWpm: 0, oppWpm: 0, accuracy: 100 });
  const timerRef = useRef(null);
  const hasFinishedRef = useRef(false); 

  // Sync refs with state (Keep this for the graph/timer tracking)
  useEffect(() => {
    statsRef.current = { 
        myWpm: myStats.wpm, 
        oppWpm: oppStats.wpm, 
        accuracy: myStats.accuracy 
    };
  }, [myStats.wpm, oppStats.wpm, myStats.accuracy]);

  useEffect(() => {
    if (!socket) return;

    socket.on('match_found', (data) => {
      setMatchState('found');
      setGameText(data.content);
      setOpponentInfo(data.opponent);
      setRoomId(data.roomId);
      setHistoryData([]);
      // Reset stats
      setMyStats({ wpm: 0, progress: 0, accuracy: 100 });
      setOppStats({ wpm: 0, progress: 0 });
      statsRef.current = { myWpm: 0, oppWpm: 0, accuracy: 100 }; // Reset ref manually too
      hasFinishedRef.current = false; 
      
      setTimeout(() => {
        setMatchState('playing');
        startDataTracking();
      }, 3000); 
    });

    socket.on('opponent_progress', (data) => {
      setOppStats({ wpm: data.wpm, progress: data.percentage });
    });

    socket.on('waiting_for_opponent', () => {
      setMatchState('waiting');
    });

    socket.on('game_over', (data) => {
      stopDataTracking();
      setMatchState('finished');
      
      const amIWinner = data.winnerId === socket.id;
      const myServerResult = data.results.find(r => r.userId === socket.id);
      
      // FALLBACK LOGIC:
      // 1. Try Server Result (if server calculates it)
      // 2. Try Ref (Immediate value from handleTick)
      // 3. Default to 100
      const finalAcc = myServerResult?.accuracy || statsRef.current.accuracy || 100;

      setFinalResult({
        isWinner: amIWinner,
        wpm: myServerResult ? myServerResult.wpm : statsRef.current.myWpm,
        accuracy: finalAcc
      });
    });

    return () => {
      socket.off('match_found');
      socket.off('opponent_progress');
      socket.off('waiting_for_opponent');
      socket.off('game_over');
      stopDataTracking();
    };
  }, [socket]); 

  // --- Graph Tracking ---
  const startDataTracking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let seconds = 0;
    
    timerRef.current = setInterval(() => {
      seconds++;
      setHistoryData(prev => [
        ...prev,
        { 
          time: seconds, 
          myWpm: statsRef.current.myWpm, 
          oppWpm: statsRef.current.oppWpm 
        }
      ]);
    }, 1000);
  };

  const stopDataTracking = () => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
  };

   const handleTick = useCallback((currentWpm, progressPercentage, currentAccuracy) => {
    if (matchState === 'playing' && !hasFinishedRef.current) {
        setMyStats({ wpm: currentWpm, progress: progressPercentage, accuracy: currentAccuracy });
        
        socket?.emit('update_progress', { roomId, percentage: progressPercentage, wpm: currentWpm });

        if (progressPercentage === 100) {
            hasFinishedRef.current = true;
            
            // --- DEBUG LOG ---
            console.log("SENDING FINISH:", {
                wpm: currentWpm,
                acc: currentAccuracy,
                userId: mongoUser?._id // Check your Browser Console for this value!
            });

            socket?.emit('game_finished', { 
                roomId, 
                wpm: currentWpm, 
                accuracy: currentAccuracy, 
                mongoUserId: mongoUser?._id 
            });
        }
    }
  }, [matchState, roomId, socket, mongoUser]); // Ensure mongoUser is in dependencies
  const handleFindMatch = () => {
    if (socket && !socket.connected) socket.connect();
    setMatchState('searching');
    socket?.emit('join_queue');
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full max-w-6xl mx-auto px-4 font-mono">
      
      {/* IDLE */}
      {matchState === 'idle' && (
        <div className="mt-32 text-center animate-in fade-in zoom-in duration-500">
          <Swords size={64} className="mx-auto text-monke-main mb-6" />
          <h2 className="text-3xl text-monke-light font-bold mb-4">Ranked Arena</h2>
          <div className='flex justify-center'>
            <Button onClick={handleFindMatch}>Find Match</Button>
          </div>
        </div>
      )}

      {/* SEARCHING */}
      {matchState === 'searching' && (
        <div className="mt-40 text-center">
          <Loader2 size={48} className="mx-auto text-monke-main animate-spin mb-6" />
          <h3 className="text-xl text-monke-light">Searching...</h3>
        </div>
      )}

      {/* FOUND */}
      {matchState === 'found' && (
        <div className="mt-40 text-center animate-pulse">
          <h2 className="text-4xl text-monke-main font-bold">MATCH FOUND</h2>
        </div>
      )}

      {/* PLAYING */}
      {matchState === 'playing' && (
        <div className="w-full mt-10">
          <HUD myStats={myStats} oppStats={oppStats} oppName={opponentInfo?.name} />
          <TypingBoard text={gameText} onStatsUpdate={handleTick} />
        </div>
      )}

      {/* WAITING FOR OPPONENT */}
      {matchState === 'waiting' && (
        <div className="mt-40 text-center animate-in fade-in duration-300">
          <Clock size={48} className="mx-auto text-monke-main animate-pulse mb-6" />
          <h2 className="text-3xl text-monke-light font-bold mb-2">You Finished!</h2>
          <p className="text-monke-text text-lg">Waiting for opponent to finish...</p>
          <div className="mt-8 p-4 bg-black/20 rounded-lg inline-block">
             <span className="text-monke-text text-sm">Your Final WPM:</span>
             <div className="text-4xl text-monke-main font-bold">{myStats.wpm}</div>
          </div>
          <div className="mt-4 text-xs text-monke-text/50">
             Opponent is at {oppStats.progress}%...
          </div>
        </div>
      )}

      {/* FINISHED */}
      {matchState === 'finished' && finalResult && (
        <ResultsView 
          result={finalResult} 
          historyData={historyData}
          onPlayAgain={() => { setMatchState('idle'); setHistoryData([]); }}
        />
      )}
    </div>
  );
};

const HUD = ({ myStats, oppStats, oppName }) => (
  <div className="flex justify-between mb-8 px-8 py-4 bg-black/20 rounded-xl border border-white/5">
    <div>
      <span className="text-xs text-monke-text block">YOU ({myStats.wpm} WPM)</span>
      <div className="h-2 w-32 bg-monke-bg rounded mt-1 overflow-hidden">
        <div className="h-full bg-monke-main transition-all duration-300" style={{width: `${myStats.progress}%`}}></div>
      </div>
    </div>
    <div className="text-right">
      <span className="text-xs text-monke-text block">{oppName} ({oppStats.wpm} WPM)</span>
      <div className="h-2 w-32 bg-monke-bg rounded mt-1 overflow-hidden ml-auto">
        <div className="h-full bg-monke-error transition-all duration-300" style={{width: `${oppStats.progress}%`}}></div>
      </div>
    </div>
  </div>
);

export default Arena;