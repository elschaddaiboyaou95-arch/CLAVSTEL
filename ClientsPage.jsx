import { useEffect, useState } from "react";
import { api } from "../api";

const EMPTY = { id: null, nom: "", tel: "", login: "", password: "" };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null); // null = formulaire masque
  const [error, setError] = useState("");

  const load = async (term = q) => {
    try {
      setClients(await api.clients.list(term));
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(""); }, []);

  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      if (form.id) await api.clients.update(form.id, form);
      else await api.clients.create(form);
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Supprimer ${c.nom} et toutes ses factures ?`)) return;
    try {
      await api.clients.remove(c.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Gestion des clients</h1>
      {error && <div className="error">{error}</div>}

      {form && (
        <div className="card">
          <h2>{form.id ? "Modifier le client" : "Nouveau client"}</h2>
          <form onSubmit={save}>
            <div className="field half"><label>Nom</label><input value={form.nom} onChange={change("nom")} /></div>
            <div className="field half"><label>Téléphone</label><input value={form.tel} onChange={change("tel")} /></div>
            <div className="field half"><label>Login (accès client)</label><input value={form.login} onChange={change("login")} /></div>
            <div className="field half">
              <label>Mot de passe {form.id && "(vide = inchangé)"}</label>
              <input type="password" value={form.password} onChange={change("password")} />
            </div>
            <button className="btn" type="submit">Enregistrer</button>{" "}
            <button className="btn secondary" type="button" onClick={() => setForm(null)}>Annuler</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="toolbar">
          <form onSubmit={(e) => { e.preventDefault(); load(); }}>
            <input placeholder="Rechercher par nom ou téléphone..." value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          <button className="btn" onClick={() => setForm({ ...EMPTY })}>+ Nouveau client</button>
        </div>
        <table>
          <thead>
            <tr><th>Nom</th><th>Téléphone</th><th>Login</th><th style={{ width: 170 }}>Actions</th></tr>
          </thead>
          <tbody>
            {clients.length === 0 && <tr><td colSpan="4" className="muted">Aucun client trouvé.</td></tr>}
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.nom}</td>
                <td>{c.tel}</td>
                <td>{c.login}</td>
                <td>
                  <button className="btn small" onClick={() => setForm({ ...c, password: "" })}>Modifier</button>{" "}
                  <button className="btn small danger" onClick={() => remove(c)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
