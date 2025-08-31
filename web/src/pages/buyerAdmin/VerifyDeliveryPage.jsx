import React, { useState } from 'react';
import { verifyDelivery } from '../../services/apiMethods';

const VerifyDeliveryPage = () => {
  const [deliveryId, setDeliveryId] = useState('');
  const [verifiedQuantity, setVerifiedQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await verifyDelivery(deliveryId, { verified_quantity: parseFloat(verifiedQuantity) });
      setMessage('Delivery verified successfully!');
    } catch (err) {
      setMessage('Failed to verify delivery.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Verify Receipt of Delivery</h2>
          <p className="text-gray-500">Enter the delivery ID and verified quantity below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery ID</label>
            <input value={deliveryId} onChange={e => setDeliveryId(e.target.value)} placeholder="Delivery ID" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verified Quantity</label>
            <input value={verifiedQuantity} onChange={e => setVerifiedQuantity(e.target.value)} placeholder="Verified Quantity" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <button type="submit" className="w-full py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition" disabled={loading}>{loading ? 'Verifying...' : 'Verify Delivery'}</button>
          {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default VerifyDeliveryPage;
