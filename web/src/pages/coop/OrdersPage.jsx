import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { getOrders, getOrderById, deactivateOrder, acceptOrder } from "@/services/apiMethods";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeactivate = async (id, isActive) => {
    try {
      if (isActive) {
        await deactivateOrder(id);
        setToastMessage("Order deactivated!");
      } else {
        // If you have an activateOrder API method, use it here
        if (typeof activateOrder === "function") {
          await activateOrder(id);
          setToastMessage("Order activated!");
        } else {
          setToastMessage("Activate endpoint not implemented!");
        }
      }
      setToastOpen(true);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, is_active: isActive ? 0 : 1 } : order
        )
      );
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Error updating order");
      setToastOpen(true);
    }
  };

  const handleApprove = async (id) => {
    try {
      await acceptOrder(id);
      setToastMessage("Order approved!");
      setToastOpen(true);
      fetchOrders();
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Error approving order");
      setToastOpen(true);
    }
  };

  const handleViewDetails = async (id) => {
    setSelectedOrder(null);
    setLoading(true);
    try {
      const res = await getOrderById(id);
      setSelectedOrder(res.data);
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Error fetching order details");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Active</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border px-2 py-1">{order.id}</td>
                <td className="border px-2 py-1">{order.status}</td>
                <td className="border px-2 py-1">{order.is_active ? "Yes" : "No"}</td>
                <td className="border px-2 py-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleViewDetails(order.id)}
                  >Details</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleDeactivate(order.id, order.is_active)}
                  >{order.is_active ? "Deactivate" : "Activate"}</Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(order.id)}
                    disabled={order.status !== "PENDING"}
                  >Approve</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedOrder && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Order Details</h2>
          <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
        </div>
      )}
      <Toast message={toastMessage} open={toastOpen} onOpenChange={setToastOpen} />
    </div>
  );
}
