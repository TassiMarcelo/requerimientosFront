import { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import Button2 from './Button2/Button2';
interface UserMenuProps {
  userName: string | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName }) => {
  const [showLogout, setShowLogout] = useState(false); 
  const navigate = useNavigate();
  
  const toggleLogoutButton = () => {
    setShowLogout(!showLogout); 
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2"> {/* Usar flex para alinear los botones */}
      <button
        onClick={toggleLogoutButton}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-black text-white shadow hover:bg-gray-800 hover:text-white h-10 px-4 py-2"
      >
        {userName}
      </button>
  
      {showLogout && (
        <Button2 title={"Cerrar sesión"} onClick={handleLogout} className='NeutralButton'></Button2>
      )}
    </div>
  );
};

export default UserMenu;
