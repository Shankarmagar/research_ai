import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchInput = ({ onSearch, isLoading }: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="search-glow">
        <div className={cn(
          "relative flex items-center gap-3 px-6 py-4 rounded-xl",
          "bg-secondary/50 border border-border/50",
          "transition-all duration-300",
          "focus-within:border-primary/50 focus-within:bg-secondary/70"
        )}>
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a topic to research..."
            className={cn(
              "flex-1 bg-transparent border-none outline-none",
              "text-foreground placeholder:text-muted-foreground",
              "text-lg font-body"
            )}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg",
              "bg-primary text-primary-foreground font-medium",
              "transition-all duration-200",
              "hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-lg shadow-primary/20"
            )}
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Researching..." : "Research"}
          </button>
        </div>
      </div>
    </form>
  );
};
