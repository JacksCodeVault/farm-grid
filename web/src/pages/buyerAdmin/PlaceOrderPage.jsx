import React, { useState, useEffect } from 'react';
import { placeOrder, getCommodities, getOrganizations } from '../../services/apiMethods';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '../../components/ui/select';

const PlaceOrderPage = () => {
  const [form, setForm] = useState({ seller_id: '', commodity_id: '', requested_quantity: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [commodities, setCommodities] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [commoditiesRes, orgsRes] = await Promise.all([
          getCommodities(),
          getOrganizations()
        ]);
        setCommodities(commoditiesRes.data);
        setCooperatives(orgsRes.data.filter(org => org.org_type === 'COOPERATIVE'));
      } catch (err) {
        // handle error
      }
    }
    fetchData();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await placeOrder(form);
      setMessage('Order placed successfully!');
    } catch (err) {
      setMessage('Failed to place order.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Place Order</h2>
          <p className="text-gray-500">Fill in the details below to place your order.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Cooperative (Seller)</label>
            <Select value={form.seller_id} onValueChange={value => setForm(f => ({ ...f, seller_id: value }))} required>
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {cooperatives.map(coop => (
                  <SelectItem key={coop.id} value={String(coop.id)}>{coop.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Commodity</label>
            <Select value={form.commodity_id} onValueChange={value => setForm(f => ({ ...f, commodity_id: value }))} required>
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {commodities.map(com => (
                  <SelectItem key={com.id} value={String(com.id)}>{com.name} ({com.standard_unit})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requested Quantity</label>
            <input name="requested_quantity" value={form.requested_quantity} onChange={handleChange} placeholder="Requested Quantity" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <button type="submit" className="w-full py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition" disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
          {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
