import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Button from '../UI/Button';
import { RefreshCcw, Home } from 'lucide-react';

const ResultsView = ({ result, historyData, onPlayAgain }) => {
  const isWinner = result.isWinner;

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
      
      {/* Header Stats */}
      <div className="flex flex-col items-center mb-12">
        <h1 className={`text-6xl font-bold font-mono mb-4 ${isWinner ? 'text-monke-main' : 'text-monke-error'}`}>
          {isWinner ? 'VICTORY' : 'DEFEAT'}
        </h1>
        
        {/* Stats Grid */}
        <div className="flex gap-16 text-center">
          {/* WPM */}
          <div>
            <div className="text-6xl font-mono font-bold text-monke-light">{result.wpm || 0}</div>
            <div className="text-monke-text text-xl mt-2">wpm</div>
          </div>
          
          {/* ACCURACY (Added/Verified) */}
          <div>
            <div className="text-6xl font-mono font-bold text-monke-light">{result.accuracy || 0}%</div>
            <div className="text-monke-text text-xl mt-2">acc</div>
          </div>
        </div>
      </div>

      {/* WPM Graph */}
      <div className="h-80 w-full bg-black/20 rounded-xl p-6 mb-8 border border-white/5">
        <h3 className="text-monke-text text-sm mb-4">WPM Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#646669" width={40} tick={{fontSize: 12, fill: '#646669'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#323437', border: '1px solid #e2b714', color: '#d1d0c5' }}
              itemStyle={{ fontFamily: 'monospace' }}
              labelStyle={{ display: 'none' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
            <Line 
              type="monotone" 
              dataKey="myWpm" 
              name="You" 
              stroke="#e2b714" 
              strokeWidth={4} 
              dot={false} 
              activeDot={{ r: 6, fill: '#e2b714' }}
            />
            {/* Only render Opponent line if data exists (handles solo mode) */}
            <Line 
              type="monotone" 
              dataKey="oppWpm" 
              name="Opponent" 
              stroke="#ca4754" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, fill: '#ca4754' }}
              hide={!historyData.some(d => d.oppWpm !== null)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={onPlayAgain} variant="primary">
          <RefreshCcw size={18} /> Play Again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="secondary">
          <Home size={18} /> Home
        </Button>
      </div>
    </div>
  );
};

export default ResultsView;