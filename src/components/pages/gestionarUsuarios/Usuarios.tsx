import UserMenu from '../../ui/UserMenu';
import { UserTable } from './user-table';
import { useState, useEffect } from 'react';

export default function Usuarios() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
<div className="fixed inset-0 bg-black bg-opacity-70 z-9999 flex justify-center items-center">
<div className="min-h-screen bg-[#E5E7EB] w-screen" style={{ borderTop: "none" }}>
<div className="bg-[#556B2F] p-4 flex justify-between items-center w-full border-t-0">
<h1 className="text-3xl font-bold text-white">Administración</h1>
  <div className="flex items-center gap-4 text-white">
    <UserMenu userName={"Admin"} />
  </div>
</div>
<div className="p-4 w-full">
        <UserTable />
      </div>
    </div>
</div>

  );
}
