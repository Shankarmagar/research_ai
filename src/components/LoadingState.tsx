import { cn } from "../lib/utils";

export const LoadingState = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-secondary/50 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-secondary/50 rounded-lg animate-pulse" />
      </div>

      {/* Content skeletons */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-panel p-6"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
            <div className="w-5 h-5 bg-primary/30 rounded animate-pulse" />
            <div className="h-6 w-40 bg-secondary/50 rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-secondary/40 rounded animate-pulse" />
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-3 py-8">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full bg-primary animate-pulse-subtle"
              )}
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <span className="text-muted-foreground">Researching your topic...</span>
      </div>
    </div>
  );
};
