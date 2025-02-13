import './Login.css'
import React, { useState, useRef } from "react";
import Swal from 'sweetalert2';

export default function Login() {

  //login
  const [loginUsername, setloginUsername] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [error, setError] = useState("");

  // register
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [cuil, setCuil] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [empresa, setEmpresa] = useState("");
  
  const handleLogin = async () => {
      try {
        var username = loginUsername;
        var password = loginPassword;
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
        Swal.fire("Sesion iniciada");
      } catch (error) {
        setError("Error logging in");
        console.error("Login error:", error);
      }
  };

  const handleRegister = async () => {
    try {
      var username = registerUsername;
      var password = registerPassword;
      const response = await fetch("http://localhost:8080/usuarios/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, apellido, email, password,username,cuil,descripcion,empresa }),
      });
      
      if (!response.ok) {
        throw new Error("Reg failed");
      }
      
      const data = await response.json();
      console.log("Register success:", data);
      Swal.fire("Exito","Usuario registrado con exito");
    } catch (error) {
      setError("Error Registering");
      console.error("Register error:", error);
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
            <input type="username" onChange={(e) => setloginUsername(e.target.value)} name="username" placeholder="Nombre de usuario" required />
            <input ref={passwordRef} onChange={(e) => setloginPassword(e.target.value)} type="password" name="password" placeholder="Contraseña" required />
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
            <input type="text" onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />

            <label>Apellido*</label>
            <input type="text" onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" required />

            <label>Cuil*</label>
            <input type="text" onChange={(e) => setCuil(e.target.value)} placeholder="CUIL" required />

            <label>Nombre de usuario*</label>
            <input type="text" onChange={(e) => setRegisterUsername(e.target.value)} placeholder="Nombre de usuario" required />

            <label>Descripcion</label>
            <input type="text" onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripcion" required />

            <label>Empresa*</label>
            <input type="text" onChange={(e) => setEmpresa(e.target.value)} placeholder="Empresa" required />

            <label>Correo Electrónico*</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" required />

            <label>Contraseña*</label>
            <input ref={passwordRef} onChange={(e) => setRegisterPassword(e.target.value)}  type="password" placeholder="Contraseña" required />

            <label>Repetir contraseña*</label>
            <input ref={confirmPasswordRef}  type="password" placeholder="Repetir contraseña" required />

            <div className="showPasswordDiv">
              <input type="checkbox" onChange={togglePasswordVisibility} />
              <label>Mostrar contraseña</label>
            </div>

            <button type="button" onClick={handleRegister}>Registrarse</button>
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
