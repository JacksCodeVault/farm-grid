import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { getDeliveries, updateDeliveryStatus, dispatchDelivery } from "@/services/apiMethods";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchDeliveries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDeliveries();
      setDeliveries(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateDeliveryStatus(id, { status });
      setToastMessage("Delivery status updated!");
      setToastOpen(true);
      fetchDeliveries();
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Error updating status");
      setToastOpen(true);
    }
  };


  const handleDispatch = async (id) => {
    try {
      const res = await dispatchDelivery(id);
      setToastMessage("Delivery dispatched!");
      setToastOpen(true);
      // Update deliveries state with the new status
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === id ? res.data.delivery : delivery
        )
      );
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Error dispatching delivery");
      setToastOpen(true);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Deliveries</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : deliveries.length === 0 ? (
        <p>No deliveries found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Dispatched</th>
              <th className="border px-2 py-1">Delivered</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td className="border px-2 py-1">{delivery.id}</td>
                <td className="border px-2 py-1">{delivery.status}</td>
                <td className="border px-2 py-1">{["IN_TRANSIT","DELIVERED","VERIFIED","PAID"].includes(delivery.status) ? "Yes" : "No"}</td>
                <td className="border px-2 py-1">{["DELIVERED","VERIFIED","PAID"].includes(delivery.status) ? "Yes" : "No"}</td>
                <td className="border px-2 py-1">
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(delivery.id, "DELIVERED")}
                    disabled={["DELIVERED","VERIFIED","PAID"].includes(delivery.status)}
                  >Mark Delivered</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2"
                    onClick={() => handleDispatch(delivery.id)}
                    disabled={["IN_TRANSIT","DELIVERED","VERIFIED","PAID"].includes(delivery.status)}
                  >Dispatch</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Toast message={toastMessage} open={toastOpen} onOpenChange={setToastOpen} />
    </div>
  );
}
