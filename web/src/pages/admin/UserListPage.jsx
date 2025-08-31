import SystemAdminLayout from "@/layout/SystemAdminLayout";
import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/apiMethods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState(""); // Assuming a default role or selection
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    getUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUserEmail.trim() || !newUserRole.trim()) return;
    try {
      const res = await createUser({ email: newUserEmail, role: newUserRole });
      setUsers((prev) => [...prev, res.data]);
      setNewUserEmail("");
      setNewUserRole("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editingUser.email.trim() || !editingUser.role.trim()) return;
    try {
      const res = await updateUser(editingUser.id, { email: editingUser.email, role: editingUser.role });
      setUsers((prev) =>
        prev.map((user) => (user.id === res.data.id ? res.data : user))
      );
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  let content;
  if (loading) {
    content = <div>Loading users...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else {
    content = (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={fetchUsers} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-6 flex items-center space-x-2">
          <Input
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="User email"
            className="max-w-sm"
          />
          <Input
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            placeholder="User role (e.g., COOP_ADMIN)"
            className="max-w-xs"
          />
          <Button onClick={handleCreateUser}>Add User</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id || `user-${index}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      />
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingUser?.id === user.id ? (
                      <>
                        <Button size="sm" onClick={handleUpdateUser} className="mr-2">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => setEditingUser(user)} className="mr-2">Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
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
