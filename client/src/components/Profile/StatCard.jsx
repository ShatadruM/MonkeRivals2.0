import React from "react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-white/5 transition-colors group">
    <Icon className={`mb-3 ${color} group-hover:scale-110 transition-transform`} size={28} />
    <span className="text-3xl font-bold text-monke-light">{value}</span>
    <span className="text-xs text-monke-text uppercase tracking-widest mt-1 opacity-60">{label}</span>
  </div>
);

export default StatCard;