'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Key } from 'lucide-react';
import { toast } from 'sonner';

export function ApiSettings() {
  const [apiKey] = useState('ik_7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p'); // In a real app this would be fetched from API

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API Key copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Access</CardTitle>
        <CardDescription>Use this key to send events to InsightOS from your application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium leading-none">Project API Key</label>
          <div className="flex max-w-md space-x-2">
            <Input value={apiKey} readOnly className="font-mono text-sm" type="password" />
            <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Include this in the <code>X-Project-Key</code> header of your requests.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 bg-muted/20">
        <Button variant="secondary" className="gap-2">
          <Key className="h-4 w-4" /> Regenerate Key
        </Button>
      </CardFooter>
    </Card>
  );
}
