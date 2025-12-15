import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import TiendaDashboard from "./pages/TiendaDashboard";
import PerfilCliente from "./pages/PerfilCliente";
import TiendaCliente from "./pages/TiendaCliente";
import BocadilloNuevo from "./pages/BocadilloNuevo";
import PerfilTienda from "./pages/PerfilTienda";
import HacerPedido from "./pages/HacerPedido";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/clienteDashboard" element={<ClienteDashboard />} />
        <Route path="/tiendaDashboard" element={<TiendaDashboard />} />
        <Route path="/perfil" element={<PerfilCliente />} />
        <Route path="/tienda/:id" element={<TiendaCliente />} />
        <Route path="/bocadillo-nuevo" element={<BocadilloNuevo />} />
        <Route path="/perfil-tienda" element={<PerfilTienda />} />
        <Route path="/hacer-pedido/:id" element={<HacerPedido />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;