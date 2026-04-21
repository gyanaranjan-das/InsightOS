'use client';

import { useState } from 'react';
import { QueryInput } from '@/components/ai/QueryInput';
import { InsightCard } from '@/components/ai/InsightCard';
import { LoadingSkeleton } from '@/components/ai/LoadingSkeleton';
import { QueryHistory } from '@/components/ai/QueryHistory';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AIPage() {
  const [currentQuery, setCurrentQuery] = useState<{ query: string; result: any | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQuerySubmit = async (query: string) => {
    try {
      setLoading(true);
      setCurrentQuery({ query, result: null });
      
      const { data } = await api.post('/api/ai/query', { question: query });
      
      setCurrentQuery({ query, result: data });
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to analyze data.');
      setCurrentQuery(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (query: string, result: any) => {
    setCurrentQuery({ query, result });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 lg:flex-row">
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto w-full gap-6 shrink-0">
        <div className="shrink-0 space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-muted-foreground">Ask questions about your data in plain English.</p>
        </div>

        <div className="shrink-0">
          <QueryInput onSubmit={handleQuerySubmit} disabled={loading} />
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          {loading ? (
            <LoadingSkeleton />
          ) : currentQuery?.result ? (
            <InsightCard query={currentQuery.query} result={currentQuery.result} />
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <span className="text-primary text-xl">💡</span>
                </div>
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                  InsightOS uses GPT-4o mapping to your SaaS data. Try asking for summaries, cohort analysis, or drop-off reasons.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-80 shrink-0 lg:h-full pb-6 lg:pb-0 hidden lg:block">
        <QueryHistory onSelectQuery={handleSelectHistory} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
