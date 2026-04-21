'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export function TeamSettings() {
  const { user } = useAuthStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'MEMBER' });
  const [inviting, setInviting] = useState(false);

  const isAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/org/members');
      setMembers(data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInvite = async () => {
    if (!inviteData.email || !inviteData.name) return;
    try {
      setInviting(true);
      await api.post('/api/org/invite', inviteData);
      toast.success('Team member invited successfully');
      setInviteOpen(false);
      setInviteData({ email: '', name: '', role: 'MEMBER' });
      fetchMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to invite member');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/api/org/members/${id}`);
      toast.success('Member removed');
      fetchMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to remove member');
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await api.put(`/api/org/members/${id}`, { role });
      toast.success('Role updated');
      fetchMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update role');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER': return <Badge variant="default">Owner</Badge>;
      case 'ADMIN': return <Badge variant="secondary">Admin</Badge>;
      case 'VIEWER': return <Badge variant="outline" className="text-muted-foreground">Viewer</Badge>;
      default: return <Badge variant="outline">Member</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-end justify-between space-y-0">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage who has access to this workspace.</CardDescription>
        </div>
        {isAdmin && (
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger>
              <span className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">Invite Member</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite true member</DialogTitle>
                <DialogDescription>Add a new member to your organization.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={inviteData.name} onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={inviteData.email} onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteData.role} onValueChange={(role: string | null) => setInviteData({ ...inviteData, role: role || 'MEMBER' })}>
                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInvite} disabled={inviting || !inviteData.email || !inviteData.name}>
                  {inviting ? 'Inviting...' : 'Send Invite'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="h-12 bg-muted/50 rounded animate-pulse" />
            <div className="h-12 bg-muted/50 rounded animate-pulse" />
            <div className="h-12 bg-muted/50 rounded animate-pulse" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.name} {user?.id === member._id && '(You)'}</span>
                          <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin && member.role !== 'OWNER' && user?.id !== member._id ? (
                        <Select value={member.role} onValueChange={(r: string | null) => handleRoleChange(member._id, r || 'MEMBER')}>
                          <SelectTrigger className="w-[110px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MEMBER">Member</SelectItem>
                            <SelectItem value="VIEWER">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getRoleBadge(member.role)
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        {member.role !== 'OWNER' && user?.id !== member._id && (
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-8" onClick={() => handleRemove(member._id)}>
                            Remove
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
