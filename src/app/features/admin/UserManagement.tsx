import { useEffect, useState } from "react";
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
import { Search, Plus, MoreVertical } from "lucide-react";
import { addDoc_, getDocs_ } from "../../../services/firestoreService";

type UserLevel = "employee" | "hr" | "admin";
type UserStatus = "active" | "inactive" | "on-leave";

interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  joinDate: string;
  position: string;
  userLevel: UserLevel;
  status: UserStatus;
}

interface ManagedUserDocument extends Omit<ManagedUser, "id"> {
  createdAt?: string;
  updatedAt?: string;
}

const USERS_COLLECTION = "managed_users";

const dummyUsers: ManagedUserDocument[] = [
  {
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan.delacruz@company.com",
    password: "Juan@1234",
    phone: "+63 912 345 6789",
    joinDate: "2024-01-15",
    position: "Support Staff",
    userLevel: "employee",
    status: "active",
  },
  {
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@company.com",
    password: "Maria@1234",
    phone: "+63 917 123 4567",
    joinDate: "2023-11-02",
    position: "HR Specialist",
    userLevel: "hr",
    status: "active",
  },
  {
    firstName: "Carlo",
    lastName: "Reyes",
    email: "carlo.reyes@company.com",
    password: "Carlo@1234",
    phone: "+63 918 987 6543",
    joinDate: "2022-08-20",
    position: "System Administrator",
    userLevel: "admin",
    status: "on-leave",
  },
];

const emptyUserForm: Omit<ManagedUser, "id"> = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "+63 ",
  joinDate: new Date().toISOString().split("T")[0],
  position: "",
  userLevel: "employee",
  status: "active",
};

const formatUserLevel = (userLevel: UserLevel) => {
  if (userLevel === "hr") return "HR";
  if (userLevel === "admin") return "ADMIN";
  return "Employee";
};

export default function AdminEmployees() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUserLevel, setFilterUserLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState<Omit<ManagedUser, "id">>(emptyUserForm);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError("");

      try {
        let storedUsers = await getDocs_<ManagedUserDocument>(USERS_COLLECTION);

        if (storedUsers.length === 0) {
          for (const user of dummyUsers) {
            await addDoc_<ManagedUserDocument>(USERS_COLLECTION, user);
          }
          storedUsers = await getDocs_<ManagedUserDocument>(USERS_COLLECTION);
        }

        setUsers(
          storedUsers.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            phone: user.phone,
            joinDate: user.joinDate,
            position: user.position,
            userLevel: user.userLevel,
            status: user.status,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUserLevel =
      filterUserLevel === "all" || user.userLevel === filterUserLevel;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesUserLevel && matchesStatus;
  });

  const handleAddUser = async () => {
    const { firstName, lastName, email, password, phone, joinDate, position, userLevel, status } = newUser;

    if (!firstName || !lastName || !email || !password || !phone || !joinDate || !position) {
      setError("Please complete all required user fields.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload: ManagedUserDocument = {
        firstName,
        lastName,
        email,
        password,
        phone,
        joinDate,
        position,
        userLevel,
        status,
      };

      const docId = await addDoc_<ManagedUserDocument>(USERS_COLLECTION, payload);

      setUsers((currentUsers) => [
        {
          id: docId,
          ...payload,
        },
        ...currentUsers,
      ]);

      setIsAddDialogOpen(false);
      setNewUser(emptyUserForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user.");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
            Active
          </Badge>
        );
      case "on-leave":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900">
            On Leave
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Inactive
          </Badge>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage system users from Firebase</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User Level</label>
                <Select value={filterUserLevel} onValueChange={setFilterUserLevel}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All User Levels</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="admin">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold dark:text-white">All Users ({filteredUsers.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">User Level</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        Loading users from Firebase...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No users found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                              {user.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.position}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {formatUserLevel(user.userLevel)}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the user details below to save them to Firebase.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Dela Cruz"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.delacruz@company.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter default password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone PH-number (+63) *</Label>
                <Input
                  id="phone"
                  placeholder="+63 912 345 6789"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date *</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newUser.joinDate}
                  onChange={(e) => setNewUser({ ...newUser, joinDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  placeholder="HR Specialist"
                  value={newUser.position}
                  onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userLevel">User Level *</Label>
                <Select
                  value={newUser.userLevel}
                  onValueChange={(value: UserLevel) => setNewUser({ ...newUser, userLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="admin">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value: UserStatus) => setNewUser({ ...newUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isSaving}>
              {isSaving ? "Saving..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
