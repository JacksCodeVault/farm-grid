import CoopAdminLayout from "@/layout/CoopAdminLayout";
import { useEffect, useState } from "react";
import { getCollections, updateCollection, deactivateCollection, activateCollection } from "@/services/apiMethods";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

export default function CoopCollectionListPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollections = () => {
    setLoading(true);
    setError(null);
    getCollections()
      .then((res) => setCollections(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleUpdateCollection = async (id, data) => {
    try {
      const res = await updateCollection(id, data);
      setCollections((prev) =>
        prev.map((collection) => (collection.id === res.data.id ? res.data : collection))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivateCollection = async (id) => {
    try {
      await deactivateCollection(id);
      setCollections((prev) => prev.map((collection) => (collection.id === id ? { ...collection, is_active: 0 } : collection)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleActivateCollection = async (id) => {
    try {
      await activateCollection(id);
      setCollections((prev) => prev.map((collection) => (collection.id === id ? { ...collection, is_active: 1 } : collection)));
    } catch (err) {
      setError(err.message);
    }
  };

  let content;
  if (loading) {
    content = <div>Loading collections...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else {
    content = (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Collections</h1>
          <Button onClick={fetchCollections} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Collection ID</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Commodity</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((collection, index) => (
                <TableRow key={collection.id || `collection-${index}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{collection.id}</TableCell>
                  <TableCell>{collection.farmerName || "N/A"}</TableCell>
                  <TableCell>{collection.commodityName || "N/A"}</TableCell>
                  <TableCell>{collection.quantity} {collection.unit}</TableCell>
                  <TableCell>{collection.is_active ? collection.status : 'Deactivated'}</TableCell>
                  <TableCell className="text-right">
                    {collection.is_active ? (
                      <>
                        <Button size="sm" onClick={() => handleUpdateCollection(collection.id, { status: 'ALLOCATED_TO_DELIVERY' })} className="mr-2">Allocate to Delivery</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeactivateCollection(collection.id)}>Deactivate</Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleActivateCollection(collection.id)}>Activate</Button>
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

  return content;
}
