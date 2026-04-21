'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, MessageSquare, ChevronRight } from 'lucide-react';

interface AIQueryRecord {
  _id: string;
  question: string;
  createdAt: string;
  result: any;
}

interface QueryHistoryProps {
  onSelectQuery: (query: string, result: any) => void;
  refreshTrigger?: number;
}

export function QueryHistory({ onSelectQuery, refreshTrigger }: QueryHistoryProps) {
  const [history, setHistory] = useState<AIQueryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/api/ai/history');
        setHistory(data.queries || []);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [refreshTrigger]);

  return (
    <Card className="h-full flex flex-col border-border shadow-sm">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <History className="h-4 w-4" />
          Past Queries
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[calc(100vh-14rem)]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
              No queries yet. Start asking questions!
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {history.map((record) => (
                <button
                  key={record._id}
                  onClick={() => onSelectQuery(record.question, record.result)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg text-left hover:bg-muted/50 transition-colors group"
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{record.question}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
