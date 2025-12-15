import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TiendaCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = "https://mrbocadillo-backend.onrender.com";

  const [tienda, setTienda] = useState(null);
  const [bocadillos, setBocadillos] = useState([]);

  const token = localStorage.getItem("token");

  // ============================
  // Cargar tienda
  // ============================
  useEffect(() => {
    const fetchTienda = async () => {
      const resp = await fetch(`${API}/api/tiendas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      setTienda(data);
    };
    fetchTienda();
  }, [id]);

  // ============================
  // Cargar bocadillos
  // ============================
  useEffect(() => {
    const fetchBocadillos = async () => {
      const resp = await fetch(`${API}/api/bocadillos/tienda/${id}/listar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      setBocadillos(data);
    };
    fetchBocadillos();
  }, [id]);

  if (!tienda)
    return <p className="p-6 text-center text-xl">Cargando tienda...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-200 p-4 md:p-8">

      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate("/clienteDashboard")}
        className="mb-6 bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition shadow-md"
      >
        ⬅ Volver
      </button>

      {/* HEADER DE LA TIENDA */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-10 flex flex-col md:flex-row gap-8 md:items-center">

        <img
          src={tienda.imagenUrl}
          alt={tienda.nombre}
          className="w-full md:w-64 md:h-64 object-cover rounded-3xl shadow-md"
        />

        <div className="flex flex-col justify-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 drop-shadow-sm">
            {tienda.nombre}
          </h1>

          <p className="text-gray-700 text-lg md:text-xl flex items-center gap-2">
            📍 {tienda.direccion}
          </p>

          <p className="text-gray-700 text-lg md:text-xl flex items-center gap-2">
            📞 {tienda.telefono}
          </p>

          <div className="mt-4">
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full shadow">
              🟢 Abierto
            </span>
          </div>
        </div>

      </div>

      {/* CATÁLOGO */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-6 text-center drop-shadow-sm">
        Nuestro catálogo 🥪
      </h2>

      {/* GRID DE BOCADILLOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bocadillos.map((b) => (
          <div
            key={b.id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <img
              src={b.imagenUrl}
              alt={b.nombre}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h3 className="text-2xl font-bold text-gray-800">{b.nombre}</h3>

            <p className="text-gray-600 mt-2 line-clamp-3">
              {b.descripcion}
            </p>

            <p className="mt-4 text-orange-600 font-bold text-xl">
              {b.precio} €
            </p>
          </div>
        ))}
      </div>

      {/* BOTÓN HACER PEDIDO */}
      <div className="text-center mt-12">
        <button
          onClick={() => navigate(`/hacer-pedido/${id}`)}
          className="px-10 py-4 bg-orange-600 text-white text-xl font-bold rounded-3xl shadow-xl hover:bg-orange-700 transition transform hover:scale-105"
        >
          🛒 Hacer pedido
        </button>
      </div>

    </div>
  );
}

export default TiendaCliente;