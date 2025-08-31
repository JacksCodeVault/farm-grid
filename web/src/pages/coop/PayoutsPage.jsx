
import { useEffect, useState } from "react";
import CoopAdminLayout from "@/layout/CoopAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PayoutsPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState("");
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDeliveries() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/v1/deliveries/seller", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch deliveries");
        const data = await res.json();
        setDeliveries(data);
        if (data.length > 0) {
          setSelectedDeliveryId(data[0].id); // Select the first delivery by default
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveries();
  }, []);

  useEffect(() => {
    async function fetchPayoutReport() {
      if (!selectedDeliveryId) return;

      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/v1/deliveries/${selectedDeliveryId}/payout-report`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch payout report");
        const data = await res.json();
        setPayouts(data.payouts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPayoutReport();
  }, [selectedDeliveryId]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payouts</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={setSelectedDeliveryId}
            value={selectedDeliveryId}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a delivery" />
            </SelectTrigger>
            <SelectContent>
              {deliveries.map((delivery) => (
                <SelectItem key={delivery.id} value={delivery.id}>
                  Delivery ID: {delivery.id} - Status: {delivery.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout Report for Delivery: {selectedDeliveryId}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : payouts.length === 0 ? (
            <p>No payouts found for this delivery.</p>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Farmer</th>
                  <th className="border px-2 py-1">Quantity</th>
                  <th className="border px-2 py-1">Unit Price</th>
                  <th className="border px-2 py-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.farmer_id}>
                    <td className="border px-2 py-1">{payout.farmer_name}</td>
                    <td className="border px-2 py-1">{payout.quantity}</td>
                    <td className="border px-2 py-1">{payout.unit_price}</td>
                    <td className="border px-2 py-1">{payout.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
