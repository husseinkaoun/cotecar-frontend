import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const data = await apiFetch("/cars");
        setCars(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e?.message || String(e));
      }
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Cars</h2>

      {err ? (
        <pre style={{ color: "crimson" }}>{err}</pre>
      ) : cars.length === 0 ? (
        <div>No cars yet</div>
      ) : (
        <ul>
          {cars.map((c) => (
            <li key={c.id}>
              {c.title} — {c.brand} {c.model} ({c.year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
