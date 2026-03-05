import { cn } from "../components/ui/utils";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { label: "Low", color: "bg-gray-100 text-gray-600" },
    medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
    high: { label: "High", color: "bg-red-100 text-red-700" },
  };

  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
