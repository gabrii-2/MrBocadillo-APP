import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowLeft } from "react-icons/fi";

function PerfilCliente() {
  const navigate = useNavigate();

  const API = "https://mrbocadillo-backend.onrender.com";

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [cliente, setCliente] = useState(null);
  const [original, setOriginal] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // ================================
  // 🔸 Cargar datos del cliente
  // ================================
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const resp = await fetch(`${API}/api/clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        const encontrado = data.find((c) => c.username === username);

        if (!encontrado) return;

        delete encontrado.password;

        setCliente({ ...encontrado, password: "" });
        setOriginal({ ...encontrado, password: "" });
      } catch (err) {
        console.error("Error cargando cliente:", err);
      }
    };

    fetchCliente();
  }, []);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  // ================================
  // 🔸 Enviar solo campos modificados
  // ================================
  const buildPatchBody = () => {
    const body = {};

    if (cliente.nombre !== original.nombre) body.nombre = cliente.nombre;
    if (cliente.apellido !== original.apellido) body.apellido = cliente.apellido;
    if (cliente.email !== original.email) body.email = cliente.email;
    if (cliente.telefono !== original.telefono) body.telefono = cliente.telefono;

    if (cliente.password && cliente.password.trim() !== "") {
      body.password = cliente.password;
    }

    return body;
  };

  const handleGuardar = async () => {
    const body = buildPatchBody();

    if (Object.keys(body).length === 0) {
      setMensaje("⚠ No hay ningún cambio para guardar.");
      return;
    }

    try {
      const resp = await fetch(`${API}/api/clientes/${cliente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        setMensaje("✅ Perfil actualizado correctamente.");
        setOriginal({ ...cliente, password: "" });
      } else {
        setMensaje("❌ Error al actualizar el perfil.");
      }
    } catch (err) {
      console.error(err);
      setMensaje("⚠ Error de conexión.");
    }
  };

  if (!cliente)
    return <p className="p-6 text-center text-lg">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300 p-4 sm:p-6 flex justify-center">

      <div className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-3xl shadow-2xl">

        {/* BOTÓN VOLVER */}
        <button
          onClick={() => navigate("/clienteDashboard")}
          className="flex items-center text-orange-600 font-semibold hover:text-orange-700 mb-6"
        >
          <FiArrowLeft className="mr-2" size={22} />
          Volver al panel
        </button>

        {/* HEADER */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600 mb-8 text-center">
          Mi Perfil 👤
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
              <FiUser /> Nombre
            </label>
            <input
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Apellido */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
              <FiUser /> Apellido
            </label>
            <input
              name="apellido"
              value={cliente.apellido}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
              <FiMail /> Email
            </label>
            <input
              name="email"
              value={cliente.email}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
              type="email"
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
              <FiPhone /> Teléfono
            </label>
            <input
              name="telefono"
              value={cliente.telefono || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-600 font-semibold mb-1 flex items-center gap-2">
              <FiLock /> Nueva contraseña (opcional)
            </label>
            <input
              name="password"
              placeholder="Déjalo vacío si no quieres cambiarla"
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
              type="password"
            />
          </div>
        </div>

        {/* MENSAJE */}
        {mensaje && (
          <p className="mt-4 text-center font-semibold text-gray-700">
            {mensaje}
          </p>
        )}

        {/* BOTÓN GUARDAR */}
        <div className="text-center mt-8">
          <button
            onClick={handleGuardar}
            className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow hover:bg-orange-600 transition"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerfilCliente;