import React from 'react'
import { useState } from "react";
function Login() {
    
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
    
  return (
    <div>
      
    </div>
  )
}

export default Login
