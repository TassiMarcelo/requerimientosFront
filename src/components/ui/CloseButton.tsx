import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string; 
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-md flex items-center justify-center ${className}`}
      aria-label="Cerrar"
    >
    <span className="text-2xl font-bold">&times;</span>
    </button>
  );
};

export default CloseButton;
