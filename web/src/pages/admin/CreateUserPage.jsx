import SystemAdminLayout from "@/layout/SystemAdminLayout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { createUser } from "@/services/apiMethods"; // Assuming this API method exists

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateUser = async () => {
    if (!email.trim() || !role.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createUser({ email, role, password });
      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SystemAdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Create New User</h1>
        <div className="max-w-lg mx-auto p-6 bg-card rounded-lg shadow-md">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SYSTEM_ADMIN">System Admin</SelectItem>
                <SelectItem value="COOP_ADMIN">Coop Admin</SelectItem>
                <SelectItem value="FARMER">Farmer</SelectItem>
                <SelectItem value="BUYER">Buyer</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => navigate("/admin/users")} disabled={loading}>Cancel</Button>
              <Button onClick={handleCreateUser} disabled={loading}>
                {loading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SystemAdminLayout>
  );
}
