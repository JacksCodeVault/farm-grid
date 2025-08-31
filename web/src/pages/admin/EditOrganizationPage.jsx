import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrganizationById, updateOrganization } from "@/services/apiMethods";
import { ORGANIZATION_TYPES } from "@/constants/organizationTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import SystemAdminLayout from "@/layout/SystemAdminLayout";

export default function EditOrganizationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrganizationById(id)
      .then((res) => setOrg(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateOrganization(id, org);
      navigate("/admin/organizations");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <SystemAdminLayout>Loading...</SystemAdminLayout>;
  if (error) return <SystemAdminLayout><div className="text-red-500">{error}</div></SystemAdminLayout>;
  if (!org) return <SystemAdminLayout>Organization not found.</SystemAdminLayout>;

  return (
    <SystemAdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Edit Organization</h1>
        <div className="max-w-lg mx-auto p-6 bg-card rounded-lg shadow-md">
          <div className="space-y-4">
            <Input
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
              placeholder="Organization name"
            />
            <Select value={org.org_type} onValueChange={(value) => setOrg({ ...org, org_type: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={org.location_details || ""}
              onChange={(e) => setOrg({ ...org, location_details: e.target.value })}
              placeholder="Location details"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => navigate("/admin/organizations")}>Cancel</Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </SystemAdminLayout>
  );
}
