import { useEffect, useState } from "react";
import { api, formatMoney } from "../api";

const EMPTY = { id: null, montant: "", objet: "", idClient: "" };

export default function FacturesPage() {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  const load = async (term = q) => {
    try {
      setFactures(await api.factures.list(term));
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load("");
    api.clients.list("").then(setClients).catch((e) => setError(e.message));
  }, []);

  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, montant: parseFloat(form.montant) };
    try {
      if (form.id) await api.factures.update(form.id, payload);
      else await api.factures.create(payload);
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (f) => {
    if (!window.confirm(`Supprimer la facture "${f.objet}" ?`)) return;
    try {
      await api.factures.remove(f.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Gestion des factures</h1>
      {error && <div className="error">{error}</div>}

      {form && (
        <div className="card">
          <h2>{form.id ? "Modifier la facture" : "Nouvelle facture"}</h2>
          <form onSubmit={save}>
            <div className="field half">
              <label>Client</label>
              <select value={form.idClient} onChange={change("idClient")}>
                <option value="">-- Choisir un client --</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div className="field half">
              <label>Montant (FCFA)</label>
              <input type="number" min="0" step="any" value={form.montant} onChange={change("montant")} />
            </div>
            <div className="field full"><label>Objet</label><input value={form.objet} onChange={change("objet")} /></div>
            <button className="btn" type="submit">Enregistrer</button>{" "}
            <button className="btn secondary" type="button" onClick={() => setForm(null)}>Annuler</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="toolbar">
          <form onSubmit={(e) => { e.preventDefault(); load(); }}>
            <input placeholder="Rechercher par objet, client ou numéro..." value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          <button className="btn" onClick={() => setForm({ ...EMPTY })}>+ Nouvelle facture</button>
        </div>
        <table>
          <thead>
            <tr><th>Date</th><th>Client</th><th>Objet</th><th>Montant</th><th style={{ width: 170 }}>Actions</th></tr>
          </thead>
          <tbody>
            {factures.length === 0 && <tr><td colSpan="5" className="muted">Aucune facture trouvée.</td></tr>}
            {factures.map((f) => (
              <tr key={f.id}>
                <td>{f.date}</td>
                <td>{f.clientNom}</td>
                <td>{f.objet}</td>
                <td className="num">{formatMoney(f.montant)}</td>
                <td>
                  <button className="btn small" onClick={() => setForm({ ...f })}>Modifier</button>{" "}
                  <button className="btn small danger" onClick={() => remove(f)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
