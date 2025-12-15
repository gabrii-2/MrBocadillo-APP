import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PerfilTienda() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [tienda, setTienda] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Carga la tienda por username
  useEffect(() => {
    const fetchTienda = async () => {
      const resp = await fetch("http://localhost:8080/api/tiendas");
      const data = await resp.json();
      const t = data.find((ti) => ti.username === username);
      setTienda(t);
    };
    fetchTienda();
  }, []);

  const handleChange = (e) => {
    setTienda({
      ...tienda,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = async () => {
    const resp = await fetch(
      `http://localhost:8080/api/tiendas/${tienda.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tienda),
      }
    );

    if (resp.ok) {
      setMensaje("✔ Datos actualizados correctamente");
    } else {
      setMensaje("❌ Error al actualizar los datos");
    }
  };

  if (!tienda) return <p className="p-6">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300 p-6 flex justify-center">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10">

        {/* volver */}
        <button
          onClick={() => navigate("/tiendaDashboard")}
          className="mb-6 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
        >
          ⬅ Volver
        </button>

        <h1 className="text-4xl font-extrabold text-orange-600 text-center mb-10">
          Mi perfil de tienda 🏪
        </h1>

        {/* FOTO */}
        <div className="flex justify-center mb-8">
          <img
            src={tienda.imagenUrl || "https://cdn-icons-png.flaticon.com/512/726/726496.png"}
            className="w-32 h-32 rounded-2xl object-cover shadow-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Nombre</label>
            <input
              name="nombre"
              value={tienda.nombre || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Email</label>
            <input
              name="email"
              value={tienda.email || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Teléfono</label>
            <input
              name="telefono"
              value={tienda.telefono || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Dirección</label>
            <input
              name="direccion"
              value={tienda.direccion || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">Imagen (URL)</label>
            <input
              name="imagenUrl"
              value={tienda.imagenUrl || ""}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-orange-400"
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
              className="p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-orange-400"
              placeholder="Déjalo vacío si no quieres cambiarla"
            />
          </div>

        </div>

        {/* mensaje */}
        {mensaje && (
          <p className="text-center mt-6 text-lg font-semibold">{mensaje}</p>
        )}

        {/* botón guardar */}
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