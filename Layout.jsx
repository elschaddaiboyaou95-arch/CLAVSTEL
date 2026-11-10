import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "./api";

export default function Layout({ children }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <>
      <header className="navbar">
        <div className="brand">Facturation</div>
        <nav>
          {auth.role === "GERANT" ? (
            <>
              <NavLink to="/gerant/clients">Clients</NavLink>
              <NavLink to="/gerant/factures">Factures</NavLink>
            </>
          ) : (
            <NavLink to="/client/factures">Mes factures</NavLink>
          )}
        </nav>
        <div className="user">
          <span>{auth.nom} ({auth.role === "GERANT" ? "Gérant" : "Client"})</span>
          <button className="btn small secondary" onClick={logout}>Déconnexion</button>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
