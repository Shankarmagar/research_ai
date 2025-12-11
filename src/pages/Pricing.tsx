import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription, PLANS, type PlanType } from '../hooks/useSubscription';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Check, Sparkles, ArrowLeft, Crown, Zap, Building2, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const PlanIcon = ({ plan }: { plan: PlanType }) => {
  const icons = {
    free: Zap,
    pro: Crown,
    enterprise: Building2
  };
  const Icon = icons[plan];
  return <Icon className="w-6 h-6" />;
};

const Pricing = () => {
  const { user } = useAuth();
  const { subscription, createCheckout, openCustomerPortal, loading, refreshSubscription } = useSubscription();
  const [upgrading, setUpgrading] = useState<PlanType | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle success/cancel redirects from Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast({
        title: 'Payment successful!',
        description: 'Your subscription is now active. Refreshing...',
      });
      refreshSubscription();
      window.history.replaceState({}, '', '/pricing');
    } else if (canceled === 'true') {
      toast({
        title: 'Payment canceled',
        description: 'You can try again anytime.',
        variant: 'destructive'
      });
      window.history.replaceState({}, '', '/pricing');
    }
  }, [searchParams, toast, refreshSubscription]);

  const handleUpgrade = async (plan: PlanType) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (plan === 'free') return;

    setUpgrading(plan);
    
    const { error } = await createCheckout(plan);
    
    if (error) {
      toast({
        title: 'Checkout failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
    
    setUpgrading(null);
  };

  const handleManageSubscription = async () => {
    const { error } = await openCustomerPortal();
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Could not open subscription management. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const currentPlan = subscription?.plan || 'free';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Research</span>
          </button>
          <div className="flex items-center gap-4">
            {currentPlan !== 'free' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Subscription
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-semibold text-foreground">ResearchAI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full power of AI-driven research with our flexible plans
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {(Object.entries(PLANS) as [PlanType, typeof PLANS.free][]).map(([key, plan]) => {
            const isCurrentPlan = currentPlan === key;
            const isPro = key === 'pro';
            const isDowngrade = currentPlan !== 'free' && 
              (key === 'free' || (currentPlan === 'enterprise' && key === 'pro'));

            return (
              <div
                key={key}
                className={cn(
                  "relative rounded-2xl border p-8 transition-all duration-300",
                  isPro 
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-105" 
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isPro ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  )}>
                    <PlanIcon plan={key} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={cn(
                        "w-5 h-5 mt-0.5 flex-shrink-0",
                        isPro ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(key)}
                  disabled={isCurrentPlan || loading || upgrading !== null || isDowngrade || key === 'free'}
                  className={cn(
                    "w-full py-6",
                    isPro 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary hover:bg-secondary/80 text-foreground",
                    (isCurrentPlan || isDowngrade) && "opacity-50"
                  )}
                >
                  {upgrading === key 
                    ? 'Opening checkout...' 
                    : isCurrentPlan 
                      ? 'Current Plan' 
                      : isDowngrade
                        ? 'Use Portal to Downgrade'
                        : key === 'free'
                          ? 'Free Plan'
                          : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Info Notice */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            💳 Secure payments powered by Stripe. Cancel anytime from the subscription portal.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
