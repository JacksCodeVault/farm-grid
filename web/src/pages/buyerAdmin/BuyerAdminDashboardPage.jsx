import React from 'react';
import { Button } from '../../components/ui/button';

const links = [
  { href: '/buyer-admin/place-order', label: 'Place Order' },
  { href: '/buyer-admin/my-orders', label: 'List My Orders' },
  { href: '/buyer-admin/verify-delivery', label: 'Verify Receipt of Delivery' },
  { href: '/buyer-admin/record-payment', label: 'Record Payment Transaction' },
];

const BuyerAdminDashboardPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Buyer Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map(link => (
            <a key={link.href} href={link.href}>
              <Button className="w-full py-6 text-lg font-semibold" variant="outline">
                {link.label}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerAdminDashboardPage;
