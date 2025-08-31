import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/apiMethods';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data); // Access the data property of the axios response
      } catch (err) {
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900">My Orders</h2>
          <p className="text-gray-500">View all your placed orders below.</p>
        </div>
        <div>
          {loading ? (
            <div className="text-center text-blue-700">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">Error: {error}</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500 text-center">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commodity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-semibold text-blue-900">{order.id}</td>
                      <td className="px-4 py-2">{order.commodity_name || order.commodity_id}</td>
                      <td className="px-4 py-2">{order.requested_quantity}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
