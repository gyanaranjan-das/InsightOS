import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function LoadingSkeleton() {
  return (
    <Card className="border-primary/20 bg-primary/5 animate-pulse">
      <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <Skeleton className="h-5 w-48 bg-primary/20" />
      </CardHeader>
      <CardContent className="pt-5 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-primary/10" />
          <Skeleton className="h-4 w-[90%] bg-primary/10" />
          <Skeleton className="h-4 w-[95%] bg-primary/10" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 bg-primary/20" />
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary/30" />
            <Skeleton className="h-4 w-3/4 bg-primary/10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary/30" />
            <Skeleton className="h-4 w-2/3 bg-primary/10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
