"use client";

import React from "react";
import { KpiStrip } from "../../../components/dashboard/KpiStrip";
import { OverloadedWidget } from "../../../components/dashboard/OverloadedWidget";
import { DeadlineWidget } from "../../../components/dashboard/DeadlineWidget";
import { PrioritySchedulerWidget } from "../../../components/dashboard/PrioritySchedulerWidget";
import { WorkloadChart } from "../../../components/dashboard/WorkloadChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* KPI Overview Strip */}
      <section aria-label="Key Performance Indicators">
        <KpiStrip />
      </section>

      {/* Widgets Grid: Overloaded, Deadlines & Priority Scheduler */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverloadedWidget />
        <DeadlineWidget />
        <PrioritySchedulerWidget />
      </section>

      {/* Main Full Team Workload Distribution Chart */}
      <section aria-label="Team Workload Distribution">
        <WorkloadChart />
      </section>
    </div>
  );
}
