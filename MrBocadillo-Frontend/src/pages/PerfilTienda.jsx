import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PerfilTienda() {
  const navigate = useNavigate();

  const API = "https://mrbocadillo-backend.onrender.com";

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [tienda, setTienda] = useState(null);
  const [original, setOriginal] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // ================================
  // 🔸 Cargar tienda por username
  // ================================
  useEffect(() => {
    const fetchTienda = async () => {
      try {
        const resp = await fetch(`${API}/api/tiendas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        const t = data.find((ti) => ti.username === username);

        if (!t) return;

        delete t.password;

        setTienda({ ...t, password: "" });
        setOriginal({ ...t, password: "" });
      } catch (err) {
        console.error("Error cargando tienda:", err);
      }
    };

    fetchTienda();
  }, []);

  const handleChange = (e) => {
    setTienda({
      ...tienda,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // 🔸 Enviar solo campos modificados
  // ================================
  const buildPatchBody = () => {
    const body = {};

    if (tienda.nombre !== original.nombre) body.nombre = tienda.nombre;
    if (tienda.email !== original.email) body.email = tienda.email;
    if (tienda.telefono !== original.telefono) body.telefono = tienda.telefono;
    if (tienda.direccion !== original.direccion) body.direccion = tienda.direccion;
    if (tienda.imagenUrl !== original.imagenUrl) body.imagenUrl = tienda.imagenUrl;

    if (tienda.password && tienda.password.trim() !== "") {
      body.password = tienda.password;
    }

    return body;
  };

  const handleGuardar = async () => {
    const body = buildPatchBody();

    if (Object.keys(body).length === 0) {
      setMensaje("⚠ No hay cambios para guardar.");
      return;
    }

    try {
      const resp = await fetch(`${API}/api/tiendas/${tienda.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        setMensaje("✔ Datos actualizados correctamente");
        setOriginal({ ...tienda, password: "" });
      } else {
        setMensaje("❌ Error al actualizar los datos");
      }
    } catch (err) {
      console.error(err);
      setMensaje("⚠ Error de conexión");
    }
  };

  if (!tienda) return <p className="p-6 text-center text-lg">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300 p-4 sm:p-6 flex justify-center">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10">

        {/* BOTÓN VOLVER */}
        <button
          onClick={() => navigate("/tiendaDashboard")}
          className="mb-6 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
        >
          ⬅ Volver
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600 text-center mb-10">
          Mi perfil de tienda 🏪
        </h1>

        {/* FOTO */}
        <div className="flex justify-center mb-8">
          <img
            src={tienda.imagenUrl || "https://cdn-icons-png.flaticon.com/512/726/726496.png"}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-xl"
            alt="Imagen tienda"
          />
        </div>

        {/* FORMULARIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Nombre</label>
            <input
              name="nombre"
              value={tienda.nombre || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Email</label>
            <input
              name="email"
              value={tienda.email || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Teléfono</label>
            <input
              name="telefono"
              value={tienda.telefono || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Dirección</label>
            <input
              name="direccion"
              value={tienda.direccion || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">Imagen (URL)</label>
            <input
              name="imagenUrl"
              value={tienda.imagenUrl || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">
              Nueva contraseña (opcional)
            </label>
            <input
              type="password"
              name="password"
              value={tienda.password || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
              placeholder="Déjalo vacío si no quieres cambiarla"
            />
          </div>
        </div>

        {/* MENSAJE */}
        {mensaje && (
          <p className="text-center mt-6 text-lg font-semibold">{mensaje}</p>
        )}

        {/* BOTÓN GUARDAR */}
        <div className="text-center mt-8">
          <button
            onClick={handleGuardar}
            className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow hover:bg-orange-600 transition"
          >
            Guardar cambios ✔
          </button>
        </div>

      </div>
    </div>
  );
}

export default PerfilTienda;