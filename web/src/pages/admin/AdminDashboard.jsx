import SystemAdminLayout from "@/layout/SystemAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <SystemAdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage all organizations in the system.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage users.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Access system reports and analytics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SystemAdminLayout>
  );
}
