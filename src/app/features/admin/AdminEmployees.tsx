import { useState } from "react";
import { useNavigate } from "react-router";
import { AdminSidebar } from "../../components/AdminSidebar";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { 
  Search, 
  Download, 
  LogOut, 
  Plus,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// Employee type
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: "active" | "on-leave" | "inactive";
  joinDate: string;
  manager: string;
}

// Initial employee data
const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "John Doe", email: "john.doe@company.com", phone: "+63 912 345 6789", department: "Engineering", position: "Software Engineer", status: "active", joinDate: "2022-01-15", manager: "Sarah Johnson" },
  { id: "EMP-002", name: "Sarah Hall", email: "sarah.hall@company.com", phone: "+63 912 345 6790", department: "Marketing", position: "Marketing Manager", status: "active", joinDate: "2021-06-20", manager: "Mike Ross" },
  { id: "EMP-003", name: "Mike Ross", email: "mike.ross@company.com", phone: "+63 912 345 6791", department: "Sales", position: "Sales Director", status: "active", joinDate: "2020-03-10", manager: "Emma Wood" },
  { id: "EMP-004", name: "Emma Wood", email: "emma.wood@company.com", phone: "+63 912 345 6792", department: "HR", position: "HR Director", status: "active", joinDate: "2019-08-05", manager: "CEO" },
  { id: "EMP-005", name: "James Smith", email: "james.smith@company.com", phone: "+63 912 345 6793", department: "Finance", position: "Financial Analyst", status: "on-leave", joinDate: "2022-04-12", manager: "Robert Brown" },
  { id: "EMP-006", name: "Robert Brown", email: "robert.brown@company.com", phone: "+63 912 345 6794", department: "Finance", position: "Finance Manager", status: "active", joinDate: "2021-02-28", manager: "CEO" },
  { id: "EMP-007", name: "Linda Martinez", email: "linda.martinez@company.com", phone: "+63 912 345 6795", department: "Engineering", position: "Senior Developer", status: "active", joinDate: "2021-09-15", manager: "Sarah Johnson" },
  { id: "EMP-008", name: "David Lee", email: "david.lee@company.com", phone: "+63 912 345 6796", department: "Operations", position: "Operations Manager", status: "active", joinDate: "2020-11-01", manager: "Emma Wood" },
  { id: "EMP-009", name: "Jennifer White", email: "jennifer.white@company.com", phone: "+63 912 345 6797", department: "Customer Success", position: "Team Lead", status: "active", joinDate: "2022-07-20", manager: "Mike Ross" },
  { id: "EMP-010", name: "Michael Taylor", email: "michael.taylor@company.com", phone: "+63 912 345 6798", department: "Sales", position: "Sales Executive", status: "inactive", joinDate: "2021-03-15", manager: "Mike Ross" },
  { id: "EMP-011", name: "Amanda Garcia", email: "amanda.garcia@company.com", phone: "+63 912 345 6799", department: "Marketing", position: "Content Writer", status: "active", joinDate: "2023-01-10", manager: "Sarah Hall" },
  { id: "EMP-012", name: "Christopher Anderson", email: "chris.anderson@company.com", phone: "+63 912 345 6800", department: "Engineering", position: "DevOps Engineer", status: "active", joinDate: "2022-05-22", manager: "Sarah Johnson" },
];

// Departments for filtering
const departmentsList = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Customer Success"];

// Managers list
const managersList = ["Sarah Johnson", "Mike Ross", "Emma Wood", "Robert Brown", "Sarah Hall", "CEO"];

export default function AdminEmployees() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    status: "active",
    joinDate: new Date().toISOString().split("T")[0],
    manager: "",
  });

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = filterDepartment === "All" || emp.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Generate new employee ID
  const generateEmployeeId = () => {
    const num = employees.length + 1;
    return `EMP-${String(num).padStart(3, "0")}`;
  };

  // Handle add employee
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.position) {
      return;
    }

    const employee: Employee = {
      id: generateEmployeeId(),
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone || "",
      department: newEmployee.department,
      position: newEmployee.position,
      status: newEmployee.status as "active" | "on-leave" | "inactive",
      joinDate: newEmployee.joinDate || new Date().toISOString().split("T")[0],
      manager: newEmployee.manager || "CEO",
    };

    setEmployees([employee, ...employees]);
    setIsAddDialogOpen(false);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      manager: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "on-leave":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">On Leave</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="flex justify-end items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role.toUpperCase()}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Employee Management</h1>
              <p className="text-gray-600 mt-1">View and manage company employees</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Department</label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    {departmentsList.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">All Employees ({filteredEmployees.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Manager</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No employees found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{employee.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {employee.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{employee.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{employee.position}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(employee.status)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {new Date(employee.joinDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{employee.manager}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter the employee details below to add them to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+63 912 345 6789"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={newEmployee.department} 
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentsList.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  placeholder="Software Engineer"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Select 
                  value={newEmployee.manager} 
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, manager: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managersList.map((mgr) => (
                      <SelectItem key={mgr} value={mgr}>
                        {mgr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newEmployee.status} 
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee}>
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

