import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Guarda token y rol en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("username", data.username);

        setMessage("✅ Inicio de sesión exitoso");

        // Redirigir según el rol
        if (data.rol === "ADMIN") {
          navigate("/adminDashboard");
        } else if (data.rol === "TIENDA") {
          navigate("/tiendaDashboard");
        } else if (data.rol === "CLIENTE") {
          navigate("/clienteDashboard");
        }
      } else {
        const errorText = await response.text();
        setMessage("❌ " + errorText);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMessage("⚠ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
        
        {/* 🔸 Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Logo MrBocadillo"
            className="w-40 h-auto drop-shadow-md"
          />
        </div>

        <p className="text-gray-500 mb-8">Inicia sesión</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario o correo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            Entrar
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm font-semibold text-gray-700">{message}</p>
        )}

        <p className="text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-orange-500 hover:underline font-semibold"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;