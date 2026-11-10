import { useEffect, useState } from "react";
import { api, formatMoney, getAuth } from "../api";

export default function MesFacturesPage() {
  const [factures, setFactures] = useState([]);
  const [error, setError] = useState("");
  const auth = getAuth();

  useEffect(() => {
    api.factures.mine().then(setFactures).catch((e) => setError(e.message));
  }, []);

  const total = factures.reduce((sum, f) => sum + f.montant, 0);

  return (
    <>
      <h1>Bonjour {auth.nom}, voici vos factures</h1>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <table>
          <thead>
            <tr><th>N°</th><th>Date</th><th>Objet</th><th>Montant</th></tr>
          </thead>
          <tbody>
            {factures.length === 0 && <tr><td colSpan="4" className="muted">Vous n'avez aucune facture.</td></tr>}
            {factures.map((f) => (
              <tr key={f.id}>
                <td>{f.id.slice(-6).toUpperCase()}</td>
                <td>{f.date}</td>
                <td>{f.objet}</td>
                <td className="num">{formatMoney(f.montant)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total">Total : <strong>{formatMoney(total)}</strong></div>
      </div>
    </>
  );
}
