'use client';
import type { User } from '@/types/user';
import Button2 from '../../ui/Button2/Button2';
import '../../../App.css';

interface UserViewProps {
  user: User;
  onClose: () => void;
}

export function UserView({ user, onClose }: UserViewProps) {
  console.log(user.username);

  if (!user) {
    return <div>No se encontraron detalles del usuario.</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="form-container">
        <div className="p-4 flex-1 overflow-auto">
          <div className="flex space-x-4">
            <div className="flex-1 space-y-3">
            <div className="p-3 border-black border-2 rounded-md shadow-sm">
            <h4 className="font-medium">Nombre Completo</h4>
                <p className="text-sm text-muted-foreground">{`${user.nombre} ${user.apellido}`}</p>
              </div>
              <div className="p-3 border-black border-2 rounded-md shadow-sm">
                <h4 className="font-medium">Correo Electrónico</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="p-3 border-black border-2 rounded-md shadow-sm">
                <h4 className="font-medium">CUIL</h4>
                <p className="text-sm text-muted-foreground">{user.cuil}</p>
              </div>
              <div className="p-3 border-black border-2 rounded-md shadow-sm">
                <h4 className="font-medium">Descripción</h4>
                <p className="text-sm text-muted-foreground">{user.descripcion}</p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="flex-1 space-y-3">
              <div className="p-3 border-black border-2 rounded-md shadow-sm">
                <h4 className="font-medium">Empresa</h4>
                <p className="text-sm text-muted-foreground">{user.empresa}</p>
              </div>
              <div className="p-3 border-black border-2 rounded-md shadow-sm">
                <h4 className="font-medium">Usuario</h4>
                <p className="text-sm text-muted-foreground">{user.username ?? 'No disponible'}</p>
              </div>
              <div className="p-3 border-black border-2 rounded-md shadow-sm">
                <h4 className="font-medium">Preferencia</h4>
                <p className="text-sm text-muted-foreground">{user.preferencia ? 'Sí' : 'No'}</p>
              </div>
              <div className="p-3 border-black border-2 rounded-md shadow-sm">
                <h4 className="font-medium">Rol</h4>
                <p className="text-sm text-muted-foreground">
                  {user.role === "ROLE_ADMIN" ? "Administrador" : "Usuario Externo"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 py-2 border-t">
          <Button2
            title="Cerrar"
            type="button"
            onClick={onClose}
            className="NeutralButton"
          />
        </div>
      </div>
    </div>
  );
}