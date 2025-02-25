import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Button2 from "./ui/Button2/Button2"

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("userName") || "";  // Obtener el username desde localStorage

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    if (passwordRef.current && confirmPasswordRef.current) {
      passwordRef.current.type = passwordVisible ? 'password' : 'text';
      confirmPasswordRef.current.type = passwordVisible ? 'password' : 'text';
    }
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${username}/updatePassword`, {
        method: "PATCH",  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
  
      if (!response.ok) {
        throw new Error("Error al cambiar la contraseña");
      }
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data); 
  
      if (data.message === "Contraseña actualizada") {
        Swal.fire("Éxito", "La contraseña ha sido cambiada con éxito", "success");
        navigate("/tablaRequerimientos");  
      } else {
        throw new Error("No se pudo cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);  
      Swal.fire("Error", error.message, "error");
    }
  };
  
  return (
    <div className="change-password-container flex justify-center items-center min-h-screen bg-gray-300">
           <div className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-md">
           <h3 className="text-3xl font-semibold text-center mb-6">Actualizar contraseña</h3>
           <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Contraseña nueva</label>
          <input
            id="newPassword"
            type="password"
            ref={passwordRef}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ingrese su nueva contraseña"
            required
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label 
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
>
          Repetir contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita su nueva contraseña"
            required
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center">
        <input
            type="checkbox"
            checked={passwordVisible}
            onChange={togglePasswordVisibility}
            id="showPassword"
            className="mr-2"
             />
          <label htmlFor="showPassword" className="text-sm text-gray-600">Mostrar contraseñas</label>
        </div>
        <Button2 title={"Guardar"} onClick={handleSubmit} className={"AcceptButton"} />
      </form>
    </div>
    </div>
  );
};

export default ChangePassword;
