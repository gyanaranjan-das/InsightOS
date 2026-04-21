'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for small side projects',
    features: ['10,000 events/mo', '1 team member', '7-day retention', 'Standard support'],
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For growing businesses and startups',
    features: ['100,000 events/mo', '5 team members', '30-day retention', 'AI Insights access', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale applications',
    features: ['Unlimited events', 'Unlimited members', 'Unlimited retention', 'Custom integrations', 'Dedicated CSM'],
  },
];

export function BillingSettings() {
  const { org } = useAuthStore();
  const currentPlan = org?.plan || 'starter';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isActive = currentPlan.toLowerCase() === plan.name.toLowerCase();
          
          return (
            <Card key={plan.name} className={`relative flex flex-col ${isActive ? 'border-primary shadow-md' : 'border-border'}`}>
              {isActive && (
                <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                  <Badge className="bg-primary hover:bg-primary">Current Plan</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="h-10">{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={isActive ? 'outline' : 'default'} 
                  className="w-full" 
                  disabled={isActive}
                >
                  {isActive ? 'Manage Subscription' : 'Upgrade Plan'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
