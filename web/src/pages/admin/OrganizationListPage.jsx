import { useEffect, useState } from "react";
import { getOrganizations, createOrganization, deleteOrganization } from "@/services/apiMethods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ORGANIZATION_TYPES } from "@/constants/organizationTypes";
import SystemAdminLayout from "@/layout/SystemAdminLayout";
import { OrganizationTable } from "@/components/admin/OrganizationTable";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

export default function OrganizationListPage() {
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgType, setNewOrgType] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrganizations = () => {
    setLoading(true);
    setError(null);
    getOrganizations()
      .then((res) => setOrganizations(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreate = async () => {
    if (!newOrgName.trim() || !newOrgType.trim() || !newLocation.trim()) return;
    try {
      const res = await createOrganization({
        name: newOrgName,
        org_type: newOrgType,
        location_details: newLocation,
      });
      setOrganizations((prev) => [...prev, res.data]);
      setNewOrgName("");
      setNewOrgType("");
      setNewLocation("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrganization(id);
      setOrganizations((prev) => prev.filter((org) => org.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  let content;
  if (loading) {
    content = <div>Loading organizations...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else {
    content = (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Organizations</h1>
          <Button onClick={fetchOrganizations} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-6 flex items-center space-x-2">
          <Input
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="Organization name"
            className="max-w-sm"
          />
          <Select value={newOrgType} onValueChange={setNewOrgType}>
            <SelectTrigger className="w-56">
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
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Location details"
            className="max-w-xs"
          />
          <Button onClick={handleCreate}>Add Organization</Button>
        </div>
        <div className="rounded-md border">
          <OrganizationTable
            organizations={organizations}
            onEdit={(org) => navigate(`/admin/organizations/${org.id}/edit`)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    );
  }

  return <SystemAdminLayout>{content}</SystemAdminLayout>;
}
