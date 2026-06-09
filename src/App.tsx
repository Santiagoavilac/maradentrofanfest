import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import MyQR from "./pages/MyQR";
import QRScanner from "./pages/QRScanner";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/mi-qr/:id" element={<MyQR />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/scanner" element={<QRScanner />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
