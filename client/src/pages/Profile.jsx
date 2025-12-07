import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Trophy, Activity, Zap, History } from 'lucide-react';
import MatchCard from '../components/Profile/MatchCard'; 
import StatCard from '../components/Profile/StatCard'; 
import LoadingScreen from '../components/UI/LoadingScreen'; 

const Profile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  
  if (loading) {
    return <LoadingScreen message="Loading Profile..." />;
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-monke-error font-mono">Could not load profile data.</div>
      </div>
    );
  }

  const { user, matches } = profileData;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 animate-in fade-in zoom-in duration-500 font-mono">
     
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-black/20 p-8 rounded-2xl border border-white/5 shadow-xl">
        <div className="relative">
          <img 
            src={user.avatar || "https://via.placeholder.com/150"} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-4 border-monke-main shadow-lg shadow-monke-main/20" 
          />
          <div className="absolute -bottom-2 -right-2 bg-monke-bg p-2 rounded-full border border-white/10">
            <User size={20} className="text-monke-light" />
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-monke-light tracking-tight">{user.username}</h1>
          <p className="text-monke-text mt-2 text-sm flex items-center justify-center md:justify-start gap-2">
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <StatCard icon={Trophy} label="MMR Rating" value={user.stats.mmr} color="text-yellow-400" />
        <StatCard icon={Zap} label="Best WPM" value={user.stats.bestWpm} color="text-monke-main" />
        <StatCard icon={Activity} label="Avg WPM" value={user.stats.avgWpm} color="text-blue-400" />
        <StatCard icon={History} label="Matches" value={user.stats.matchesPlayed} color="text-purple-400" />
      </div>

      {/* Match History List */}
      <div className="space-y-6">
        <h2 className="text-2xl text-monke-light font-bold mb-4 flex items-center gap-2">
          <History size={24} />
          Match History
        </h2>
        
        <div className="flex flex-col gap-2">
          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchCard 
                key={match._id} 
                match={match} 
                currentUserId={user._id} 
              />
            ))
          ) : (
            <div className="p-12 text-center bg-black/20 rounded-xl border border-white/5 border-dashed">
              <p className="text-monke-text">No matches played yet. Go to the Arena!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;