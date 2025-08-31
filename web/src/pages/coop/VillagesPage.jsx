import { useEffect, useState } from "react";

export default function VillagesPage() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVillages() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/v1/geography/villages", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch villages");
        const data = await res.json();
        setVillages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVillages();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Villages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : villages.length === 0 ? (
        <p>No villages found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">District</th>
            </tr>
          </thead>
          <tbody>
            {villages.map((village) => (
              <tr key={village.id}>
                <td className="border px-2 py-1">{village.name}</td>
                <td className="border px-2 py-1">{village.district_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
