
import UserMenu from '../../ui/UserMenu';
import { UserTable } from '../../user-table';

export default function Usuarios() {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-6">Gestión De Usuarios</h1>
        <UserMenu userName={"Bienvenido, "} />
        <UserTable />
    </div>
  );
}
