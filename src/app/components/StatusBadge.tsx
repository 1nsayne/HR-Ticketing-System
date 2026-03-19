import { cn } from "../components/ui/utils";

interface StatusBadgeProps {
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    open: { label: "Open", color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600" },
    "in-progress": { label: "In Progress", color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700" },
    waiting: { label: "Waiting", color: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700" },
    resolved: { label: "Resolved", color: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700" },
    closed: { label: "Closed", color: "bg-gray-600 dark:bg-gray-700 text-white dark:text-gray-200 border-gray-600 dark:border-gray-700" },
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
