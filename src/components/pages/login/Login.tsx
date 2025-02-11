import './Login.css'
import React, { useState, useRef } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    if (passwordRef.current) {
      passwordRef.current.type =
        passwordRef.current.type === "password" ? "text" : "password";
    }
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.type =
        confirmPasswordRef.current.type === "password" ? "text" : "password";
    }
  };

  return (
    <div className="box">
      <div className="form_container">
        {isLogin ? (
          <form>
            <h2>Iniciar sesión</h2>
            <input type="email" name="email" placeholder="Correo electrónico" required />
            <input ref={passwordRef} type="password" name="password" placeholder="Contraseña" required />
            <div className="showPasswordDiv">
              <input type="checkbox" onChange={togglePasswordVisibility} />
              <label>Mostrar contraseña</label>
            </div>
            <button type="button">Iniciar sesión</button>
            <h6>
              ¿No tenés una cuenta?{" "}
              <button type="button" className="toggler" onClick={toggleForm}>
                Registrate acá
              </button>
            </h6>
          </form>
        ) : (
          <form>
            <h2>Registrarse</h2>
            <label>Nombre*</label>
            <input type="text" placeholder="Nombre" required />

            <label>Apellido*</label>
            <input type="text" placeholder="Apellido" required />

            <label>DNI*</label>
            <input type="text" placeholder="DNI" required />

            <label>Teléfono*</label>
            <input type="text" placeholder="Teléfono" required />

            <label>Correo Electrónico*</label>
            <input type="email" placeholder="Correo Electrónico" required />

            <label>Contraseña*</label>
            <input ref={passwordRef} type="password" placeholder="Contraseña" required />

            <label>Repetir contraseña*</label>
            <input ref={confirmPasswordRef} type="password" placeholder="Repetir contraseña" required />

            <div className="showPasswordDiv">
              <input type="checkbox" onChange={togglePasswordVisibility} />
              <label>Mostrar contraseña</label>
            </div>

            <button type="button">Registrarse</button>
            <h6>
              ¿Ya tenés cuenta?{" "}
              <button type="button" className="toggler" onClick={toggleForm}>
                Ingresá acá
              </button>
            </h6>
          </form>
        )}
      </div>
    </div>
  );
}
