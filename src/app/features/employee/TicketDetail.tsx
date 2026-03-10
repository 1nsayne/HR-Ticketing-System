import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";
import { PriorityBadge } from "../../components/PriorityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import {
  ArrowLeft,
  User,
  Calendar,
  Paperclip,
  MessageSquare,
  Clock,
  Shield,
  UserCheck,
  Lock,
} from "lucide-react";
import { mockTickets, categories } from "../../data/mockData";

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
        id="hex-detail" 
        points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" 
      />
    </defs>
    <g opacity="0.6" stroke="#C9D866" strokeWidth="12" fill="none" strokeLinejoin="round">
      <use href="#hex-detail" x="173.2" y="150" />
      <use href="#hex-detail" x="86.6" y="0" />
      <use href="#hex-detail" x="259.8" y="0" />
      <use href="#hex-detail" x="0" y="150" />
      <use href="#hex-detail" x="346.4" y="150" />
      <use href="#hex-detail" x="86.6" y="300" />
      <use href="#hex-detail" x="259.8" y="300" />
    </g>
  </svg>
);

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const ticket = mockTickets.find((t) => t.id === id);

  const [status, setStatus] = useState(ticket?.status || "open");
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo || "");
  const [newComment, setNewComment] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // Get HR staff allowed for this ticket's category
  const allowedHRForCategory =
    categories.find((c) => c.name === ticket?.category)?.assignedHR || [];

  // Determine if assignment dropdown should be shown, disabled, or hidden
  const showAssignment =
    ticket?.status === "open" || ticket?.status === "in-progress" || ticket?.status === "waiting";
  const disableAssignment = ticket?.status === "in-progress" || ticket?.status === "waiting";

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ticket not found</h2>
          <Button onClick={() => navigate(user.role === "admin" ? "/admin" : user.role === "hr" ? "/hr" : "/employee")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has access to this ticket
  const canViewTicket = () => {
    if (user.role === "admin") return true;
    if (user.role === "hr") {
      return user.assignedCategories?.includes(ticket.category);
    }
    if (user.role === "employee") {
      return ticket.employeeName === user.name;
    }
    return false;
  };

  if (!canViewTicket()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to view this ticket.</p>
          <Button onClick={() => navigate(user.role === "admin" ? "/admin" : user.role === "hr" ? "/hr" : "/employee")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In real app, would save comment to backend
      setNewComment("");
    }
  };

  const handleAddInternalNote = () => {
    if (internalNote.trim()) {
      // In real app, would save internal note to backend
      setInternalNote("");
    }
  };

  const getBackLink = () => {
    if (user.role === "admin") return "/admin";
    if (user.role === "hr") return "/hr";
    return "/employee";
  };

  const canUpdateStatus = hasPermission("update_ticket_status");
  const canReassign = hasPermission("reassign_tickets");

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Honeycomb Backgrounds - bottom-right and top-right, behind content */}
      <HoneycombPattern className="top-0 right-0 translate-x-[20%] -translate-y-[20%] scale-110 z-0" />
      <HoneycombPattern className="bottom-0 right-0 translate-x-[20%] translate-y-[20%] scale-110 rotate-180 z-0" />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={getBackLink()}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">{ticket.id}</h1>
                <p className="text-gray-600 text-sm mt-0.5">{ticket.subject}</p>
                {/* Assigned HR Display */}
                {ticket.assignedTo && (
                  <div className="flex items-center gap-2 mt-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      Assigned to:{" "}
                      <span className="font-medium text-gray-900">{ticket.assignedTo}</span>
                    </span>
                    {disableAssignment && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employee Details */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium mt-1">{ticket.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-medium mt-1">{ticket.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium mt-1">{ticket.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Priority</p>
                    <div className="mt-1">
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Category</p>
                  <p className="text-sm text-gray-600">
                    {ticket.category} → {ticket.subcategory}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Attachments
                      </p>
                      <div className="space-y-2">
                        {ticket.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
                          >
                            <Paperclip className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {ticket.comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    ticket.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {hasPermission("add_comments") && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Add Comment</label>
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleAddComment} size="sm">
                        Post Comment
                      </Button>
                    </div>
                  </>
                )}

                {user.role === "employee" && !hasPermission("add_comments") && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Comments will appear here when HR responds to your ticket.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Internal Notes (HR/Admin Only) */}
            {(user.role === "hr" || user.role === "admin") && (
              <Card className="shadow-sm border-gray-200 border-orange-200 bg-orange-50/30">
                <CardHeader className="border-b border-orange-200">
                  <CardTitle className="flex items-center gap-2 text-lg text-orange-900">
                    <Shield className="w-5 h-5" />
                    Internal Notes (Not Visible to Employee)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add internal notes..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      rows={3}
                      className="bg-white"
                    />
                    <Button onClick={handleAddInternalNote} size="sm" variant="outline">
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Status & Assignment Card (HR/Admin Only) */}
            {(canUpdateStatus || canReassign) && (
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg">Manage Ticket</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {canUpdateStatus && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="waiting">Waiting</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          {user.role === "admin" && <SelectItem value="closed">Closed</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {canReassign && showAssignment && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Assign HR Staff
                      </label>
                      <Select 
                        value={assignedTo} 
                        onValueChange={setAssignedTo}
                        disabled={disableAssignment}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedHRForCategory.map((staff) => (
                            <SelectItem key={staff} value={staff}>
                              {staff}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Category-specific HR info */}
                      <p className="text-xs text-gray-500">
                        Available for {ticket.category}
                      </p>
                      
                      {/* Assignment lock warning */}
                      {ticket.status === "open" && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-900">
                            <strong>Note:</strong> Assignment will be locked once ticket is moved to "In Progress" status.
                          </p>
                        </div>
                      )}
                      
                      {disableAssignment && (
                        <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <Lock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">
                            Assignment is locked. Change status to "Open" to reassign.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    style={{ backgroundColor: 'rgb(176, 191, 0)', borderColor: 'rgb(176, 191, 0)' }}
                    className="w-full hover:bg-opacity-90 text-white"
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ticket Metadata */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-sm font-medium mt-1">
                    {ticket.assignedTo || "Pending Assignment"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Current Status</p>
                  <div className="mt-1">
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee View Notice */}
            {user.role === "employee" && (
              <Card className="shadow-sm border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> You can view your ticket status and HR responses here. Status updates and reassignment are managed by HR.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

