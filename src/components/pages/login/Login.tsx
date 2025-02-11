import './Login.css'
import React, { useState, useRef } from "react";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleLogin = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
          throw new Error("Login failed");
        }
        
        const data = await response.json();
        console.log("Login success:", data);
      } catch (error) {
        setError("Error logging in");
        console.error("Login error:", error);
      }
  };

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
            <input type="username" onChange={(e) => setUsername(e.target.value)} name="username" placeholder="Nombre de usuario" required />
            <input ref={passwordRef} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Contraseña" required />
            <div className="showPasswordDiv">
              <input type="checkbox" onChange={togglePasswordVisibility} />
              <label>Mostrar contraseña</label>
            </div>
            <button type="button" onClick={handleLogin}>Iniciar sesión</button>
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
