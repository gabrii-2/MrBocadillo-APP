import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClienteDashboard() {
  const [section, setSection] = useState("tiendas");
  const [tiendas, setTiendas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [clienteId, setClienteId] = useState(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const API = "https://mrbocadillo-backend.onrender.com";

  const navigate = useNavigate();

  // --------------------------
  // CERRAR SESIÓN
  // --------------------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --------------------------
  // 1️⃣ OBTENER CLIENTE
  // --------------------------
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const resp = await fetch(`${API}/api/clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        const cliente = data.find((c) => c.username === username);

        if (cliente) setClienteId(cliente.id);
      } catch (error) {
        console.error("Error obteniendo cliente:", error);
      }
    };

    fetchCliente();
  }, []);

  // --------------------------
  // 2️⃣ CARGAR TIENDAS
  // --------------------------
  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const resp = await fetch(`${API}/api/tiendas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        setTiendas(data);
      } catch (error) {
        console.error("Error cargando tiendas:", error);
      }
    };

    fetchTiendas();
  }, []);

  // --------------------------
  // 3️⃣ CARGAR PEDIDOS CLIENTE
  // --------------------------
  useEffect(() => {
    if (!clienteId) return;

    const fetchPedidos = async () => {
      try {
        const resp = await fetch(`${API}/api/pedidos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        setPedidos(data.filter((p) => p.cliente?.id === clienteId));
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      }
    };

    fetchPedidos();
  }, [clienteId]);

  // --------------------------
  // FILTRO TIENDAS
  // --------------------------
  const tiendasFiltradas = tiendas.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --------------------------
  // RESPONSIVE SIDEBAR + CONTENIDO
  // --------------------------
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-orange-500 text-white flex md:flex-col items-center md:items-center p-4 md:p-0">

        {/* FOTO */}
        <div
          className="w-20 h-20 bg-white rounded-full mt-2 md:mt-6 mb-4 flex items-center justify-center cursor-pointer shadow-lg"
          onClick={() => navigate("/perfil")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            alt="perfil"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4 hidden md:block">MrBocadillo 🥪</h2>

        {/* NAV */}
        <nav className="flex md:flex-col w-full px-4 md:px-6 space-x-4 md:space-x-0 md:space-y-3 justify-center">
          <button
            onClick={() => setSection("tiendas")}
            className={`px-3 py-2 rounded-lg ${
              section === "tiendas"
                ? "bg-orange-600"
                : "hover:bg-orange-600"
            }`}
          >
            🏪 Tiendas
          </button>

          <button
            onClick={() => setSection("pedidos")}
            className={`px-3 py-2 rounded-lg ${
              section === "pedidos"
                ? "bg-orange-600"
                : "hover:bg-orange-600"
            }`}
          >
            🧾 Mis pedidos
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="hidden md:block mb-6 bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 transition"
        >
          🔒 Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6 md:p-8">

        {/* -------------------------- */}
        {/* TIENDAS */}
        {/* -------------------------- */}
        {section === "tiendas" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Tiendas</h2>

            {/* BUSCADOR */}
            <input
              type="text"
              placeholder="🔍 Buscar tienda..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full max-w-md p-3 rounded-2xl border shadow mb-6 focus:ring-2 focus:ring-orange-400 outline-none"
            />

            {/* GRID RESPONSIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiendasFiltradas.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition"
                >
                  {t.imagenUrl && (
                    <img
                      src={t.imagenUrl}
                      alt={t.nombre}
                      className="w-full h-40 object-cover rounded-xl mb-3"
                    />
                  )}

                  <h3 className="text-xl font-semibold">{t.nombre}</h3>
                  <p className="text-gray-500">{t.direccion}</p>

                  <div className="flex justify-between mt-4">
                    <span className="text-gray-600">📞 {t.telefono}</span>
                    <button
                      onClick={() => navigate(`/tienda/${t.id}`)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
                    >
                      Ver tienda
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* -------------------------- */}
        {/* MIS PEDIDOS */}
        {/* -------------------------- */}
        {section === "pedidos" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Mis pedidos</h2>

            {pedidos.length === 0 ? (
              <p>No tienes pedidos todavía.</p>
            ) : (
              pedidos.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-5 rounded-xl shadow border mb-4"
                >
                  <h3 className="font-semibold">
                    Pedido #{p.id} — {p.tienda?.nombre}
                  </h3>

                  <p>Fecha: {p.fechaCreacion.replace("T", " • ")}</p>

                  <p className="font-bold mt-2">Total: {p.total} €</p>

                  <span
                    className={`px-3 py-1 mt-3 inline-block text-white rounded-xl ${
                      p.estado === "PREPARADO" ? "bg-green-500" : "bg-orange-500"
                    }`}
                  >
                    {p.estado}
                  </span>
                </div>
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default ClienteDashboard;