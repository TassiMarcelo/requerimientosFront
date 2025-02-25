'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { User } from '@/types/user'

interface UserViewProps {
  user: User 
  onClose: () => void
}

export function UserView({ user, onClose }: UserViewProps) {
  console.log(user.username);

  if (!user) {
    return <div>No se encontraron detalles del usuario.</div>
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
<DialogContent className="sm:max-w-[425px] [&>button]:hidden p-0 gap-0">
<div className="bg-gray-250 w-full relative px-6 py-4 rounded-t-md">
<DialogHeader className="mb-0 space-y-0 text-left -px-4">
  <DialogTitle className="mb-0 text-left -px-4">Detalles del Usuario</DialogTitle>
</DialogHeader>

        </div>
        <div className="p-2">
        <div className="px-4 py-2">
        <div>
            <h4 className="font-medium">Nombre Completo</h4>
            <p className="text-sm text-muted-foreground"> {`${user.nombre} ${user.apellido}`}</p>
          </div>
          <div>
            <h4 className="font-medium">Correo Electrónico</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h4 className="font-medium">CUIL</h4>
            <p className="text-sm text-muted-foreground">{user.cuil}</p>
          </div>
          <div>
            <h4 className="font-medium">Descripción</h4>
            <p className="text-sm text-muted-foreground">{user.descripcion}</p>
          </div>
          <div>
            <h4 className="font-medium">Empresa</h4>
            <p className="text-sm text-muted-foreground">{user.empresa}</p>
          </div>
            <div>
            <h4 className="font-medium">Usuario</h4>
            <p className="text-sm text-muted-foreground">{user.username ?? 'No disponible'}</p>
          </div>
          <div>
            <h4 className="font-medium">Preferencia</h4>
            <p className="text-sm text-muted-foreground">{user.preferencia ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <h4 className="font-medium">Rol</h4>
            <p className="text-sm text-muted-foreground">
              {user.role === "ROLE_ADMIN" ? "Administrador" : "Usuario Externo"}
            </p>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}