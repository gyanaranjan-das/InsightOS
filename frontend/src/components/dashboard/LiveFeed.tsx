'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface LiveEvent {
  id: string;
  name: string;
  userId: string | null;
  timestamp: string;
}

export function LiveFeed() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const { isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem('insightos_access_token');
    if (!token) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    
    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('new_event', (event: LiveEvent) => {
      setEvents((prev) => {
        const updated = [event, ...prev].slice(0, 50); // keep last 50
        return updated;
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <Card className="col-span-1 lg:col-span-2 flex flex-col h-full max-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          Live Event Feed
        </CardTitle>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-muted-foreground uppercase font-semibold">Active</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {events.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground flex-col gap-3 object-cover p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Activity className="h-6 w-6 text-muted-foreground/50" />
            </div>
            Listening for live events...
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-start justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs">{event.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    User: {event.userId || 'Anonymous'}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
