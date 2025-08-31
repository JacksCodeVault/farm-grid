import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function OrganizationTable({ organizations, onEdit, onDelete }) {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org, index) => (
          <TableRow key={org.id || `org-${index}`}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{org.name}</TableCell>
            <TableCell>{org.org_type}</TableCell>
            <TableCell>{org.location_details}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline" onClick={() => onEdit(org)} className="text-white">Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(org.id)} className="ml-2">Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
