import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

function AdminDashboard() {
  const [section, setSection] = useState("tiendas");
  const [tiendas, setTiendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const API = "https://mrbocadillo-backend.onrender.com";

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // -------------------------------
  // CARGAR DATOS
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiendasResp, clientesResp, pedidosResp] = await Promise.all([
          fetch(`${API}/api/tiendas`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/pedidos`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [tiendasData, clientesData, pedidosData] = await Promise.all([
          tiendasResp.json(),
          clientesResp.json(),
          pedidosResp.json(),
        ]);

        setTiendas(tiendasData);
        setClientes(clientesData);
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, [token]);

  // -------------------------------
  // FILTRO DE TIENDAS
  // -------------------------------
  const tiendasFiltradas = tiendas.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // -------------------------------
  // ELIMINAR TIENDA
  // -------------------------------
  const handleEliminarTienda = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta tienda?")) return;

    try {
      await fetch(`${API}/api/tiendas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTiendas(tiendas.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error eliminando tienda:", error);
    }
  };

  // -------------------------------
  // ELIMINAR CLIENTE
  // -------------------------------
  const handleEliminarCliente = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este cliente?")) return;

    try {
      await fetch(`${API}/api/clientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(clientes.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  // -------------------------------
  // RENDER SECCIONES
  // -------------------------------
  const renderSection = () => {
    switch (section) {
      case "tiendas":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Tiendas Registradas</h2>

            <input
              type="text"
              placeholder="🔍 Buscar tienda..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full max-w-md p-3 rounded-xl border shadow mb-6"
            />

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-lg">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Nombre</th>
                    <th className="py-3 px-4 text-left">Usuario</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Teléfono</th>
                    <th className="py-3 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {tiendasFiltradas.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-orange-50">
                      <td className="py-2 px-4">{t.nombre}</td>
                      <td className="py-2 px-4">{t.username}</td>
                      <td className="py-2 px-4">{t.email}</td>
                      <td className="py-2 px-4">{t.telefono}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleEliminarTienda(t.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "clientes":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Clientes Registrados</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-lg">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Nombre</th>
                    <th className="py-3 px-4 text-left">Apellido</th>
                    <th className="py-3 px-4 text-left">Usuario</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-orange-50">
                      <td className="py-2 px-4">{c.nombre}</td>
                      <td className="py-2 px-4">{c.apellido}</td>
                      <td className="py-2 px-4">{c.username}</td>
                      <td className="py-2 px-4">{c.email}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleEliminarCliente(c.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "pedidos":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Pedidos</h2>

            {pedidos.length === 0 ? (
              <p>No hay pedidos todavía.</p>
            ) : (
              pedidos.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-xl shadow mb-4">
                  <h3 className="font-semibold">
                    Pedido #{p.id} — {p.tienda?.nombre}
                  </h3>
                  <p>Cliente: {p.cliente?.nombre} {p.cliente?.apellido}</p>
                  <p>Fecha: {p.fechaCreacion}</p>
                  <p className="font-bold mt-2">Total: {p.total} €</p>
                  <span className={`px-3 py-1 mt-3 inline-block text-white rounded-xl 
                    ${p.estado === "ENTREGADO" ? "bg-green-500" : "bg-orange-500"}`}>
                    {p.estado}
                  </span>
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* BOTÓN MENU MOVIL */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-4 text-3xl text-orange-600"
      >
        <FiMenu />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-60 bg-orange-500 text-white flex flex-col items-center transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div
          className="w-20 h-20 rounded-full bg-white mt-6 mb-4 shadow-lg overflow-hidden cursor-pointer"
          onClick={() => navigate("/perfil")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-xl font-bold mb-4">MrBocadillo 🥪</h2>

        <nav className="flex-1 w-full px-6 space-y-3 text-lg">
          <button
            onClick={() => setSection("tiendas")}
            className={`w-full text-left px-3 py-2 rounded-lg ${section === "tiendas" ? "bg-orange-600" : "hover:bg-orange-600"}`}
          >
            🏪 Tiendas
          </button>
          <button
            onClick={() => setSection("clientes")}
            className={`w-full text-left px-3 py-2 rounded-lg ${section === "clientes" ? "bg-orange-600" : "hover:bg-orange-600"}`}
          >
            👥 Clientes
          </button>
          <button
            onClick={() => setSection("pedidos")}
            className={`w-full text-left px-3 py-2 rounded-lg ${section === "pedidos" ? "bg-orange-600" : "hover:bg-orange-600"}`}
          >
            🧾 Pedidos
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mb-6 bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700"
        >
          🔒 Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-4 md:p-8">{renderSection()}</main>
    </div>
  );
}

export default AdminDashboard;