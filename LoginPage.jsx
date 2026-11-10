import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveAuth } from "../api";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login({ login, password });
      saveAuth(data);
      navigate(data.role === "GERANT" ? "/gerant/clients" : "/client/factures");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-wrap">
      <div className="card">
        <h1>Connexion</h1>
        <p className="muted">Gestion de la facturation - TP2 JEE</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field full">
            <label>Login</label>
            <input value={login} onChange={(e) => setLogin(e.target.value)} autoFocus />
          </div>
          <div className="field full">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn full-btn" type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
