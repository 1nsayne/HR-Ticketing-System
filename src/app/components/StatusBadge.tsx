import { cn } from "../components/ui/utils";

interface StatusBadgeProps {
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    open: { label: "Open", color: "bg-gray-100 text-gray-700 border-gray-300" },
    "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-300" },
    waiting: { label: "Waiting", color: "bg-orange-100 text-orange-700 border-orange-300" },
    resolved: { label: "Resolved", color: "bg-green-100 text-green-700 border-green-300" },
    closed: { label: "Closed", color: "bg-gray-600 text-white border-gray-600" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
