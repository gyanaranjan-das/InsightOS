'use client';

import { useEffect, useState } from 'react';
import { Activity, Users, Clock, MousePointerClick } from 'lucide-react';
import api from '@/lib/api';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EventsLineChart } from '@/components/dashboard/EventsLineChart';
import { TopEventsBar } from '@/components/dashboard/TopEventsBar';
import { LiveFeed } from '@/components/dashboard/LiveFeed';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DashboardOverview() {
  const [days, setDays] = useState('30');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [timeseries, setTimeseries] = useState<any>([]);
  const [topEvents, setTopEvents] = useState<any>([]);
  const [funnel, setFunnel] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sumRes, timeRes, topRes, funRes] = await Promise.all([
          api.get(`/api/events/summary?days=${days}`),
          api.get(`/api/events/timeseries?days=${days}`),
          api.get(`/api/events/top?days=${days}`),
          api.post('/api/events/funnel', {
            steps: ['page_view', 'sign_up', 'onboarding_completed']
          }),
        ]);

        setSummary(sumRes.data);
        setTimeseries(timeRes.data);
        setTopEvents(topRes.data);
        setFunnel(funRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Monitor your core SaaS metrics and user activity.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={days} onValueChange={(val: string | null) => setDays(val || '30')}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Events"
          value={summary?.totalEvents || 0}
          icon={Activity}
          loading={loading}
          description={`Over the last ${days} days`}
        />
        <MetricCard
          title="Unique Users"
          value={summary?.uniqueUsers || 0}
          icon={Users}
          loading={loading}
          description="Active users tracked"
        />
        <MetricCard
          title="Sessions"
          value={summary?.uniqueSessions || 0}
          icon={MousePointerClick}
          loading={loading}
          description="Total active sessions"
        />
        <MetricCard
          title="Avg Session"
          value={`${summary?.avgSessionDuration || 0}s`}
          icon={Clock}
          loading={loading}
          description="Average duration"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <EventsLineChart data={timeseries} loading={loading} />
        <TopEventsBar data={topEvents} loading={loading} />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <FunnelChart data={funnel} loading={loading} />
        <LiveFeed />
      </div>
    </div>
  );
}
