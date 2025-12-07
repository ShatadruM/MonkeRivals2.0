import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Trophy, Activity, History } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch('http://localhost:3000/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  if (loading) return <div className="text-monke-main text-center mt-20">Loading Profile...</div>;
  if (!profileData) return <div className="text-monke-error text-center mt-20">Failed to load profile</div>;

  const { user, matches } = profileData;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 animate-in fade-in zoom-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-6 mb-12 bg-black/20 p-8 rounded-2xl border border-white/5">
        <img src={user.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-monke-main" />
        <div>
          <h1 className="text-4xl font-mono font-bold text-monke-light">{user.username}</h1>
          <p className="text-monke-text mt-2">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard icon={Trophy} label="MMR" value={user.stats.mmr} color="text-yellow-400" />
        <StatCard icon={Activity} label="Avg WPM" value={user.stats.avgWpm} color="text-blue-400" />
        <StatCard icon={Activity} label="Best WPM" value={user.stats.bestWpm} color="text-green-400" />
        <StatCard icon={History} label="Matches" value={user.stats.matchesPlayed} color="text-purple-400" />
      </div>

      {/* Match History */}
      <h2 className="text-2xl text-monke-light font-bold mb-6 font-mono">Match History</h2>
      <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-monke-text">
            <tr>
              <th className="p-4 font-mono text-sm">Date</th>
              <th className="p-4 font-mono text-sm">Opponent</th>
              <th className="p-4 font-mono text-sm">Result</th>
              <th className="p-4 font-mono text-sm">WPM</th>
              <th className="p-4 font-mono text-sm">Acc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {matches.map((match) => {
              const myStats = match.participants.find(p => p.user._id === user._id) || match.participants.find(p => p.socketId); // Fallback logic
              const opponent = match.participants.find(p => p.user._id !== user._id);
              const isWin = match.winner?._id === user._id;

              return (
                <tr key={match._id} className="hover:bg-white/5 transition">
                  <td className="p-4 text-monke-text text-sm">{new Date(match.playedAt).toLocaleDateString()}</td>
                  <td className="p-4 text-monke-light">{opponent?.user?.username || "Guest"}</td>
                  <td className={`p-4 font-bold ${isWin ? 'text-monke-main' : 'text-monke-error'}`}>
                    {isWin ? 'WIN' : 'LOSS'}
                  </td>
                  <td className="p-4 text-monke-light font-mono">{myStats?.wpm || 0}</td>
                  <td className="p-4 text-monke-text font-mono">{myStats?.accuracy || 0}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {matches.length === 0 && <div className="p-8 text-center text-monke-text">No matches played yet.</div>}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center">
    <Icon className={`mb-2 ${color}`} size={24} />
    <span className="text-3xl font-bold text-monke-light font-mono">{value}</span>
    <span className="text-xs text-monke-text uppercase tracking-wider mt-1">{label}</span>
  </div>
);

export default Profile;