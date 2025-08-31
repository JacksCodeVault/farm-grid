import CoopAdminLayout from "@/layout/CoopAdminLayout";
import { useEffect, useState } from "react";
import { getOrders, updateOrder, deactivateOrder, activateOrder } from "@/services/apiMethods";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

export default function CoopOrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    setError(null);
    getOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await updateOrder(id, { status });
      setOrders((prev) =>
        prev.map((order) => (order.id === res.data.id ? res.data : order))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleOrderActive = async (id, isActive) => {
    try {
      if (isActive) {
        await deactivateOrder(id);
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, is_active: 0 } : order)));
      } else {
        await activateOrder(id);
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, is_active: 1 } : order)));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  let content;
  if (loading) {
    content = <div>Loading orders...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else {
    content = (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Button onClick={fetchOrders} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.id || `order-${index}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.buyerName || "N/A"}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'FULFILLED')} className="mr-2" disabled={order.status !== 'PENDING'}>Approve</Button>
                    <Button size="sm" variant={order.is_active ? "destructive" : "outline"} onClick={() => handleToggleOrderActive(order.id, order.is_active)}>
                      {order.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return content;
}
