import React, { useState } from 'react';
import { recordPayment } from '../../services/apiMethods';

const RecordPaymentPage = () => {
  const [form, setForm] = useState({ deliveryId: '', amount: '', transactionReference: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await recordPayment(form);
      setMessage('Payment recorded successfully!');
    } catch (err) {
      setMessage('Failed to record payment.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Record Payment Transaction</h2>
          <p className="text-gray-500">Enter payment details below to record a transaction.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery ID</label>
            <input name="deliveryId" value={form.deliveryId} onChange={handleChange} placeholder="Delivery ID" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference</label>
            <input name="transactionReference" value={form.transactionReference} onChange={handleChange} placeholder="Transaction Reference" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <button type="submit" className="w-full py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition" disabled={loading}>{loading ? 'Recording...' : 'Record Payment'}</button>
          {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentPage;
