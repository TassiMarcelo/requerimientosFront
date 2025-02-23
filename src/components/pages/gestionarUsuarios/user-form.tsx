"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button2 from "../../ui/Button2/Button2";
import { Button } from "../../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Modal from "../../Modal";
import type { User } from "../types/user";
import Swal from "sweetalert2";
import CloseButton from "../../ui/CloseButton";

interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      cuil: "",
      email: "",
      nombre: "",
      apellido: "",
      empresa: "",
      descripcion: "",
      preferencia: false,
      username: "",
      password: "",
    }
  );

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = user
        ? `http://localhost:8080/usuarios/${user.id}/update`
        : "http://localhost:8080/usuarios/registrar";
      const method = user ? "PUT" : "POST";

      const requestBody: any = {
        cuil: formData.cuil,
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        empresa: formData.empresa,
        descripcion: formData.descripcion,
        preferencia: formData.preferencia,
        username: formData.username,
        role: formData.role,
        activado: formData.activado,
      };

      if (newPassword && !user) {
        // Si es un nuevo usuario, añadimos la contraseña
        requestBody.password = formData.password;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }

      const data = await response.json();
      onSave(data.data || formData);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert(error.message || "Hubo un problema con la conexión");
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onCancel();
      }
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-[800px] max-h-[95vh] bg-white rounded-md shadow-lg relative">
        <div className="border-b border-gray-600 bg-gray-500 w-full relative p-5 rounded-t-md">
          <CloseButton onClick={onCancel} />
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre, Apellido, Correo Electrónico, etc. */}
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
              </div>

              <div className="flex-1 space-y-4">
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

                {/* Contraseña solo en la creación de usuario */}
                {!user && (
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                )}
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
                  onClick={handleCancel}
                  className={"CancelButton"}
                />
                <Button2 type={"submit"} title={"Guardar cambios"} className={"NeutralButton"} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
