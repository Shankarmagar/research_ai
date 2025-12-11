import { History, Search, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

interface HistoryItem {
  id: string;
  topic: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (topic: string) => void;
  onClear: () => void;
}

export const HistorySidebar = ({ history, onSelect, onClear }: HistorySidebarProps) => {
  return (
    <div className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <History className="w-5 h-5" />
          <span className="font-medium">Research History</span>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-center px-4">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Your research history will appear here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.topic)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  "hover:bg-sidebar-accent group"
                )}
              >
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {item.topic}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {history.length > 0 && (
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={onClear}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 rounded-lg",
              "text-sm text-muted-foreground hover:text-destructive",
              "hover:bg-destructive/10 transition-colors"
            )}
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};
