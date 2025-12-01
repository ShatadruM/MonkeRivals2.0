import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-mono font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-monke-main text-monke-bg hover:bg-[#ffe066]",
    secondary: "bg-monke-text/20 text-monke-text hover:text-monke-light hover:bg-monke-text/30",
    outline: "border-2 border-monke-main text-monke-main hover:bg-monke-main hover:text-monke-bg"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;