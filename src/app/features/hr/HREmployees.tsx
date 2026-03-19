import React from "react";
import { Users } from "lucide-react";

// Sample employee data
const employees = [
  { id: "EMP-001", name: "John Doe", department: "Engineering", email: "john.doe@company.com", status: "Active" },
  { id: "EMP-002", name: "Sarah Hall", department: "Marketing", email: "sarah.hall@company.com", status: "Active" },
  { id: "EMP-003", name: "Mike Ross", department: "Sales", email: "mike.ross@company.com", status: "Active" },
  { id: "EMP-004", name: "Emma Wood", department: "HR", email: "emma.wood@company.com", status: "Active" },
  { id: "EMP-005", name: "James Smith", department: "Finance", email: "james.smith@company.com", status: "On Leave" },
];

export default function HREmployees() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Employee Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage company employees</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-sm dark:text-white">{employee.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {employee.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium dark:text-white">{employee.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{employee.department}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{employee.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                    employee.status === "Active" ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30" : "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30"
                  }`}>
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

