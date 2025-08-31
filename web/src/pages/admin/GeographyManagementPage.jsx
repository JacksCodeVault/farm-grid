import SystemAdminLayout from "@/layout/SystemAdminLayout";
import { useState, useEffect } from "react";
import {
  getRegions, createRegion, updateRegion, deleteRegion,
  getDistricts, createDistrict, updateDistrict, deleteDistrict,
  getVillages, createVillage, updateVillage, deleteVillage
} from "@/services/apiMethods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

export default function GeographyManagementPage() {
  const [activeTab, setActiveTab] = useState("regions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Regions state
  const [regions, setRegions] = useState([]);
  const [newRegionName, setNewRegionName] = useState("");
  const [editingRegion, setEditingRegion] = useState(null);

  // Districts state
  const [districts, setDistricts] = useState([]);
  const [newDistrictName, setNewDistrictName] = useState("");
  const [newDistrictRegionId, setNewDistrictRegionId] = useState("");
  const [editingDistrict, setEditingDistrict] = useState(null);

  // Villages state
  const [villages, setVillages] = useState([]);
  const [newVillageName, setNewVillageName] = useState("");
  const [newVillageDistrictId, setNewVillageDistrictId] = useState("");
  const [editingVillage, setEditingVillage] = useState(null);

  const fetchData = async (fetchFn, setStateFn) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      setStateFn(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "regions") fetchData(getRegions, setRegions);
    if (activeTab === "districts") fetchData(getDistricts, setDistricts);
    if (activeTab === "villages") fetchData(getVillages, setVillages);
  }, [activeTab]);

  // Region Handlers
  const handleCreateRegion = async () => {
    if (!newRegionName.trim()) return;
    try {
      const res = await createRegion({ name: newRegionName });
      setRegions((prev) => [...prev, res.data]);
      setNewRegionName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateRegion = async () => {
    if (!editingRegion || !editingRegion.name.trim()) return;
    try {
      const res = await updateRegion(editingRegion.id, { name: editingRegion.name });
      setRegions((prev) => prev.map((reg) => (reg.id === res.data.id ? res.data : reg)));
      setEditingRegion(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRegion = async (id) => {
    try {
      await deleteRegion(id);
      setRegions((prev) => prev.filter((reg) => reg.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // District Handlers
  const handleCreateDistrict = async () => {
    if (!newDistrictName.trim() || !newDistrictRegionId.trim()) return;
    try {
      const res = await createDistrict({ name: newDistrictName, region_id: newDistrictRegionId });
      setDistricts((prev) => [...prev, res.data]);
      setNewDistrictName("");
      setNewDistrictRegionId("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateDistrict = async () => {
    if (!editingDistrict || !editingDistrict.name.trim() || !editingDistrict.region_id.trim()) return;
    try {
      const res = await updateDistrict(editingDistrict.id, { name: editingDistrict.name, region_id: editingDistrict.region_id });
      setDistricts((prev) => prev.map((dist) => (dist.id === res.data.id ? res.data : dist)));
      setEditingDistrict(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDistrict = async (id) => {
    try {
      await deleteDistrict(id);
      setDistricts((prev) => prev.filter((dist) => dist.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Village Handlers
  const handleCreateVillage = async () => {
    if (!newVillageName.trim() || !newVillageDistrictId.trim()) return;
    try {
      const res = await createVillage({ name: newVillageName, district_id: newVillageDistrictId });
      setVillages((prev) => [...prev, res.data]);
      setNewVillageName("");
      setNewVillageDistrictId("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateVillage = async () => {
    if (!editingVillage || !editingVillage.name.trim() || !editingVillage.district_id.trim()) return;
    try {
      const res = await updateVillage(editingVillage.id, { name: editingVillage.name, district_id: editingVillage.district_id });
      setVillages((prev) => prev.map((vill) => (vill.id === res.data.id ? res.data : vill)));
      setEditingVillage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteVillage = async (id) => {
    try {
      await deleteVillage(id);
      setVillages((prev) => prev.filter((vill) => vill.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <SystemAdminLayout>Loading...</SystemAdminLayout>;
  if (error) return <SystemAdminLayout><div className="text-red-500">{error}</div></SystemAdminLayout>;

  return (
    <SystemAdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Geography Management</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="districts">Districts</TabsTrigger>
            <TabsTrigger value="villages">Villages</TabsTrigger>
          </TabsList>
          <TabsContent value="regions">
            <div className="flex items-center justify-between mb-6 mt-4">
              <h2 className="text-2xl font-bold">Regions</h2>
              <Button onClick={() => fetchData(getRegions, setRegions)} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-6 flex items-center space-x-2">
              <Input
                value={newRegionName}
                onChange={(e) => setNewRegionName(e.target.value)}
                placeholder="Region name"
                className="max-w-sm"
              />
              <Button onClick={handleCreateRegion}>Add Region</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map((reg, index) => (
                    <TableRow key={reg.id || `region-${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {editingRegion?.id === reg.id ? (
                          <Input
                            value={editingRegion.name}
                            onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })}
                          />
                        ) : (
                          reg.name
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingRegion?.id === reg.id ? (
                          <>
                            <Button size="sm" onClick={handleUpdateRegion} className="mr-2">Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingRegion(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" onClick={() => setEditingRegion(reg)} className="mr-2">Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteRegion(reg.id)}>Delete</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="districts">
            <div className="flex items-center justify-between mb-6 mt-4">
              <h2 className="text-2xl font-bold">Districts</h2>
              <Button onClick={() => fetchData(getDistricts, setDistricts)} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-6 flex items-center space-x-2">
              <Input
                value={newDistrictName}
                onChange={(e) => setNewDistrictName(e.target.value)}
                placeholder="District name"
                className="max-w-sm"
              />
              <Select value={newDistrictRegionId} onValueChange={setNewDistrictRegionId}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((reg) => (
                    <SelectItem key={reg.id} value={reg.id}>
                      {reg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateDistrict}>Add District</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {districts.map((dist, index) => (
                    <TableRow key={dist.id || `district-${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {editingDistrict?.id === dist.id ? (
                          <Input
                            value={editingDistrict.name}
                            onChange={(e) => setEditingDistrict({ ...editingDistrict, name: e.target.value })}
                          />
                        ) : (
                          dist.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingDistrict?.id === dist.id ? (
                          <Select value={editingDistrict.region_id} onValueChange={(value) => setEditingDistrict({ ...editingDistrict, region_id: value })}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((reg) => (
                                <SelectItem key={reg.id} value={reg.id}>
                                  {reg.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          regions.find(reg => reg.id === dist.region_id)?.name || "N/A"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingDistrict?.id === dist.id ? (
                          <>
                            <Button size="sm" onClick={handleUpdateDistrict} className="mr-2">Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingDistrict(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" onClick={() => setEditingDistrict(dist)} className="mr-2">Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteDistrict(dist.id)}>Delete</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="villages">
            <div className="flex items-center justify-between mb-6 mt-4">
              <h2 className="text-2xl font-bold">Villages</h2>
              <Button onClick={() => fetchData(getVillages, setVillages)} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-6 flex items-center space-x-2">
              <Input
                value={newVillageName}
                onChange={(e) => setNewVillageName(e.target.value)}
                placeholder="Village name"
                className="max-w-sm"
              />
              <Select value={newVillageDistrictId} onValueChange={setNewVillageDistrictId}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((dist) => (
                    <SelectItem key={dist.id} value={dist.id}>
                      {dist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateVillage}>Add Village</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {villages.map((vill, index) => (
                    <TableRow key={vill.id || `village-${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {editingVillage?.id === vill.id ? (
                          <Input
                            value={editingVillage.name}
                            onChange={(e) => setEditingVillage({ ...editingVillage, name: e.target.value })}
                          />
                        ) : (
                          vill.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingVillage?.id === vill.id ? (
                          <Select value={editingVillage.district_id} onValueChange={(value) => setEditingVillage({ ...editingVillage, district_id: value })}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((dist) => (
                                <SelectItem key={dist.id} value={dist.id}>
                                  {dist.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          districts.find(dist => dist.id === vill.district_id)?.name || "N/A"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingVillage?.id === vill.id ? (
                          <>
                            <Button size="sm" onClick={handleUpdateVillage} className="mr-2">Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingVillage(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" onClick={() => setEditingVillage(vill)} className="mr-2">Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteVillage(vill.id)}>Delete</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SystemAdminLayout>
  );
}
