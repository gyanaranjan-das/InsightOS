'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { TeamSettings } from '@/components/settings/TeamSettings';
import { ApiSettings } from '@/components/settings/ApiSettings';
import { BillingSettings } from '@/components/settings/BillingSettings';

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col space-y-6 max-w-5xl mx-auto w-full pb-8">
      <div className="space-y-1 py-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your workspace, team, and billing.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="team">
          <TeamSettings />
        </TabsContent>
        <TabsContent value="api">
          <ApiSettings />
        </TabsContent>
        <TabsContent value="billing">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
