import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BocadilloNuevo() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const tiendaId = localStorage.getItem("tiendaId");

  const API = "https://mrbocadillo-backend.onrender.com";

  const [bocadillo, setBocadillo] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagenUrl: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setBocadillo({
      ...bocadillo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrear = async () => {
    if (!bocadillo.nombre || !bocadillo.descripcion || !bocadillo.precio) {
      setMensaje("⚠ Rellena todos los campos obligatorios.");
      return;
    }

    const resp = await fetch(`${API}/api/bocadillos/tienda/${tiendaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bocadillo),
    });

    if (resp.ok) {
      setMensaje("🍔 Bocadillo creado correctamente");
      setTimeout(() => navigate("/tiendaDashboard"), 1000);
    } else {
      setMensaje("❌ Error al crear el bocadillo.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300 p-4 md:p-6 flex justify-center items-center">

      <div className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-3xl shadow-2xl">

        {/* BOTÓN VOLVER */}
        <button
          onClick={() => navigate("/tiendaDashboard")}
          className="mb-6 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
        >
          ⬅ Volver
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-orange-600 text-center mb-8">
          Crear nuevo bocadillo 🥪
        </h1>

        {/* FORMULARIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              name="nombre"
              value={bocadillo.nombre}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
              placeholder="Ej. Bocadillo de pollo"
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Precio (€) *</label>
            <input
              type="number"
              name="precio"
              value={bocadillo.precio}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
              placeholder="4.50"
            />
          </div>

          {/* Imagen */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700 mb-1">Imagen (URL)</label>
            <input
              name="imagenUrl"
              value={bocadillo.imagenUrl}
              onChange={handleChange}
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
              placeholder="https://imagen.com/bocadillo.jpg"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700 mb-1">Descripción *</label>
            <textarea
              name="descripcion"
              value={bocadillo.descripcion}
              onChange={handleChange}
              rows="4"
              className="p-3 rounded-xl border shadow focus:ring-2 focus:ring-orange-400"
              placeholder="Describe el bocadillo..."
            ></textarea>
          </div>
        </div>

        {/* MENSAJE */}
        {mensaje && (
          <p className="text-center mt-4 text-lg font-semibold text-gray-800">
            {mensaje}
          </p>
        )}

        {/* BOTÓN GUARDAR */}
        <div className="text-center mt-8">
          <button
            onClick={handleCrear}
            className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow hover:bg-orange-600 transition w-full md:w-auto"
          >
            Crear bocadillo 🍴
          </button>
        </div>
      </div>
    </div>
  );
}

export default BocadilloNuevo;