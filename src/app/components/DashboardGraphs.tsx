"use client";

import * as React from "react";
import { mockTickets } from "../data/mockData";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "./ui/utils";
import * as Recharts from "recharts";

const chartConfigStatus: ChartConfig = {
  open: { label: "Open" },
  "in-progress": { label: "In Progress" },
  waiting: { label: "Waiting" },
  resolved: { label: "Resolved" },
  closed: { label: "Closed" },
};

const chartConfigPriority: ChartConfig = {
  low: { label: "Low" },
  medium: { label: "Medium" },
  high: { label: "High" },
};

const chartConfigCategory: ChartConfig = {
  "Employment Function": { label: "Employment" },
  "Personal Function": { label: "Personal" },
};

export function DashboardGraphs() {
  // Status counts
  const statusData = React.useMemo(() => mockTickets.reduce((acc, ticket) => {
    const index = acc.findIndex(item => item.status === ticket.status);
    if (index > -1) {
      acc[index].count += 1;
    } else {
      acc.push({ status: ticket.status, count: 1 });
    }
    return acc;
  }, [] as { status: string; count: number }[]), []);

  // Priority counts
  const priorityData = React.useMemo(() => mockTickets.reduce((acc, ticket) => {
    const index = acc.findIndex(item => item.priority === ticket.priority);
    if (index > -1) {
      acc[index].count += 1;
    } else {
      acc.push({ priority: ticket.priority, count: 1 });
    }
    return acc;
  }, [] as { priority: string; count: number }[]), []);

  // Category counts
  const categoryData = React.useMemo(() => mockTickets.reduce((acc, ticket) => {
    const index = acc.findIndex(item => item.category === ticket.category);
    if (index > -1) {
      acc[index].count += 1;
    } else {
      acc.push({ category: ticket.category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]), []);

  // Trend data
  const trendData = React.useMemo(() => {
    const data = mockTickets.map(ticket => ({
      date: new Date(ticket.createdAt).toLocaleDateString('short'),
      count: 1
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const reduced = data.reduce((acc, curr) => {
      acc[curr.date] = (acc[curr.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(reduced).map(([date, count]) => ({ date, count }));
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <ChartContainer config={chartConfigStatus} className="h-[200px] w-full">
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.PieChart>
                <Recharts.Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={60}>
                  {statusData.map((entry, index) => (
                    <Recharts.Cell key={index} fill={`hsl(${index * 72}, 70%, 50%)`} />
                  ))}
                </Recharts.Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </Recharts.PieChart>
            </Recharts.ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Priority */}
      <Card>
        <CardHeader>
          <CardTitle>Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigPriority} className="h-[200px] w-full">
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data={priorityData}>
                <Recharts.CartesianGrid vertical={false} />
                <Recharts.XAxis dataKey="priority" />
                <Recharts.YAxis />
                <ChartTooltip />
                <Recharts.Bar dataKey="count" />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigCategory} className="h-[200px] w-full">
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data={categoryData}>
                <Recharts.CartesianGrid vertical={false} />
                <Recharts.XAxis dataKey="category" />
                <Recharts.YAxis />
                <ChartTooltip />
                <Recharts.Bar dataKey="count" />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Trends */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Ticket Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: "Tickets" } }} className="h-[200px] w-full">
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.LineChart data={trendData}>
                <Recharts.CartesianGrid vertical={false} />
                <Recharts.XAxis dataKey="date" />
                <Recharts.YAxis />
                <ChartTooltip />
                <Recharts.Line type="monotone" dataKey="count" stroke="#8884d8" />
              </Recharts.LineChart>
            </Recharts.ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

