export interface Ticket {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  category: string;
  subcategory: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: "comment" | "status-change" | "internal-note";
}

export type UserRole = "employee" | "hr" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  assignedCategories?: string[]; // For HR role
}

// Mock current user - can be changed for demo
export const currentUser: User = {
  id: "USR-001",
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  role: "employee",
  department: "Engineering",
};

export const mockUsers: User[] = [
  {
    id: "HR-001",
    name: "Sir Sam",
    email: "sam@company.com",
    role: "hr",
    assignedCategories: ["Employment Function"],
  },
  {
    id: "HR-002",
    name: "Ma'am Alex",
    email: "alex@company.com",
    role: "hr",
    assignedCategories: ["Employment Function", "Personal Function"],
  },
  {
    id: "HR-003",
    name: "Sir Arwin",
    email: "arwin@company.com",
    role: "hr",
    assignedCategories: ["Personal Function"],
  },
  {
    id: "ADM-001",
    name: "Admin User",
    email: "admin@company.com",
    role: "admin",
  },
];

export const categories = [
  {
    name: "Employment Function",
    subcategories: [
      "Recruitment & Selection",
      "Offboarding",
      "Final Pay",
      "Exit Clearance",
    ],
    assignedHR: ["Sir Sam", "Ma'am Alex"],
  },
  {
    name: "Personal Function",
    subcategories: [
      "Contract Request",
      "COE Request",
      "Employee Incentives",
      "Loan Requests",
    ],
    assignedHR: ["Sir Arwin", "Ma'am Alex"],
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "TKT-2024-001",
    employeeName: "Sarah Johnson",
    employeeId: "EMP-1234",
    department: "Engineering",
    category: "Personal Function",
    subcategory: "COE Request",
    subject: "Certificate of Employment needed for bank loan",
    description: "I need a Certificate of Employment to submit to my bank for a home loan application. Please include my position, tenure, and salary details.",
    priority: "high",
    status: "in-progress",
    assignedTo: "Sir Arwin",
    createdAt: "2024-02-20T09:30:00",
    updatedAt: "2024-02-23T14:20:00",
    comments: [
      {
        id: "1",
        author: "Sir Arwin",
        content: "Hi Sarah, I'm preparing your COE. It should be ready by tomorrow.",
        timestamp: "2024-02-21T10:15:00",
        type: "comment",
      },
      {
        id: "2",
        author: "System",
        content: "Status changed from Open to In Progress",
        timestamp: "2024-02-21T10:15:00",
        type: "status-change",
      },
    ],
  },
  {
    id: "TKT-2024-002",
    employeeName: "John Smith",
    employeeId: "EMP-5678",
    department: "Marketing",
    category: "Employment Function",
    subcategory: "Recruitment & Selection",
    subject: "Interview schedule coordination",
    description: "Need to coordinate interview schedules for the new Marketing Manager position. Three candidates shortlisted.",
    priority: "medium",
    status: "open",
    assignedTo: "Sir Sam",
    createdAt: "2024-02-23T11:00:00",
    updatedAt: "2024-02-23T11:00:00",
    comments: [],
  },
  {
    id: "TKT-2024-003",
    employeeName: "Emily Davis",
    employeeId: "EMP-2345",
    department: "Sales",
    category: "Personal Function",
    subcategory: "Loan Requests",
    subject: "Emergency loan request",
    description: "I would like to request an emergency loan of PHP 50,000 for medical expenses. I can provide the necessary documentation.",
    priority: "high",
    status: "waiting",
    assignedTo: "Ma'am Alex",
    createdAt: "2024-02-15T08:30:00",
    updatedAt: "2024-02-18T16:45:00",
    comments: [
      {
        id: "1",
        author: "Ma'am Alex",
        content: "Please submit the required medical documents and a promissory note.",
        timestamp: "2024-02-18T16:45:00",
        type: "comment",
      },
    ],
  },
  {
    id: "TKT-2024-004",
    employeeName: "Michael Brown",
    employeeId: "EMP-3456",
    department: "Finance",
    category: "Employment Function",
    subcategory: "Final Pay",
    subject: "Final pay inquiry",
    description: "I resigned last month and would like to inquire about the status of my final pay. My last day was January 31, 2024.",
    priority: "medium",
    status: "in-progress",
    assignedTo: "Sir Sam",
    createdAt: "2024-02-19T10:00:00",
    updatedAt: "2024-02-22T09:30:00",
    comments: [
      {
        id: "1",
        author: "Sir Sam",
        content: "Your final pay is being processed. You should receive it by next week.",
        timestamp: "2024-02-22T09:30:00",
        type: "comment",
      },
    ],
  },
  {
    id: "TKT-2024-005",
    employeeName: "Jessica White",
    employeeId: "EMP-4567",
    department: "Operations",
    category: "Personal Function",
    subcategory: "Employee Incentives",
    subject: "Performance bonus inquiry",
    description: "I would like to inquire about the status of the Q4 performance bonus that was announced last month.",
    priority: "low",
    status: "resolved",
    assignedTo: "Sir Arwin",
    createdAt: "2024-02-10T14:20:00",
    updatedAt: "2024-02-12T11:00:00",
    comments: [
      {
        id: "1",
        author: "Sir Arwin",
        content: "Your Q4 bonus has been processed and will be included in your next payroll.",
        timestamp: "2024-02-12T10:30:00",
        type: "comment",
      },
    ],
  },
  {
    id: "TKT-2024-006",
    employeeName: "David Lee",
    employeeId: "EMP-5789",
    department: "Engineering",
    category: "Employment Function",
    subcategory: "Exit Clearance",
    subject: "Exit clearance process",
    description: "I will be resigning effective March 15, 2024. I need information about the exit clearance process and requirements.",
    priority: "medium",
    status: "open",
    assignedTo: "Ma'am Alex",
    createdAt: "2024-02-22T13:45:00",
    updatedAt: "2024-02-23T10:20:00",
    comments: [
      {
        id: "1",
        author: "Ma'am Alex",
        content: "I'll send you the exit clearance checklist and schedule an exit interview.",
        timestamp: "2024-02-23T10:20:00",
        type: "comment",
      },
    ],
  },
  {
    id: "TKT-2024-007",
    employeeName: "Amanda Martinez",
    employeeId: "EMP-6890",
    department: "Customer Success",
    category: "Personal Function",
    subcategory: "Contract Request",
    subject: "Updated employment contract needed",
    description: "I need an updated copy of my employment contract for visa application purposes.",
    priority: "medium",
    status: "in-progress",
    assignedTo: "Sir Arwin",
    createdAt: "2024-02-24T09:15:00",
    updatedAt: "2024-02-24T09:15:00",
    comments: [],
  },
  {
    id: "TKT-2024-008",
    employeeName: "Robert Taylor",
    employeeId: "EMP-7901",
    department: "Product",
    category: "Employment Function",
    subcategory: "Offboarding",
    subject: "Company equipment return",
    description: "I'm leaving the company next week. What is the process for returning my laptop and other company equipment?",
    priority: "high",
    status: "open",
    assignedTo: "Sir Sam",
    createdAt: "2024-02-21T11:30:00",
    updatedAt: "2024-02-22T15:45:00",
    comments: [],
  },
];

export const hrStaff = ["Sir Sam", "Ma'am Alex", "Sir Arwin"];
