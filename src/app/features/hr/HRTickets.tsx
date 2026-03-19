import React, { useState } from "react";
import {
  Ticket as TicketIcon,
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Send,
  Filter,
} from "lucide-react";
import { Ticket } from "../../data/mockData";

interface HRTicketsProps {
  tickets: Ticket[];
  assignedCategories: string[];
  onSelectTicket: (ticketId: string | null) => void;
  selectedTicketId: string | null;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "secondary";
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-[#B0BF00] text-white hover:bg-[#99A600]",
    ghost: "text-gray-600 hover:bg-gray-100",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };
  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const HRTickets: React.FC<HRTicketsProps> = ({
  tickets,
  assignedCategories,
  onSelectTicket,
  selectedTicketId,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  // Filter tickets by category if selected
  const displayTickets =
    filterCategory === "all"
      ? tickets
      : tickets.filter((t) => t.category === filterCategory);

  if (selectedTicket) {
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => onSelectTicket(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#B0BF00] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Chat & Conversation */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      selectedTicket.status === "open"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : selectedTicket.status === "in-progress"
                        ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                        : selectedTicket.status === "resolved"
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    } mb-3 inline-block`}
                  >
                    {selectedTicket.status}
                  </span>
                  <h1 className="text-2xl font-bold dark:text-white">
                    {selectedTicket.subject}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Ticket {selectedTicket.id} • Created on{" "}
                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg" aria-label="More options">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-8 mt-10">
                {/* Message: Employee */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                    {selectedTicket.employeeName.charAt(0)}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                    <p className="text-sm font-bold mb-1 dark:text-white">
                      {selectedTicket.employeeName}{" "}
                      <span className="text-[10px] text-gray-400 font-normal ml-2">
                        10:15 AM
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      Hello HR Team, I noticed that my overtime for the last
                      week of September wasn't reflected in my latest payslip.
                      I worked 8 hours extra. Can you please check?
                    </p>
                  </div>
                </div>

                {/* Message: HR (System) */}
                <div className="flex gap-4 justify-end">
                  <div className="bg-[#B0BF00]/10 rounded-2xl rounded-tr-none p-4 max-w-[85%] text-right border border-[#B0BF00]/20">
                    <p className="text-sm font-bold mb-1 text-[#B0BF00]">
                      System{" "}
                      <span className="text-[10px] text-gray-400 font-normal ml-2">
                        10:16 AM
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                      Ticket status updated to "In Progress". Assigned to
                      Alexis JoyceFausto.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#B0BF00] flex items-center justify-center text-white font-bold flex-shrink-0">
                    S
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 border border-gray-100 dark:border-gray-600 focus-within:border-[#B0BF00]/50 transition-all">
                  <textarea
                    placeholder="Type your reply to the employee..."
                    className="w-full bg-transparent border-none outline-none text-sm resize-none h-24 dark:text-white"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-400" aria-label="Attach file">
                        <Paperclip className="w-4 h-4" />
                      </button>
                    </div>
                    <Button className="px-6 py-2">
                      Send Reply
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Metadata & Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-6 text-sm uppercase tracking-wider text-gray-400">
                Ticket Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-100 dark:border-gray-600">
                    <div className="w-6 h-6 rounded-full bg-[#B0BF00] text-white text-[10px] flex items-center justify-center font-bold">
                      AT
                    </div>
                    <span className="text-xs font-semibold dark:text-white">
                      Alexis Joyce Fausto
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Priority</p>
                    <select className="w-full text-xs font-bold bg-gray-50 dark:bg-gray-700 border-none rounded-lg p-2 outline-none dark:text-white" aria-label="Ticket priority">
                      <option>{selectedTicket.priority}</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Category</p>
                    <div className="text-xs font-bold bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-2 dark:text-white">
                      {selectedTicket.category}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button className="w-full justify-center text-sm py-3">
                  Mark as Resolved
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">
                Internal Notes
              </h3>
              <textarea
                placeholder="Add a private note only HR can see..."
                className="w-full text-xs bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-3 h-24 outline-none focus:ring-1 focus:ring-[#B0BF00] dark:text-white"
              />
              <Button variant="secondary" className="w-full text-xs mt-3">
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ticket Management
          </h1>
          <p className="text-gray-700 dark:text-gray-200 mt-1">
            Review and resolve employee requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button>Export CSV</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-wrap gap-4 items-center">
        <select
          className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#B0BF00] outline-none min-w-[150px] dark:text-white"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {assignedCategories?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          )) || []}
        </select>
        <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#B0BF00] outline-none min-w-[150px] dark:text-white" aria-label="Filter by status">
          <option>All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {displayTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <td className="px-6 py-4 font-bold text-sm dark:text-white">
                  {ticket.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-white">
                      {ticket.employeeName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium dark:text-white">
                      {ticket.employeeName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {ticket.category}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      ticket.status === "open"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : ticket.status === "in-progress"
                        ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                        : ticket.status === "resolved"
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    className="text-xs py-1.5 md:opacity-0 group-hover:opacity-100"
                    onClick={() => onSelectTicket(ticket.id)}
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
