'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AIResult {
  insight: string;
  recommendations: string[];
  confidence: number;
  dataPoints: { label: string; value: number }[];
}

interface InsightCardProps {
  query: string;
  result: AIResult | null;
}

export function InsightCard({ query, result }: InsightCardProps) {
  if (!result) return null;

  const getConfidenceColor = (score: number) => {
    if (score > 0.8) return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (score > 0.5) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const getConfidenceText = (score: number) => {
    if (score > 0.8) return 'High Confidence';
    if (score > 0.5) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 px-1 text-muted-foreground">
        <div className="h-6 w-6 rounded flex items-center justify-center bg-muted">
          <span className="text-xs font-semibold">Q</span>
        </div>
        <p className="text-sm italic">&quot;{query}&quot;</p>
      </div>

      <Card className="border-primary/20 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">AI Insight</CardTitle>
            </div>
            <Badge variant="outline" className={getConfidenceColor(result.confidence)}>
              {getConfidenceText(result.confidence)} ({Math.round(result.confidence * 100)}%)
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-5 space-y-8">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-foreground/90 font-medium">
              {result.insight}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4" /> Recommended Actions
              </h4>
              <ul className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span className="leading-tight">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.dataPoints?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <TrendingUp className="h-4 w-4" /> Supporting Data
                </h4>
                <div className="h-[150px] w-full rounded-lg border border-border/50 bg-muted/10 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.dataPoints}>
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          borderRadius: '8px', 
                          border: '1px solid hsl(var(--border))',
                          fontSize: '12px'
                        }} 
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
