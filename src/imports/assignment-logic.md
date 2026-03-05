# HR Ticketing System - Assignment Logic Implementation

## Assignment Logic UI (Admin Only)

### Overview
The ticket assignment system now implements smart logic based on ticket status, ensuring proper workflow and preventing unauthorized reassignments.

### Status-Based Assignment Rules

#### 1. **Open Status**
- ✅ Assignment dropdown is **enabled**
- ✅ Admin can select from HR staff assigned to ticket's category
- ⚠️ Warning message displayed: "Assignment will be locked once ticket is moved to 'In Progress' status"
- Shows available HR staff for the specific category

#### 2. **In Progress Status**
- 🔒 Assignment dropdown is **disabled**
- HR staff name is still displayed but cannot be changed
- Info message: "Assignment is locked. Change status to 'Open' to reassign"
- Lock icon displayed next to assigned HR name in header

#### 3. **Waiting Status**
- 🔒 Assignment dropdown is **disabled**
- Same behavior as "In Progress"
- Assignment remains locked during waiting period

#### 4. **Resolved/Closed Status**
- ❌ Assignment control is **hidden completely**
- Assignment is permanent at this stage
- Only status information is shown in metadata card

### Visual Indicators

#### Header Display
```
[Ticket ID] TKT-2024-001
[Subject] Certificate of Employment needed

👤 Assigned to: Sir Arwin [🔒 Locked]  (shown when locked)
```

#### Assignment Dropdown Section
**When Status = Open:**
```
Assign HR Staff
[Dropdown: Sir Sam, Ma'am Alex] ← Category-specific

Available for Personal Function

⚠️ Note: Assignment will be locked once ticket 
   is moved to "In Progress" status.
```

**When Status = In Progress/Waiting:**
```
Assign HR Staff
[Dropdown: Sir Arwin] ← Disabled/Grayed out

Available for Personal Function

🔒 Assignment is locked. Change status to 
   "Open" to reassign.
```

### Category-Based HR Filtering

The assignment dropdown only shows HR staff that are authorized for the ticket's category:

**Employment Function Tickets:**
- Sir Sam
- Ma'am Alex

**Personal Function Tickets:**
- Sir Arwin
- Ma'am Alex

### Technical Implementation

```typescript
// Get allowed HR for category
const allowedHRForCategory = categories.find(
  (c) => c.name === ticket?.category
)?.assignedHR || [];

// Show/hide assignment control
const showAssignment = 
  status === "open" || 
  status === "in-progress" || 
  status === "waiting";

// Enable/disable assignment control
const disableAssignment = 
  status === "in-progress" || 
  status === "waiting";
```

### User Experience

1. **Admin opens ticket with status "Open"**
   - Sees assignment dropdown enabled
   - Can select from category-specific HR staff
   - Warning shown about assignment locking

2. **Admin changes status to "In Progress"**
   - Assignment dropdown becomes disabled
   - Lock icon appears in header
   - Cannot change assignment unless reverting to "Open"

3. **Admin needs to reassign**
   - Changes status back to "Open"
   - Assignment dropdown becomes enabled again
   - Can select new HR staff
   - Changes status back to continue workflow

4. **Ticket reaches "Resolved"**
   - Assignment control hidden
   - Assignment is permanent
   - Focus shifts to completion/closing

### Benefits

✅ **Prevents accidental reassignments** during active work
✅ **Clear visual feedback** with lock icons and warning messages
✅ **Category-based filtering** ensures proper routing
✅ **Flexible workflow** allows reopening if needed
✅ **Professional UX** with appropriate messaging

### Security

- Only Admin role can see assignment controls
- HR role cannot reassign tickets (even their own)
- Employee role has no visibility of assignment controls
- Category filtering enforced at UI level
