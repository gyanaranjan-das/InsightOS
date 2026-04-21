'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownRight } from 'lucide-react';

interface FunnelStep {
  step: string;
  count: number;
  conversionRate: number;
  dropOff: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  loading?: boolean;
}

export function FunnelChart({ data, loading }: FunnelChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>Onboarding flow conversion rates step-by-step</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-5/6 h-16" />
            <Skeleton className="w-4/6 h-16" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No funnel data available.
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {data.map((step, i) => {
              const maxCount = data[0].count || 1;
              const widthRatio = Math.max((step.count / maxCount) * 100, 5); // min 5% width for visibility
              
              return (
                <div key={step.step} className="relative">
                  {i > 0 && (
                    <div className="absolute -top-3 left-6 flex items-center text-xs font-semibold text-destructive z-10 bg-background px-1 border border-border rounded">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {step.dropOff}% drop
                    </div>
                  )}
                  <div className="flex h-14 items-center justify-between overflow-hidden rounded-md border border-border bg-muted/30">
                    <div 
                      className="flex h-full items-center bg-primary/20 transition-all duration-1000 ease-in-out border-r border-primary/30"
                      style={{ width: `${widthRatio}%` }}
                    >
                      <div className="px-4 font-medium truncate shrink-0 max-w-full">
                        <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs shadow-sm">
                          {i + 1}
                        </span>
                        {step.step.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div className="px-4 text-right shrink-0 bg-background/50 backdrop-blur-sm h-full flex flex-col justify-center border-l border-border/50">
                      <span className="block text-sm font-bold">{new Intl.NumberFormat().format(step.count)}</span>
                      <span className="block text-xs text-muted-foreground">{step.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
