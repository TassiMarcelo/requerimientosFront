"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button2 from "../../ui/Button2/Button2";
import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "../types/user";
import Swal from "sweetalert2";

interface UserEditFormProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export function UserEditForm({ user, onSave, onCancel }: UserEditFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    cuil: user.cuil,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    empresa: user.empresa,
    descripcion: user.descripcion,
    preferencia: user.preferencia,
    username: user.username,
  });

  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    setFormData({
      cuil: user.cuil,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      empresa: user.empresa,
      descripcion: user.descripcion,
      preferencia: user.preferencia,
      username: user.username,
    });
  }, [user]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestBody = {
        cuil: formData.cuil,
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        empresa: formData.empresa,
        descripcion: formData.descripcion,
        preferencia: formData.preferencia,
        username: formData.username,
      };

      const response = await fetch(`http://localhost:8080/usuarios/${user.id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el usuario");
      }

      if (newPassword) {
        await updatePassword(newPassword);
      }

      onSave({
        ...user,
        ...formData, 
           password: newPassword, 
      });    } catch (error) {
      alert(error.message || "Hubo un problema con la conexión");
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${user.username}/updatePassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la contraseña");
      }

    } catch (error) {
      alert(error.message || "Hubo un problema con la contraseña");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-[800px] bg-white rounded-md shadow-lg relative">
        <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 mt-0">
              <div className="flex space-x-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) =>
                        setFormData({ ...formData, apellido: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuil">CUIL</Label>
                    <Input
                      id="cuil"
                      value={formData.cuil}
                      onChange={(e) =>
                        setFormData({ ...formData, cuil: e.target.value })
                      }
                      required
                    />
                  </div>
                 
                </div>

                {/* Columna derecha */}
                <div className="flex-1 space-y-4">

                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({ ...formData, descripcion: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input
                      id="empresa"
                      value={formData.empresa}
                      onChange={(e) =>
                        setFormData({ ...formData, empresa: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    {user ? (
                      <Input
                        id="password"
                        type="password"
                        value={newPassword || '***********'} 
                        onChange={handlePasswordChange}
                      />
                    ) : (
                      <Input
                        id="password"
                        type="password"
                        value={formData.password} // Usamos formData.password para la creación
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preferencia"
                    checked={formData.preferencia}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        preferencia: checked as boolean,
                      })
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="preferencia" className="flex items-center mb-0">
                    Preferencia
                  </Label>
                </div>

                <div className="flex space-x-4">
                <Button2
  title={"Cancelar"}
  type="button"
  onClick={async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Perderás los datos ingresados si cancelas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      customClass: {
        confirmButton: 'CancelButton',
        cancelButton: 'NeutralButton',
      }
    });

    if (result.isConfirmed) {
      onCancel(); 
    }
  }}
  className={"NeutralButton"} 
/>                  <Button2 type={"submit"} title={"Guardar cambios"} className={"NeutralButton"} />
                </div>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
