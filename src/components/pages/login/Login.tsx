import './Login.css'
import React, { useState, useRef } from "react";
import Swal from 'sweetalert2';
import { GrLogin } from "react-icons/gr";
import { useNavigate } from "react-router-dom";


export default function Login() {

  //login
  const [loginUsername, setloginUsername] = useState("");
  const [loginPassword, setloginPassword] = useState("");

  // register
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [cuil, setCuil] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [empresa, setEmpresa] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
   
    try {
      const username = loginUsername;
      const password = loginPassword;
      Swal.fire({
        title: 'Iniciando sesion...',
        text: 'Por favor, espera un momento.',
        allowOutsideClick: false, // Evita que el usuario cierre la alerta haciendo clic fuera
        didOpen: () => {
          Swal.showLoading(); // Muestra el spinner de carga
        },
      });
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        Swal.close();
        throw new Error("Login failed");
      }
  
      Swal.close();
      const data = await response.json();
      console.log("Login success:", data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.userId.toString());
      const usersResponse = await fetch("http://localhost:8080/usuarios/todos", {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }
  
      const usersData = await usersResponse.json();
      console.log("Users data:", usersData);
      const usuarioActual = usersData.data.find((user: { id: any; }) => user.id === data.userId);
      console.log("Usuario guardado en localStorage:", usuarioActual);

      if (usuarioActual && usuarioActual.username) {
        // Guardar el username en localStorage
        localStorage.setItem("userName", usuarioActual.username);
        console.log("Usuario guardado en localStorage:", usuarioActual.username);
      } else {
        console.error("Usuario no encontrado o username no disponible");
      }
      console.log("User ID saved:", localStorage.getItem("userId"));
  
      if (data.role === "ROLE_USUARIOEXTERNO") {
        if (usuarioActual.nuevaCuenta) {
          navigate("/ChangePassword"); 
        } else {
          navigate("/tablaRequerimientos");
        }
      } else if (data.role === "ROLE_ADMIN") {
        const adminResponse = await fetch(`http://localhost:8080/admin/${username}/adminDetalle`, {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });
        navigate("/gestionarUsuarios");
        if (!adminResponse.ok) {
          throw new Error("Failed to fetch admin data");
        }
  
        const adminData = await adminResponse.json();
        console.log("Admin data:", adminData);
  
        if (adminData.data && adminData.data.username) {
          localStorage.setItem("userName", adminData.data.username);
          console.log("Admin guardado en localStorage:", adminData.data.username);
        } else {
          console.error("Admin no encontrado o username no disponible");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("Error", "Usuario o contraseña inválidos");
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
<GrLogin className="w-11 h-11 mx-auto mb-4" />
<input type="username" onChange={(e) => setloginUsername(e.target.value)} name="username" placeholder="Nombre de usuario" required />
            <input ref={passwordRef} onChange={(e) => setloginPassword(e.target.value)} type="password" name="password" placeholder="Contraseña" required />
            <div className="showPasswordDiv">
              <input type="checkbox" onChange={togglePasswordVisibility} />
              <label>Mostrar contraseña</label>
            </div>
            <button type="button" className='loginButton' onClick={handleLogin}>Iniciar sesión</button>
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
