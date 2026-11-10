import { Navigate, Route, Routes } from "react-router-dom";
import { getAuth } from "./api";
import Layout from "./Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import FacturesPage from "./pages/FacturesPage.jsx";
import MesFacturesPage from "./pages/MesFacturesPage.jsx";

// Route protegee : exige une session et le bon role
function Protected({ role, children }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (auth.role !== role) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function Home() {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return <Navigate to={auth.role === "GERANT" ? "/gerant/clients" : "/client/factures"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/gerant/clients" element={<Protected role="GERANT"><ClientsPage /></Protected>} />
      <Route path="/gerant/factures" element={<Protected role="GERANT"><FacturesPage /></Protected>} />
      <Route path="/client/factures" element={<Protected role="CLIENT"><MesFacturesPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
