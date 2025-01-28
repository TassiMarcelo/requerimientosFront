import { useState } from 'react';

interface UserMenuProps {
  userName: string; 
}

const UserMenu: React.FC<UserMenuProps> = ({ userName }) => {
  const [showLogout, setShowLogout] = useState(false); 

  const toggleLogoutButton = () => {
    setShowLogout(!showLogout); 
  };

  return (
    <div>
    <button
      onClick={toggleLogoutButton}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2"
    >
      {userName}
    </button>
  
    {showLogout && (
      <button
        onClick={() => alert("Cerrando sesión...")}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gray-700 text-white shadow hover:bg-gray-700/90 h-9 px-4 py-2"
      >
        Cerrar sesión
      </button>
    )}
  </div>
  
  );
};

export default UserMenu;
