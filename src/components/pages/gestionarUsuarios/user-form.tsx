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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errorMessage) {
      return;
    }

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

      if (!user) {
        requestBody.password = formData.password;
      }

      console.log("URL:", url);
      console.log("Método:", method);
      console.log("Cuerpo de la solicitud:", requestBody);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Respuesta del servidor:", response);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || errorData.error || "Error desconocido";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Respuesta completa del servidor:", data);

      if (!data || data.data === null) {
        // Si el servidor no devuelve el usuario actualizado, usa el formulario actual
        onSave({ ...formData, id: user?.id } as User);
      } else {
        // Si el servidor devuelve el usuario actualizado, úsalo
        onSave(data.data);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert(error.message || "Hubo un problema con la conexión");
    }
  };

  const handleCancel = () => {
    confirmCancel();
    /*
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!", 
      icon: "warning", 
      showCancelButton: true, 
      confirmButtonText: "Sí, continuar", 
      cancelButtonText: "Cancelar", 
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCancel();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("cancelado");
        
      }
    });
    */
  };

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    onCancel();
  };

  const cancelCancel = () => {
    setIsCancelModalOpen(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });

    /*
    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
    } else if (!/[A-Z]/.test(password)) {
      setErrorMessage('La contraseña debe contener al menos una letra mayúscula.');
    } else if (!/[0-9]/.test(password)) {
      setErrorMessage('La contraseña debe contener al menos un número.');
    } else if (!/[!@#$%^&*]/.test(password)) {
      setErrorMessage('La contraseña debe incluir un carácter especial (!@#$%^&*)');
    } else {
      setErrorMessage('');
    }
    */
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className={`w-full max-w-[800px] max-h-[95vh] bg-white rounded-md shadow-lg ${errorMessage ? "scroll-hidden" : ""} relative`}>
      <div className="border-b border-gray-600 bg-gray-500 w-full relative p-5 rounded-t-md"> 
      <div className="absolute -top-1 right-0"> 
          <CloseButton onClick={onCancel} />
          </div>
          </div>
          <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mt-0">            
            {/* Contenedor flexible para las columnas */}
            <div className="flex space-x-6">
              {/* Columna izquierda */}
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    onKeyPress={(e) => {
                      if (!/[a-zA-Z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
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
                    onKeyPress={(e) => {
                      if (!/[a-zA-Z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
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

              {/* Columna derecha */}
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="cuil">CUIL</Label>
                  <Input
                    id="cuil"
                    value={formData.cuil}
                    onChange={(e) =>
                      setFormData({ ...formData, cuil: e.target.value })
                    }
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
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

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  {user ? (
                    <Input
                      id="password"
                      type="text"
                      value="*********"
                      disabled
                      className="bg-gray-400 cursor-not-allowed"
                    />
                  ) : (
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      maxLength={20}
                      pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,:\-])[A-Za-z0-9!@#$%^&*.,:\-]{8,20}$"
                      title="La contraseña debe tener entre 8 y 20 caracteres, incluir al menos una letra mayúscula, un número y un carácter especial."
                    />
                  )}
                  {errorMessage && (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Contenedor para Preferencia y Botones */}
            <div className="flex justify-between items-center mt-6">
              {/* Preferencia alineada a la izquierda */}
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

              {/* Botones alineados a la derecha */}
              <div className="flex space-x-4">
                <Button2 title={"Cancelar"} onClick={handleCancel} className={"NeutralButton"}></Button2>
                <Button2 type={"submit"} title={"Guardar cambios"} className={"NeutralButton"}></Button2>
              </div>
            </div>
          </form>
        </div>
      </div>
          </div>

      {/* Modal de cancelación */}
      <Modal isOpen={isCancelModalOpen} onClose={cancelCancel}>
        <div className="z-50">
          <h2>
            {user
              ? "¿Estás seguro de que deseas cancelar la edición del usuario?"
              : "¿Estás seguro de que deseas cancelar la creación del usuario?"}
          </h2>
          <div className="flex justify-center gap-2 mt-4">
            <Button
              onClick={cancelCancel}
              variant="outline"
              className="bg-gray-200 text-black hover:bg-gray-300"
            >
              No
            </Button>
            <Button onClick={confirmCancel} variant="destructive">
              Sí
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
