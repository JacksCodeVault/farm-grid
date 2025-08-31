import CoopAdminLayout from "@/layout/CoopAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoopDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Coop Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage all collections.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View and manage orders.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage farmer payouts.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
