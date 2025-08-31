import SystemAdminLayout from "@/layout/SystemAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <SystemAdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard Page</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is a placeholder for the admin dashboard content.</p>
          </CardContent>
        </Card>
      </div>
    </SystemAdminLayout>
  );
}
