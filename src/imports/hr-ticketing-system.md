# HR Ticketing System - RBAC Implementation

## System Overview
Modern, professional, web-based HR Ticketing System with Role-Based Access Control (RBAC).

## Style Guide
- Clean corporate design
- White and light gray background
- Blue primary accent color (#3B82F6)
- Rounded cards and components
- Clear spacing and hierarchy
- Professional enterprise look
- Fully responsive layout

## Role-Based Access Control

### 1) EMPLOYEE ROLE
**Permissions:**
- ✓ Can create tickets
- ✓ Can view only their own tickets
- ✓ Can read comments on their own tickets
- ✗ Cannot assign tickets
- ✗ Cannot change ticket status
- ✗ Cannot view other employees' tickets
- ✗ Cannot access admin settings

**UI Features:**
- Simple dashboard with summary cards (Open, Waiting, Resolved)
- "My Tickets" table showing only their submissions
- "Create Ticket" button prominently displayed
- Read-only ticket status tracking
- Clean and minimal layout

---

### 2) HR ROLE
**Permissions:**
- ✓ Can view tickets assigned to their category
- ✓ Can update ticket status (Open, In Progress, Waiting, Resolved)
- ✓ Can add comments
- ✓ Can add internal notes (not visible to employees)
- ✗ Cannot reassign tickets outside their category
- ✗ Cannot change system settings
- ✗ Cannot manage user roles
- ✗ Cannot view tickets outside assigned categories

**UI Features:**
- HR Dashboard with assigned tickets
- Category and status filters
- Ticket detail page with:
  - Status dropdown
  - Comment section
  - Activity timeline
  - Internal notes section
- No access to system configuration

---

### 3) ADMIN ROLE
**Permissions:**
- ✓ Full system access
- ✓ Assign HR to specific categories
- ✓ Manage categories
- ✓ View all tickets
- ✓ Reassign tickets to any HR staff
- ✓ Configure routing rules
- ✓ Manage users and roles
- ✓ Update status and add comments

**UI Features:**
- Full admin dashboard with all tickets
- HR Assignment Matrix showing category-to-HR mapping
- Complete filter controls
- Sidebar navigation
- System-wide KPI tracking

---

## Category Assignment Structure

### EMPLOYMENT FUNCTION
**Assigned HR:**
- Sir Sam
- Ma'am Alex

**Handles:**
- Recruitment & Selection
- Offboarding
- Final Pay
- Exit Clearance

### PERSONAL FUNCTION
**Assigned HR:**
- Sir Arwin
- Ma'am Alex

**Handles:**
- Contract Request
- COE Request
- Employee Incentives
- Loan Requests

---

## System Logic

### Auto-Routing
- When employee selects category, ticket is automatically routed to assigned HR based on category
- System shows assigned HR in the category dropdown
- If multiple HR assigned to same category, system distributes based on availability

### Access Control
- HR can only see and manage tickets in their assigned categories
- Employees can only see their own tickets
- Admin has unrestricted access to all tickets

---

## Implemented Screens

### 1) Login Page
- Company logo/branding
- Employee ID / Email input
- Password input
- Login button
- "Forgot Password" link
- Demo mode toggle (Employee / HR / Admin)
- Role-based redirection after login

### 2) Employee Dashboard
- Welcome message with user name
- Summary cards showing:
  - Open Tickets (blue)
  - Waiting (orange)
  - Resolved (green)
- My Tickets table with columns:
  - Ticket ID
  - Category
  - Subject
  - Status (color-coded badge)
  - Assigned To
  - Last Updated
- "Create New Ticket" button (primary action)
- Read-only view (no status modification)

### 3) HR Dashboard
- Header showing user name and role
- Display of assigned categories
- Summary cards:
  - Total Assigned
  - Open/In Progress
  - Waiting
- Filter bar for category and status
- Tickets table showing only assigned category tickets
- "Manage" button to view/update tickets

### 4) Admin Dashboard
- Sidebar navigation
- Comprehensive KPI cards:
  - Total Tickets
  - Open
  - Overdue
  - Avg Resolution Time
- HR Assignment Matrix card showing:
  - Category names
  - Subcategories
  - Assigned HR staff (with badges)
- Advanced filter bar:
  - Category
  - Status
  - Priority
- All tickets table with full system view
- View/manage all tickets

### 5) Ticket Detail View
**Role-Based Display:**

**For Employees:**
- View ticket information
- See status updates (read-only)
- Read HR comments
- Cannot modify status or add comments
- Blue notice explaining employee limitations

**For HR Staff:**
- Update ticket status (Open → Resolved)
- Add public comments
- Add internal notes (not visible to employee)
- View full activity timeline
- Orange-highlighted internal notes section

**For Admins:**
- All HR capabilities plus:
- Reassign tickets to any HR staff
- Change status to Closed
- Full management controls

**Common Elements:**
- Ticket header with ID and status
- Employee information panel
- Request details (category, description)
- Attachments section
- Activity timeline
- Metadata card (created, updated, assigned)

---

## Status Colors (Implemented)
- **Open** - Gray (#E5E7EB text on white)
- **In Progress** - Blue (#DBEAFE background, #1D4ED8 text)
- **Waiting** - Orange (#FED7AA background, #C2410C text)
- **Resolved** - Green (#D1FAE5 background, #15803D text)
- **Closed** - Dark Gray (#4B5563 background, white text)

---

## Technical Implementation

### Technologies Used
- React with TypeScript
- React Router for navigation
- Context API for authentication and role management
- Tailwind CSS for styling
- Radix UI components for accessibility
- Lucide React for icons

### Key Components
- `AuthContext` - Manages user authentication and permissions
- `StatusBadge` - Color-coded status indicators
- `PriorityBadge` - Priority level indicators
- `KPICard` - Reusable metric cards
- `AdminSidebar` - Admin navigation
- `EmployeeNavbar` - Employee navigation

### Permission System
```typescript
permissions = {
  employee: ["create_ticket", "view_own_tickets", "comment_own_tickets"],
  hr: ["view_assigned_tickets", "update_ticket_status", "add_comments"],
  admin: ["view_all_tickets", "reassign_tickets", "manage_categories", ...]
}
```

---

## Demo Accounts

**Employee:**
- Name: Sarah Johnson
- ID: EMP-1234
- Department: Engineering

**HR:**
- Sir Sam (Employment Function)
- Ma'am Alex (Both functions)
- Sir Arwin (Personal Function)

**Admin:**
- Full system access
- Can view HR assignment matrix
- Can manage all tickets

---

## Future Enhancements
- Real-time notifications
- Email integration
- SLA tracking and alerts
- Advanced reporting and analytics
- Bulk ticket operations
- File attachment handling
- Search functionality
- Export to CSV/PDF
- Mobile app version
- Integration with HR systems
