import { useState } from "react";
import { useNavigate } from "react-router";
import { AdminSidebar } from "../../components/AdminSidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Users, Save, LogOut, Plus, Trash2 } from "lucide-react";
import { categories, hrStaff } from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";

// --- Honeycomb Pattern Component ---
const HoneycombPattern = ({ className }: { className?: string }) => (
  <svg 
    className={`absolute pointer-events-none ${className}`} 
    width="250" 
    height="250" 
    viewBox="0 0 450 450" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <polygon 
        id="hex-admin" 
        points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" 
      />
    </defs>
    <g opacity="0.6" stroke="#C9D866" strokeWidth="12" fill="none" strokeLinejoin="round">
      <use href="#hex-admin" x="173.2" y="150" />
      <use href="#hex-admin" x="86.6" y="0" />
      <use href="#hex-admin" x="259.8" y="0" />
      <use href="#hex-admin" x="0" y="150" />
      <use href="#hex-admin" x="346.4" y="150" />
      <use href="#hex-admin" x="86.6" y="300" />
      <use href="#hex-admin" x="259.8" y="300" />
    </g>
  </svg>
);

// Local type for the assignment matrix
interface CategoryAssignment {
  categoryName: string;
  subcategories: string[];
  assignedHR: string[];
}

export default function AdminAssignmentMatrix() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for assignments (editable)
  const [assignments, setAssignments] = useState<CategoryAssignment[]>(
    categories.map((cat) => ({
      categoryName: cat.name,
      subcategories: cat.subcategories,
      assignedHR: [...cat.assignedHR],
    }))
  );

  // Handle HR assignment change
  const handleHRChange = (categoryName: string, newHR: string) => {
    setAssignments((prev) =>
      prev.map((cat) =>
        cat.categoryName === categoryName
          ? { ...cat, assignedHR: [newHR] }
          : cat
      )
    );
  };

  // Add new HR to category
  const addHRToCategory = (categoryName: string) => {
    setAssignments((prev) =>
      prev.map((cat) =>
        cat.categoryName === categoryName
          ? { ...cat, assignedHR: [...cat.assignedHR, hrStaff[0]] }
          : cat
      )
    );
  };

  // Remove HR from category
  const removeHRFromCategory = (categoryName: string, hrIndex: number) => {
    setAssignments((prev) =>
      prev.map((cat) =>
        cat.categoryName === categoryName
          ? { ...cat, assignedHR: cat.assignedHR.filter((_, i) => i !== hrIndex) }
          : cat
      )
    );
  };

  // Calculate stats
  const totalCategories = assignments.length;
  const totalSubcategories = assignments.reduce((acc, cat) => acc + cat.subcategories.length, 0);
  const totalAssignments = assignments.reduce((acc, cat) => acc + cat.assignedHR.length, 0);

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Honeycomb Backgrounds */}
      <HoneycombPattern className="top-0 left-0 scale-150" />
      <HoneycombPattern className="bottom-0 right-0 scale-150 rotate-180" />
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
              <h1 className="text-3xl font-semibold text-gray-900">HR Assignment Matrix</h1>
              <p className="text-gray-600 mt-1">Manage HR staff assignments to ticket categories</p>
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-sm border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Categories</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalCategories}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subcategories</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalSubcategories}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Assignments</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalAssignments}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HR Staff Overview */}
          <Card className="shadow-sm border-gray-200 mb-8">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                HR Staff Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hrStaff.map((hr) => {
                  const assignedCount = assignments.filter((cat) => 
                    cat.assignedHR.includes(hr)
                  ).length;
                  
                  return (
                    <div
                      key={hr}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {hr.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{hr}</p>
                          <p className="text-sm text-gray-500">{assignedCount} categories assigned</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {assignedCount} assigned
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Assignment Matrix Table */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Category Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.categoryName}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Category Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{assignment.categoryName}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {assignment.subcategories.length} subcategories
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Assigned to:</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addHRToCategory(assignment.categoryName)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add HR
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="px-6 py-4 bg-white">
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                          Subcategories
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.subcategories.map((sub: string) => (
                            <Badge key={sub} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* HR Assignments */}
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                          Assigned HR Staff
                        </p>
                        <div className="space-y-2">
                          {assignment.assignedHR.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No HR staff assigned</p>
                          ) : (
                            assignment.assignedHR.map((hr: string, hrIndex: number) => (
                              <div
                                key={`${hr}-${hrIndex}`}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                    {hr.charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900">{hr}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={hr}
                                    onValueChange={(value) =>
                                      handleHRChange(assignment.categoryName, value)
                                    }
                                  >
                                    <SelectTrigger className="h-9 w-48">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {hrStaff.map((staff: string) => (
                                        <SelectItem key={staff} value={staff}>
                                          {staff}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeHRFromCategory(assignment.categoryName, hrIndex)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

