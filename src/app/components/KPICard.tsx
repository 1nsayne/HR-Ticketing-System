import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../components/ui/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export function KPICard({ title, value, icon: Icon, trend, color = "text-blue-600" }: KPICardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-semibold">{value}</p>
            {trend && <p className="text-xs text-gray-500">{trend}</p>}
          </div>
          <div className={cn("p-3 rounded-lg bg-blue-50", color)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
