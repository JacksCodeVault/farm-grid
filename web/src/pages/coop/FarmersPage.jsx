import { useEffect, useState } from "react";
import CoopAdminLayout from "@/layout/CoopAdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getFarmers, deactivateFarmer, activateFarmer, deleteFarmer } from "@/services/apiMethods";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import EditFarmerModal from "./EditFarmerModal";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFarmerId, setEditFarmerId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchFarmers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFarmers();
      setFarmers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch farmers.");
      toast.error(err.response?.data?.message || "Failed to fetch farmers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleAction = async (farmerId, actionType) => {
    try {
      let message = "";
      if (actionType === "deactivate") {
        await deactivateFarmer(farmerId);
        message = "Farmer deactivated successfully!";
      } else if (actionType === "activate") {
        await activateFarmer(farmerId);
        message = "Farmer activated successfully!";
      } else if (actionType === "delete") {
        await deleteFarmer(farmerId);
        message = "Farmer deleted successfully!";
      }

      toast.success(message);
      fetchFarmers(); // Re-fetch farmers to update the list
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${actionType} farmer.`);
    }
  };

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-lg">Loading farmers...</p>
      </div>
    );
  } else if (error) {
    content = <div className="text-red-500 text-center py-10">{error}</div>;
  } else if (farmers.length === 0) {
    content = <p className="text-center py-10">No farmers found.</p>;
  } else {
    content = (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Cooperative</TableHead>
              <TableHead>Village</TableHead>
              <TableHead>Registered By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium">{farmer.id}</TableCell>
                <TableCell>{farmer.first_name}</TableCell>
                <TableCell>{farmer.last_name}</TableCell>
                <TableCell>{farmer.phone_number}</TableCell>
                <TableCell>{farmer.cooperative_name}</TableCell>
                <TableCell>{farmer.village_name}</TableCell>
                <TableCell>{farmer.registered_by_name}</TableCell>
                <TableCell>{farmer.created_at}</TableCell>
                <TableCell>{farmer.updated_at}</TableCell>
                <TableCell>{farmer.is_active ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditFarmerId(farmer.id);
                      setIsEditDialogOpen(true);
                    }}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {farmer.is_active ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction(farmer.id, "deactivate")}
                      className="mr-2 text-yellow-600 hover:text-yellow-700"
                    >
                      <PowerOff className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction(farmer.id, "activate")}
                      className="mr-2 text-green-600 hover:text-green-700"
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(farmer.id, "delete")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Farmers</h1>
        <Button onClick={fetchFarmers} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {content}

      {isEditDialogOpen && (
        <EditFarmerModal
          farmerId={editFarmerId}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditFarmerId(null);
            fetchFarmers(); // Refresh list after edit
          }}
        />
      )}
    </div>
  );
}
