import React from 'react';
import { Trophy, X, Calendar, Activity, Zap } from 'lucide-react';

const MatchCard = ({ match, currentUserId }) => {
  // 1. Identify "Me" vs "Opponent" from the participants array
  const myData = match.participants.find(p => p.user?._id === currentUserId);
  const opponentData = match.participants.find(p => p.user?._id !== currentUserId);
  
  // 2. Determine Win/Loss state
  // Check if the winner ID matches current user's ID
  const isWin = match.winner?._id === currentUserId;
  
  // 3. Styles based on result
  const borderColor = isWin ? 'border-monke-main' : 'border-monke-error';
  const bgColor = isWin ? 'bg-monke-main/5' : 'bg-monke-error/5';
  const resultText = isWin ? 'VICTORY' : 'DEFEAT';
  const resultColor = isWin ? 'text-monke-main' : 'text-monke-error';

  return (
    <div className={`w-full flex flex-col md:flex-row items-center justify-between p-4 mb-4 rounded-xl border-l-4 ${borderColor} ${bgColor} bg-black/20 hover:bg-white/5 transition-all`}>
      
      {/* LEFT: My Stats */}
      <div className="flex-1 flex flex-col items-start w-full md:w-auto mb-4 md:mb-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-monke-light font-bold font-mono text-lg">YOU</span>
          {isWin && <Trophy size={16} className="text-monke-main" />}
        </div>
        <div className="flex gap-6">
          <div>
            <span className="text-xs text-monke-text block uppercase">WPM</span>
            <span className="text-2xl font-mono text-monke-light">{myData?.wpm || 0}</span>
          </div>
          <div>
            <span className="text-xs text-monke-text block uppercase">ACC</span>
            <span className="text-2xl font-mono text-monke-light">{myData?.accuracy || 0}%</span>
          </div>
        </div>
      </div>

      {/* CENTER: Match Info */}
      <div className="flex flex-col items-center justify-center px-8 border-y md:border-y-0 md:border-x border-white/10 py-2 md:py-0 w-full md:w-auto mb-4 md:mb-0">
        <span className={`font-black tracking-widest text-xl mb-1 ${resultColor}`}>
          {resultText}
        </span>
        <div className="flex items-center gap-2 text-monke-text text-xs">
          <Calendar size={12} />
          <span>{new Date(match.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="text-monke-text/50 text-[10px] mt-1 font-mono">
          {new Date(match.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* RIGHT: Opponent Stats */}
      <div className="flex-1 flex flex-col items-end w-full md:w-auto">
        <div className="flex items-center gap-2 mb-2">
          {!isWin && <Trophy size={16} className="text-monke-main" />}
          <span className="text-monke-text font-bold font-mono text-lg">
            {opponentData?.user?.username || "Guest"}
          </span>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <span className="text-xs text-monke-text block uppercase">WPM</span>
            <span className="text-2xl font-mono text-monke-text">{opponentData?.wpm || 0}</span>
          </div>
          <div>
            <span className="text-xs text-monke-text block uppercase">ACC</span>
            <span className="text-2xl font-mono text-monke-text">{opponentData?.accuracy || 0}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MatchCard;