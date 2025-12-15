import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const API = "https://mrbocadillo-backend.onrender.com";

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    telefono: "",
    nombre: "",
    apellido: "",
    direccion: "",
    imagenUrl: "",
    rol: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.rol) {
      setMessage("⚠ Por favor, selecciona un rol.");
      return;
    }

    const url =
      form.rol === "CLIENTE"
        ? `${API}/api/auth/registrar/cliente`
        : `${API}/api/auth/registrar/tienda`;

    const body =
      form.rol === "CLIENTE"
        ? {
            username: form.username,
            password: form.password,
            email: form.email,
            telefono: form.telefono,
            nombre: form.nombre,
            apellido: form.apellido,
          }
        : {
            username: form.username,
            password: form.password,
            email: form.email,
            telefono: form.telefono,
            nombre: form.nombre,
            direccion: form.direccion,
            imagenUrl: form.imagenUrl,
          };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setMessage("✅ Registro completado. ¡Ya puedes iniciar sesión!");
        setForm({
          username: "",
          password: "",
          email: "",
          telefono: "",
          nombre: "",
          apellido: "",
          direccion: "",
          imagenUrl: "",
          rol: "",
        });
      } else {
        const errorData = await response.text();
        setMessage("❌ Error: " + errorData);
      }
    } catch (error) {
      setMessage("⚠ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300 p-4">
      
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 w-full max-w-md text-center">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Logo MrBocadillo"
            className="w-32 sm:w-40 h-auto drop-shadow-md"
          />
        </div>

        <p className="text-gray-500 mb-6">
          Crea tu cuenta y empieza a pedir o vender bocadillos 🍔
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          >
            <option value="">Selecciona tu rol</option>
            <option value="CLIENTE">Cliente 🍔</option>
            <option value="TIENDA">Tienda 🏪</option>
          </select>

          {/* CAMPOS DINÁMICOS */}

          {form.rol === "CLIENTE" && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </>
          )}

          {form.rol === "TIENDA" && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la tienda"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                type="text"
                name="imagenUrl"
                placeholder="URL del logo (opcional)"
                value={form.imagenUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition transform hover:scale-[1.02]"
          >
            Registrarse
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm font-semibold text-gray-700">{message}</p>
        )}

        <p className="text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-orange-500 hover:underline font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;