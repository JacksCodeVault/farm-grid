import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Using sonner for toast
import { getFarmerById, updateFarmer } from "@/services/apiMethods";

export default function EditFarmerModal({ farmerId, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (isOpen && farmerId) {
      setLoading(true);
      setError(null);
      getFarmerById(farmerId)
        .then((res) => {
          setFirstName(res.data.first_name);
          setLastName(res.data.last_name);
          setPhoneNumber(res.data.phone_number);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to fetch farmer details.");
          toast({
            title: "Error",
            description: err.response?.data?.message || "Failed to fetch farmer details.",
            variant: "destructive",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, farmerId, toast]);

  const handleSave = async () => {
    try {
      const updatedData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      };
      await updateFarmer(farmerId, updatedData);
      toast({
        title: "Success",
        description: "Farmer updated successfully!",
      });
      onClose(); // Close modal and trigger refresh in parent
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update farmer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Farmer</DialogTitle>
          <DialogDescription>
            Make changes to the farmer's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-4 text-center">Loading farmer data...</div>
        ) : error ? (
          <div className="py-4 text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
