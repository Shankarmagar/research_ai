import { useState, useCallback } from "react";
import { Brain, Sparkles } from "lucide-react";
import { SearchInput } from "../components/SearchInput";
import { ResearchResult } from "../components/ResearchResult";
import { HistorySidebar } from "../components/HistorySidebar";
import { LoadingState } from "../components/LoadingState.tsx";
import { UserMenu } from "../components/UserMenu.tsx";
import { useResearch } from "../hooks/useResearch";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";

interface HistoryItem {
  id: string;
  topic: string;
  timestamp: Date;
}

const Index = () => {
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { content, isLoading, error, research, reset } = useResearch();
  const { user } = useAuth();
  const { subscription, canResearch, incrementResearchCount } = useSubscription();
  const { toast } = useToast();

  const handleSearch = useCallback(async (topic: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start researching.",
        variant: "destructive"
      });
      return;
    }

    if (!canResearch) {
      toast({
        title: "Limit reached",
        description: "You've reached your monthly research limit. Upgrade your plan for more.",
        variant: "destructive"
      });
      return;
    }

    setCurrentTopic(topic);
    reset();
    
    // Add to history
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      topic,
      timestamp: new Date(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 19)]);

    await research(topic);
    await incrementResearchCount();
  }, [research, reset, user, canResearch, incrementResearchCount, toast]);

  const handleHistorySelect = useCallback((topic: string) => {
    handleSearch(topic);
  }, [handleSearch]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Your research history has been cleared.",
    });
  }, [toast]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <HistorySidebar
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Top Bar */}
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border/50 px-6 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                <span className="font-display font-semibold text-foreground">ResearchAI</span>
              </div>
              <UserMenu />
            </div>
          </div>

          {/* Hero Section */}
          <header className={cn(
            "pt-12 pb-10 px-6",
            "bg-gradient-to-b from-card/50 to-transparent"
          )}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10 glow-effect">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                AI Research <span className="gradient-text">Agent</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Explore any topic with AI-powered research. Get comprehensive insights, 
                images, videos, and sources — then export as PDF or Word.
              </p>

              <SearchInput onSearch={handleSearch} isLoading={isLoading} />

              {/* Usage indicator for logged in users */}
              {user && subscription && (
                <div className="mt-4 text-sm text-muted-foreground">
                  {subscription.research_count} / {subscription.monthly_limit} researches used this month
                </div>
              )}

              {/* Quick Topics */}
              {!currentTopic && !isLoading && (
                <div className="mt-8 animate-fade-in">
                  <p className="text-sm text-muted-foreground mb-3">Try researching:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Quantum Computing", "Climate Change", "Renaissance Art", "Space Exploration", "Blockchain Technology"].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleSearch(topic)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm",
                          "bg-secondary/50 text-secondary-foreground",
                          "hover:bg-secondary transition-colors",
                          "border border-border/30"
                        )}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Results Section */}
          <section className="flex-1 px-6 pb-16">
            {error && (
              <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
                {error}
              </div>
            )}

            {isLoading && <LoadingState />}

            {content && !isLoading && (
              <ResearchResult content={content} topic={currentTopic} />
            )}

            {!currentTopic && !isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {user ? "Enter a topic above to start your research journey" : "Sign in to start researching"}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
