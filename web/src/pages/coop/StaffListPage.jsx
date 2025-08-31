import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createUser, getFieldOperators, updateFieldOperator, activateFieldOperator, deactivateFieldOperator } from "@/services/apiMethods";

export default function StaffListPage() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone_number: "" });
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchOperators = () => {
    setLoading(true);
    getFieldOperators()
      .then(res => {
        setOperators(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess("");
    try {
      await createUser({ ...form, role: "FIELD_OPERATOR" });
      setSuccess("Field operator created! They will receive a password reset email.");
      setForm({ name: "", email: "", phone_number: "" });
      fetchOperators();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCreating(false);
    }
  };

  // Inline edit state
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone_number: '' });
  const [editLoading, setEditLoading] = useState(false);

  const startEdit = (op) => {
    setEditId(op.id);
    setEditForm({ name: op.name, email: op.email, phone_number: op.phone_number });
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: '', email: '', phone_number: '' });
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = async (id) => {
    setEditLoading(true);
    try {
      await updateFieldOperator(id, editForm);
      setSuccess('Field operator updated.');
      fetchOperators();
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setEditLoading(false);
    }
  };
  const handleActivate = async (id) => {
    setEditLoading(true);
    try {
      await activateFieldOperator(id);
      setSuccess('Field operator activated.');
      fetchOperators();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setEditLoading(false);
    }
  };
  const handleDeactivate = async (id) => {
    setEditLoading(true);
    try {
      await deactivateFieldOperator(id);
      setSuccess('Field operator deactivated.');
      fetchOperators();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Field Operators</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Field Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleCreate}>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
            <Input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" required />
            <Button type="submit" disabled={creating}>Create Operator</Button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-600 mt-2">{success}</div>}
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manage Field Operators</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map((op, index) => (
                  <TableRow key={op.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {editId === op.id ? (
                        <Input name="name" value={editForm.name} onChange={handleEditChange} />
                      ) : (
                        op.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === op.id ? (
                        <Input name="email" value={editForm.email} onChange={handleEditChange} />
                      ) : (
                        op.email
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === op.id ? (
                        <Input name="phone_number" value={editForm.phone_number} onChange={handleEditChange} />
                      ) : (
                        op.phone_number
                      )}
                    </TableCell>
                    <TableCell>{op.is_active ? "Active" : "Inactive"}</TableCell>
                    <TableCell>
                      {editId === op.id ? (
                        <>
                          <Button size="sm" onClick={() => handleEditSave(op.id)} disabled={editLoading}>Save</Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} disabled={editLoading}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEdit(op)} disabled={editLoading}>Edit</Button>
                          {op.is_active ? (
                            <Button size="sm" variant="destructive" onClick={() => handleDeactivate(op.id)} disabled={editLoading}>Deactivate</Button>
                          ) : (
                            <Button size="sm" onClick={() => handleActivate(op.id)} disabled={editLoading}>Activate</Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
