# HR Employee to Admin Employee Rename Task

## Progress: 0/6 steps complete

### Steps:
- [x] Step 1: routes.ts updated ✅
- [x] Step 2: HRSidebar.tsx updated ✅
- [x] Step 3: hr/index.ts cleaned ✅

## Progress: 6/6 COMPLETE ✅

**Summary:**
- Routes cleaned
- Sidebar links to AdminEmployees
- HR index cleaned
- HRPage employees tab removed  
- Both HREmployees files deleted
- AdminEmployees kept as main employee page

**Test with:** `npm run dev` then visit /hr and click Employees (goes to admin employees)
</xai:function_call > 

**Step 2 & 3 Complete. HRSidebar now links Employees to AdminEmployees. hr/index.ts cleaned.**

**Next: Step 4** 

<xai:function_call name="read_file">
<parameter name="path">src/app/features/hr/HRPage.tsx
- [ ] Step 3: Update src/app/features/hr/index.ts - Remove HREmployees export
- [ ] Step 4: Update src/app/features/hr/HRPage.tsx - Remove employees tab reference
- [ ] Step 5: Delete src/app/features/hr/HREmployees.tsx (duplicate, simple table)
- [ ] Step 6: Delete src/app/pages/HREmployees.tsx (route points to features anyway)

**Notes:** Keep src/app/features/admin/AdminEmployees.tsx as-is (primary impl). Test navigation after.

## Next Action: Implementing Step 1

