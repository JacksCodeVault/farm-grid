import SystemAdminLayout from "@/layout/SystemAdminLayout";
import { useEffect, useState } from "react";
import { getCommodities, createCommodity, updateCommodity, deleteCommodity } from "@/services/apiMethods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

export default function CommodityListPage() {
  const [commodities, setCommodities] = useState([]);
  const [newCommodityName, setNewCommodityName] = useState("");
  const [newCommodityUnit, setNewCommodityUnit] = useState("");
  const [editingCommodity, setEditingCommodity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommodities = () => {
    setLoading(true);
    setError(null);
    getCommodities()
      .then((res) => setCommodities(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCommodities();
  }, []);

  const handleCreateCommodity = async () => {
    if (!newCommodityName.trim() || !newCommodityUnit.trim()) return;
    try {
      const res = await createCommodity({ name: newCommodityName, unit: newCommodityUnit });
      setCommodities((prev) => [...prev, res.data]);
      setNewCommodityName("");
      setNewCommodityUnit("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCommodity = async () => {
    if (!editingCommodity || !editingCommodity.name.trim() || !editingCommodity.unit.trim()) return;
    try {
      const res = await updateCommodity(editingCommodity.id, { name: editingCommodity.name, unit: editingCommodity.unit });
      setCommodities((prev) =>
        prev.map((comm) => (comm.id === res.data.id ? res.data : comm))
      );
      setEditingCommodity(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCommodity = async (id) => {
    try {
      await deleteCommodity(id);
      setCommodities((prev) => prev.filter((comm) => comm.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  let content;
  if (loading) {
    content = <div>Loading commodities...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else {
    content = (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Commodities</h1>
          <Button onClick={fetchCommodities} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-6 flex items-center space-x-2">
          <Input
            value={newCommodityName}
            onChange={(e) => setNewCommodityName(e.target.value)}
            placeholder="Commodity name"
            className="max-w-sm"
          />
          <Input
            value={newCommodityUnit}
            onChange={(e) => setNewCommodityUnit(e.target.value)}
            placeholder="Unit (e.g., kg, bag)"
            className="max-w-xs"
          />
          <Button onClick={handleCreateCommodity}>Add Commodity</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commodities.map((comm, index) => (
                <TableRow key={comm.id || `comm-${index}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {editingCommodity?.id === comm.id ? (
                      <Input
                        value={editingCommodity.name}
                        onChange={(e) => setEditingCommodity({ ...editingCommodity, name: e.target.value })}
                      />
                    ) : (
                      comm.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCommodity?.id === comm.id ? (
                      <Input
                        value={editingCommodity.unit}
                        onChange={(e) => setEditingCommodity({ ...editingCommodity, unit: e.target.value })}
                      />
                    ) : (
                      comm.unit
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingCommodity?.id === comm.id ? (
                      <>
                        <Button size="sm" onClick={handleUpdateCommodity} className="mr-2">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCommodity(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => setEditingCommodity(comm)} className="mr-2">Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCommodity(comm.id)}>Delete</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return <SystemAdminLayout>{content}</SystemAdminLayout>;
}
