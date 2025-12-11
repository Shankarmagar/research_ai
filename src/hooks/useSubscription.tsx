import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export type PlanType = 'free' | 'pro' | 'enterprise';

interface Subscription {
  id: string;
  plan: PlanType;
  status: string;
  research_count: number;
  monthly_limit: number;
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    limit: 5,
    priceId: null,
    features: ['5 researches/month', 'Basic export (PDF)', 'Standard AI model']
  },
  pro: {
    name: 'Pro',
    price: 19,
    limit: 50,
    priceId: 'price_1Sa6pYEpWxBqC9nGjpVXdKL0',
    features: ['50 researches/month', 'All export formats', 'Priority AI processing', 'Research history']
  },
  enterprise: {
    name: 'Enterprise',
    price: 49,
    limit: 999,
    priceId: 'price_1Sa6pkEpWxBqC9nGcV8MQDdO',
    features: ['Unlimited researches', 'All export formats', 'Priority support', 'Custom AI prompts', 'API access']
  }
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setSubscription(data as Subscription);
    }
    setLoading(false);
  }, [user]);

  const checkStripeSubscription = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (!error && data) {
        // Refresh local subscription data after Stripe check
        await fetchSubscription();
      }
    } catch (err) {
      console.error('Error checking Stripe subscription:', err);
    }
  }, [user, fetchSubscription]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Check Stripe subscription status on mount and periodically
  useEffect(() => {
    if (user) {
      checkStripeSubscription();
      const interval = setInterval(checkStripeSubscription, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user, checkStripeSubscription]);

  const createCheckout = async (plan: PlanType) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const priceId = PLANS[plan].priceId;
    if (!priceId) return { error: new Error('Invalid plan') };

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const incrementResearchCount = async () => {
    if (!user || !subscription) return;

    await supabase
      .from('subscriptions')
      .update({ research_count: subscription.research_count + 1 })
      .eq('user_id', user.id);
    
    await fetchSubscription();
  };

  const canResearch = subscription ? subscription.research_count < subscription.monthly_limit : false;

  return { 
    subscription, 
    loading, 
    createCheckout, 
    openCustomerPortal,
    incrementResearchCount, 
    canResearch,
    refreshSubscription: checkStripeSubscription 
  };
};
