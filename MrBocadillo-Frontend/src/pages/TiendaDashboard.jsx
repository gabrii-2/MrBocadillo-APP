import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiX, FiCheck, FiImage } from "react-icons/fi";

function TiendaDashboard() {
  const navigate = useNavigate();

  const API = "https://mrbocadillo-backend.onrender.com";

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [section, setSection] = useState("catalogo");
  const [tienda, setTienda] = useState(null);
  const [bocadillos, setBocadillos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [modalImg, setModalImg] = useState(null);

  // ============================
  // CARGAR TIENDA
  // ============================
  useEffect(() => {
    const fetchTienda = async () => {
      const resp = await fetch(`${API}/api/tiendas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      const t = data.find((ti) => ti.username === username);
      setTienda(t);

      localStorage.setItem("tiendaId", t.id);
    };

    fetchTienda();
  }, []);

  // ============================
  // CARGAR BOCADILLOS
  // ============================
  useEffect(() => {
    if (!tienda) return;

    const fetchBocadillos = async () => {
      const resp = await fetch(`${API}/api/bocadillos/tienda/${tienda.id}/listar`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      setBocadillos(data);
    };

    fetchBocadillos();
  }, [tienda]);

  // ============================
  // CARGAR PEDIDOS
  // ============================
  useEffect(() => {
    if (!tienda) return;

    const fetchPedidos = async () => {
      const resp = await fetch(`${API}/api/pedidos/tienda/${tienda.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      setPedidos(data);
    };

    fetchPedidos();
  }, [tienda]);

  // ============================
  // INICIAR EDICIÓN
  // ============================
  const startEdit = (b) => {
    setEditId(b.id);
    setEditData({
      nombre: b.nombre,
      descripcion: b.descripcion,
      precio: b.precio,
      imagenUrl: b.imagenUrl,
    });
  };

  // ============================
  // CAMBIAR ESTADO DE PEDIDO
  // ============================
  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    const resp = await fetch(`${API}/api/pedidos/${pedidoId}/preparar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resp.ok) {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
        )
      );
    }
  };

  // ============================
  // GUARDAR EDICIÓN
  // ============================
  const saveEdit = async () => {
    const resp = await fetch(`${API}/api/bocadillos/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    if (resp.ok) {
      setBocadillos((prev) =>
        prev.map((b) => (b.id === editId ? { ...b, ...editData } : b))
      );
      setEditId(null);
    }
  };

  // ============================
  // BORRAR BOCADILLO
  // ============================
  const deleteBocadillo = async () => {
    const resp = await fetch(`${API}/api/bocadillos/${deleteConfirmId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resp.ok) {
      setBocadillos((prev) =>
        prev.filter((b) => b.id !== deleteConfirmId)
      );
      setDeleteConfirmId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!tienda) return <p className="p-6">Cargando...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-orange-500 text-white flex flex-col items-center">
        <div
          className="w-24 h-24 bg-white rounded-full mt-6 mb-4 shadow-xl cursor-pointer flex items-center justify-center"
          onClick={() => navigate("/perfil-tienda")}
        >
          <img
            src={tienda.imagenUrl || "https://cdn-icons-png.flaticon.com/512/726/726496.png"}
            alt="perfil"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold">Mi Tienda 🏪</h2>

        <nav className="flex-1 w-full px-6 mt-4 space-y-3">
          <button
            onClick={() => setSection("catalogo")}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              section === "catalogo" ? "bg-orange-600" : "hover:bg-orange-600"
            }`}
          >
            📦 Mi catálogo
          </button>

          <button
            onClick={() => setSection("pedidos")}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              section === "pedidos" ? "bg-orange-600" : "hover:bg-orange-600"
            }`}
          >
            🧾 Pedidos recibidos
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
      <main className="flex-1 p-8">

        {/* ============================
            CATÁLOGO
        ============================ */}
        {section === "catalogo" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Mi catálogo</h2>

            <button
              onClick={() => navigate("/bocadillo-nuevo")}
              className="mb-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
            >
              ➕ Añadir bocadillo
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bocadillos.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-5 shadow-xl">

                  {editId === b.id ? (
                    <>
                      <input
                        className="w-full p-2 rounded border mb-2"
                        value={editData.nombre}
                        onChange={(e) =>
                          setEditData({ ...editData, nombre: e.target.value })
                        }
                      />

                      <textarea
                        className="w-full p-2 rounded border mb-2"
                        value={editData.descripcion}
                        onChange={(e) =>
                          setEditData({ ...editData, descripcion: e.target.value })
                        }
                      />

                      <input
                        type="number"
                        className="w-full p-2 rounded border mb-2"
                        value={editData.precio}
                        onChange={(e) =>
                          setEditData({ ...editData, precio: e.target.value })
                        }
                      />

                      <input
                        className="w-full p-2 rounded border mb-2"
                        value={editData.imagenUrl}
                        onChange={(e) =>
                          setEditData({ ...editData, imagenUrl: e.target.value })
                        }
                      />

                      <div className="flex justify-between mt-3">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                        >
                          <FiCheck /> Guardar
                        </button>

                        <button
                          onClick={() => setEditId(null)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                        >
                          <FiX /> Cancelar
                        </button>
                      </div>
                    </>
                  ) : deleteConfirmId === b.id ? (
                    <>
                      <p className="text-center font-semibold text-gray-800 mb-3">
                        ¿Seguro que quieres borrar este bocadillo?
                      </p>

                      <div className="flex justify-between mt-3">
                        <button
                          onClick={deleteBocadillo}
                          className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                        >
                          Sí, borrar
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={b.imagenUrl}
                        alt={b.nombre}
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />

                      <h3 className="text-xl font-bold">{b.nombre}</h3>
                      <p className="text-gray-600 mb-2">
                        {b.descripcion?.substring(0, 60)}...
                      </p>
                      <p className="font-bold text-orange-600 text-lg">{b.precio} €</p>

                      <div className="flex justify-between mt-3">
                        <button
                          onClick={() => startEdit(b)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                        >
                          <FiEdit2 /> Editar
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(b.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                        >
                          <FiTrash2 /> Borrar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============================
            PEDIDOS RECIBIDOS
        ============================ */}
        {section === "pedidos" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Pedidos recibidos</h2>

            {pedidos.length === 0 ? (
              <p className="text-gray-600">Aún no tienes pedidos.</p>
            ) : (
              <div className="space-y-6">
                {pedidos.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl shadow-xl">

                    <h3 className="text-xl font-bold text-orange-600">
                      Pedido #{p.id}
                    </h3>

                    <p>👤 Cliente: <b>{p.cliente.nombre}</b></p>
                    <p>🕒 {p.fechaCreacion.replace("T", " • ")}</p>
                    <p>📝 {p.observaciones || "Sin observaciones"}</p>

                    <h4 className="mt-3 font-bold">🥪 Bocadillos:</h4>

                    <ul className="ml-6 list-disc">
                      {p.bocadillos.map((b) => (
                        <li
                          key={b.id}
                          className="text-blue-600 cursor-pointer hover:underline flex items-center gap-2"
                          onClick={() => setModalImg(b.imagenUrl)}
                        >
                          <FiImage />
                          {b.nombre}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-3 font-bold text-orange-600 text-lg">
                      💰 Total: {p.total} €
                    </p>

                    <div className="mt-4">
                      <label className="font-semibold">Estado:</label>

                      <select
                        className="ml-3 border p-2 rounded"
                        value={p.estado}
                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="PREPARADO">PREPARADO</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ============================
            MODAL FOTO
        ============================ */}
        {modalImg && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setModalImg(null)}
          >
            <img src={modalImg} className="max-w-md rounded-2xl shadow-2xl" />
          </div>
        )}

      </main>
    </div>
  );
}

export default TiendaDashboard;