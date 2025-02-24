'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { User } from '@/types/user'
import { useEffect, useState } from 'react'
import CloseButton from "@/components/ui/CloseButton" // Importa tu componente CloseButton

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
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden p-0"> 
      <div className="border-b border-gray-600 bg-gray-500 w-full relative p-4 rounded-t-md"> 
      <div className="absolute -top-0 right-0">
                  <CloseButton onClick={onClose} />
        </div>

        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>
        </div>
        <div className="p-6 mb-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Nombre Completo</h4>
            <p className="text-sm text-muted-foreground"> {`${user.nombre} ${user.apellido}`}</p>
          </div>
          <div>
            <h4 className="font-medium">Correo Electrónico</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h4 className="font-medium">Empresa</h4>
            <p className="text-sm text-muted-foreground">{user.empresa}</p>
          </div>
          <div>
            <h4 className="font-medium">CUIL</h4>
            <p className="text-sm text-muted-foreground">{user.cuil}</p>
          </div>
          <div>
            <h4 className="font-medium">Usuario</h4>
            <p className="text-sm text-muted-foreground">{user.username ?? 'No disponible'}</p>
          </div>
          <div>
            <h4 className="font-medium">Descripción</h4>
            <p className="text-sm text-muted-foreground">{user.descripcion}</p>
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