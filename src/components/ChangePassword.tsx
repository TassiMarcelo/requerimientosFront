import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
        method: "PATCH",  // Usamos PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
  
      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error("Error al cambiar la contraseña");
      }
  
      // Procesamos la respuesta
      const data = await response.json();
      console.log("Respuesta del servidor:", data);  // Verifica la estructura de la respuesta
  
      // Comprobamos si la respuesta contiene el mensaje esperado
      if (data.message === "Contraseña actualizada") {
        Swal.fire("Éxito", "La contraseña ha sido cambiada con éxito", "success");
        navigate("/tablaRequerimientos");  // Redirigimos a la página de tablaRequerimientos
      } else {
        throw new Error("No se pudo cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);  // Muestra el error en la consola
      Swal.fire("Error", error.message, "error");
    }
  };
  
  return (
    <div className="change-password-container">
      <h3>Cambiar contraseña</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="newPassword">Contraseña nueva</label>
          <input
            id="newPassword"
            type="password"
            ref={passwordRef}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ingrese su nueva contraseña"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Repetir contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita su nueva contraseña"
            required
          />
        </div>
        <div className="show-password">
          <input
            type="checkbox"
            checked={passwordVisible}
            onChange={togglePasswordVisibility}
          />
          <label>Mostrar contraseñas</label>
        </div>
        <button type="button" onClick={handleSubmit}>Guardar</button>
      </form>
    </div>
  );
};

export default ChangePassword;
