'use client';

import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

const STARTER_PROMPTS = [
  'Why did churn increase last week?',
  'What is my most used feature?',
  'Show me retention by cohort',
];

export function QueryInput({ onSubmit, disabled }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || disabled) return;
    onSubmit(query.trim());
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative rounded-xl border border-border bg-card shadow-sm focus-within:ring-1 focus-within:ring-primary">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask InsightOS about your data..."
          disabled={disabled}
          className="min-h-[100px] w-full resize-none rounded-xl bg-transparent p-4 pr-12 focus:outline-none disabled:opacity-50"
        />
        <div className="absolute bottom-3 right-3 flex items-center justify-between pointer-events-none w-[calc(100%-24px)]">
          <div className="pointer-events-auto">
            <Sparkles className="h-5 w-5 text-primary/60" />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!query.trim() || disabled}
            className="h-8 w-8 rounded-lg pointer-events-auto transition-transform active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Ask</span>
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              setQuery(prompt);
              onSubmit(prompt);
              setQuery('');
            }}
            disabled={disabled}
            className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
