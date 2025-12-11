import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription, PLANS } from '../hooks/useSubscription';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { User, LogOut, CreditCard, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        onClick={() => navigate('/auth')}
        variant="outline"
        className="border-primary/50 text-primary hover:bg-primary/10"
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const currentPlan = subscription?.plan || 'free';
  const planInfo = PLANS[currentPlan];
  const usagePercent = subscription 
    ? Math.round((subscription.research_count / subscription.monthly_limit) * 100)
    : 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
              {user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{currentPlan} Plan</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border-border">
        {/* Usage */}
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground mb-2">Monthly Usage</p>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-foreground">
              {subscription?.research_count || 0} / {subscription?.monthly_limit || 5}
            </span>
            <span className={cn(
              "text-xs",
              usagePercent >= 80 ? "text-destructive" : "text-muted-foreground"
            )}>
              {usagePercent}%
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                usagePercent >= 80 ? "bg-destructive" : "bg-primary"
              )}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem
          onClick={() => navigate('/pricing')}
          className="cursor-pointer"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {currentPlan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem
          onClick={signOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
