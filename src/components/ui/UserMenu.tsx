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
      <Button2 title={userName} onClick={toggleLogoutButton} className='NeutralButton' type={"button"} ></Button2>  
      {showLogout && (
        <Button2 title={"Cerrar sesión"} onClick={handleLogout} className='NeutralButton'></Button2>
      )}
    </div>
  );
};

export default UserMenu;
