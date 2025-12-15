import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function HacerPedido() {
  const { id } = useParams(); // ID de la tienda destino
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [clienteId, setClienteId] = useState(null);
  const [tienda, setTienda] = useState(null);
  const [bocadillos, setBocadillos] = useState([]);

  const [carrito, setCarrito] = useState([]);
  const [observaciones, setObservaciones] = useState("");

  // ================================
  // 1️⃣ Cargar cliente logueado
  // ================================
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const resp = await fetch("http://localhost:8080/api/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        const cliente = data.find((c) => c.username === username);

        if (cliente) setClienteId(cliente.id);
        else console.error("Cliente no encontrado.");
      } catch (err) {
        console.error("Error cargando cliente:", err);
      }
    };

    fetchCliente();
  }, []);

  // ================================
  // 2️⃣ Cargar tienda
  // ================================
  useEffect(() => {
    const fetchTienda = async () => {
      const resp = await fetch(`http://localhost:8080/api/tiendas/${id}`);
      const data = await resp.json();
      setTienda(data);
    };

    fetchTienda();
  }, [id]);

  // ================================
  // 3️⃣ Cargar bocadillos
  // ================================
  useEffect(() => {
    const fetchBocadillos = async () => {
      const resp = await fetch(
        `http://localhost:8080/api/bocadillos/tienda/${id}/listar`
      );

      const data = await resp.json();
      setBocadillos(data);
    };

    fetchBocadillos();
  }, [id]);

  // ================================
  // 🛒 Añadir al carrito
  // ================================
  const agregarAlCarrito = (b) => {
    setCarrito((prev) => [...prev, b]);
  };

  // ================================
  // 🗑 Quitar del carrito
  // ================================
  const quitarDelCarrito = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  // ================================
  // 💰 Total
  // ================================
  const total = carrito.reduce((acc, b) => acc + b.precio, 0);

  // ================================
  // 🚀 Enviar pedido (FORMATO CORRECTO)
  // ================================
  const realizarPedido = async () => {
    if (!clienteId) return alert("Error: Cliente no encontrado.");
    if (carrito.length === 0) return alert("El carrito está vacío.");

    const body = {
      observaciones,
      bocadillos: carrito.map((b) => ({ id: b.id })), // 👈 FORMATO CORRECTO
    };

    console.log("📦 BODY ENVIADO AL BACKEND:", body);

    const resp = await fetch(
      `http://localhost:8080/api/pedidos/cliente/${clienteId}/tienda/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (resp.ok) {
      alert("🎉 Pedido realizado correctamente");
      navigate("/clienteDashboard");
    } else {
      const errorText = await resp.text();
      console.error("❌ ERROR DEL SERVIDOR:", errorText);
      alert("Error al realizar pedido:\n" + errorText);
    }
  };

  if (!tienda)
    return <p className="p-6 text-center text-xl">Cargando pedido...</p>;

  return (
    <div className="min-h-screen bg-orange-50 p-6 md:p-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition shadow-md"
      >
        ⬅ Volver
      </button>

      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 text-center mb-10">
        Pedido a {tienda.nombre}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LISTA DE BOCADILLOS */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-4 text-orange-600">
            Elige tus bocadillos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bocadillos.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition"
              >
                <img
                  src={b.imagenUrl}
                  alt={b.nombre}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />

                <h3 className="text-xl font-bold">{b.nombre}</h3>
                <p className="text-gray-600">{b.descripcion}</p>

                <p className="text-orange-600 font-bold mt-2">{b.precio} €</p>

                <button
                  onClick={() => agregarAlCarrito(b)}
                  className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 w-full transition"
                >
                  Añadir al pedido ➕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN */}
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            🛒 Tu pedido
          </h2>

          {carrito.length === 0 ? (
            <p className="text-gray-500">Aún no has añadido nada.</p>
          ) : (
            carrito.map((b, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-orange-100 rounded-xl p-3 mb-3"
              >
                <span>
                  {b.nombre} — {b.precio}€
                </span>
                <button
                  onClick={() => quitarDelCarrito(index)}
                  className="text-red-600 hover:text-red-800 text-lg"
                >
                  ✖
                </button>
              </div>
            ))
          )}

          <label className="block mt-4 font-semibold text-gray-700">
            Observaciones:
          </label>
          <textarea
            className="w-full p-3 mt-1 rounded-xl border shadow"
            rows="4"
            placeholder="Sin tomate..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />

          <p className="text-xl font-bold text-orange-600 mt-4">
            Total: {total.toFixed(2)} €
          </p>

          <button
            onClick={realizarPedido}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-2xl text-xl font-bold hover:bg-green-700 transition"
          >
            ✔ Realizar pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default HacerPedido;
