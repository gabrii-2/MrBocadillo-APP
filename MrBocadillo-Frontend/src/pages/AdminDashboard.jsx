import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [section, setSection] = useState("tiendas");
  const [tiendas, setTiendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔴 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("username");
    navigate("/");
  };

  // ================================
  // CARGAR DATOS
  // ================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiendasResp, clientesResp, pedidosResp] = await Promise.all([
          fetch("http://localhost:8080/api/tiendas", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/clientes", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/pedidos", { headers: { Authorization: `Bearer ${token}` } }),
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

  // ================================
  // FILTRO DE TIENDAS
  // ================================
  const tiendasFiltradas = tiendas.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ================================
  // FUNCIONES DE ELIMINAR
  // ================================
  const handleEliminarTienda = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta tienda?")) return;
    try {
      await fetch(`http://localhost:8080/api/tiendas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTiendas(tiendas.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error eliminando tienda:", error);
    }
  };

  const handleEliminarCliente = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este cliente?")) return;
    try {
      await fetch(`http://localhost:8080/api/clientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(clientes.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  // ================================
  // RENDER DE SECCIONES
  // ================================
  const renderSection = () => {
    switch (section) {
      case "tiendas":
        return (
          <>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Tiendas Registradas</h2>

            <input
              type="text"
              placeholder="🔍 Buscar tienda..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full max-w-md p-3 rounded-2xl border shadow mb-6 focus:ring-2 focus:ring-orange-400 outline-none"
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
                    <tr key={t.id} className="border-b hover:bg-orange-50 transition">
                      <td className="py-2 px-4">{t.nombre}</td>
                      <td className="py-2 px-4">{t.username}</td>
                      <td className="py-2 px-4">{t.email}</td>
                      <td className="py-2 px-4">{t.telefono}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleEliminarTienda(t.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case "clientes":
        return (
          <>
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
                    <tr key={c.id} className="border-b hover:bg-orange-50 transition">
                      <td className="py-2 px-4">{c.nombre}</td>
                      <td className="py-2 px-4">{c.apellido}</td>
                      <td className="py-2 px-4">{c.username}</td>
                      <td className="py-2 px-4">{c.email}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleEliminarCliente(c.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case "pedidos":
        return (
          <>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Pedidos</h2>
            {pedidos.length === 0 ? (
              <p>No hay pedidos todavía.</p>
            ) : (
              pedidos.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-xl shadow border mb-4">
                  <h3 className="font-semibold">
                    Pedido #{p.id} — {p.tienda?.nombre}
                  </h3>
                  <p>Cliente: {p.cliente?.nombre} {p.cliente?.apellido}</p>
                  <p>Fecha: {p.fechaCreacion}</p>
                  <p className="font-bold mt-2">Total: {p.total} €</p>
                  <span
                    className={`px-3 py-1 mt-3 inline-block text-white rounded-xl ${
                      p.estado === "ENTREGADO" ? "bg-green-500" : "bg-orange-500"
                    }`}
                  >
                    {p.estado}
                  </span>
                </div>
              ))
            )}
          </>
        );

      default:
        return null;
    }
  };

  // ================================
  // RENDER PRINCIPAL
  // ================================
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-orange-500 text-white flex flex-col items-center">
        <div
          className="w-24 h-24 bg-white rounded-full mt-6 mb-4 flex items-center justify-center cursor-pointer shadow-lg"
          onClick={() => navigate("/perfil")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            alt="perfil"
            className="w-20 h-20 rounded-full"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4">MrBocadillo 🥪</h2>

        <nav className="flex-1 w-full px-6 space-y-3">
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
          className="mb-6 bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 transition"
        >
          🔒 Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">{renderSection()}</main>
    </div>
  );
}

export default AdminDashboard;
