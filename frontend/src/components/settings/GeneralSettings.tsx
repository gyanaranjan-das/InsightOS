'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function GeneralSettings() {
  const { org, updateOrg, user } = useAuthStore();
  const [name, setName] = useState(org?.name || '');
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      const { data } = await api.put('/api/org', { name });
      updateOrg({ name: data.name, slug: data.slug });
      toast.success('Organization updated successfully.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update organization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>Update your organization&apos;s basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 max-w-sm">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input 
              id="orgName" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={!isAdmin}
            />
          </div>
          <div className="grid gap-2 max-w-sm">
            <Label htmlFor="orgSlug">Workspace Slug (Read-only)</Label>
            <Input 
              id="orgSlug" 
              value={org?.slug || ''} 
              disabled 
              className="bg-muted"
            />
          </div>
        </CardContent>
        {isAdmin && (
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSave} disabled={loading || name === org?.name}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
